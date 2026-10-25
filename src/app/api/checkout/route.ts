import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DELIVERY_FEE_DHAKA, DELIVERY_FEE_OUTSIDE, FREE_DELIVERY_OVER } from "@/lib/config";
import { sendSms, orderConfirmationMessage } from "@/lib/sms";
import { isOnlinePaymentEnabled, createPaymentSession } from "@/lib/sslcommerz";

type CheckoutItem = {
  productId: string;
  size: string;
  color: string;
  quantity: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, phone, address, zone, note, paymentMethod, items } = body as {
      customerName: string;
      phone: string;
      address: string;
      zone: "dhaka" | "outside";
      note: string | null;
      paymentMethod: "COD" | "ONLINE";
      items: CheckoutItem[];
    };

    // --- Validation (never trust the browser) ---
    if (!customerName || customerName.trim().length < 2) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }
    if (!/^01[3-9]\d{8}$/.test(phone)) {
      return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
    }
    if (!address || address.trim().length < 10) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }
    for (const i of items) {
      if (!i.productId || !i.size || !i.color || !Number.isInteger(i.quantity) || i.quantity < 1 || i.quantity > 20) {
        return NextResponse.json({ error: "Invalid item" }, { status: 400 });
      }
    }
    const method = paymentMethod === "ONLINE" && isOnlinePaymentEnabled() ? "ONLINE" : "COD";

    // --- Recalculate prices from the database (ignore any client-sent prices) ---
    const productIds = [...new Set(items.map((i) => i.productId))];
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const orderItems = [];
    for (const i of items) {
      const p = productMap.get(i.productId);
      if (!p) return NextResponse.json({ error: "Product not found" }, { status: 400 });
      subtotal += p.price * i.quantity;
      orderItems.push({
        productId: p.id,
        nameEn: p.nameEn,
        nameBn: p.nameBn,
        size: i.size,
        color: i.color,
        price: p.price,
        quantity: i.quantity,
      });
    }

    const deliveryFee =
      subtotal >= FREE_DELIVERY_OVER
        ? 0
        : zone === "dhaka"
          ? DELIVERY_FEE_DHAKA
          : DELIVERY_FEE_OUTSIDE;

    const order = await prisma.order.create({
      data: {
        customerName: customerName.trim(),
        phone,
        address: address.trim(),
        district: zone === "dhaka" ? "Dhaka" : "Outside Dhaka",
        note,
        paymentMethod: method,
        deliveryFee,
        subtotal,
        total: subtotal + deliveryFee,
        items: { create: orderItems },
      },
    });

    // --- Online payment: create an SSLCommerz session and send the user to the gateway ---
    if (method === "ONLINE") {
      const tranId = `${order.id}-${Date.now()}`;
      await prisma.order.update({ where: { id: order.id }, data: { tranId } });
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
      try {
        const gatewayUrl = await createPaymentSession(
          { ...order, tranId, total: order.total },
          baseUrl
        );
        return NextResponse.json({ orderId: order.id, gatewayUrl });
      } catch (e) {
        console.error("SSLCommerz session error:", e);
        // Fall back: keep the order as COD so the sale isn't lost
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentMethod: "COD" },
        });
      }
    }

    // --- COD: send confirmation SMS (skipped automatically if gateway not configured) ---
    await sendSms(phone, orderConfirmationMessage(order.id, order.total));

    return NextResponse.json({ orderId: order.id });
  } catch (e) {
    console.error("checkout error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
