import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validatePayment } from "@/lib/sslcommerz";
import { sendSms, orderConfirmationMessage } from "@/lib/sms";

// SSLCommerz redirects the customer's browser here (POST) after successful payment.
export async function POST(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  try {
    const form = await req.formData();
    const valId = String(form.get("val_id") ?? "");
    const tranId = String(form.get("tran_id") ?? "");

    const order = await prisma.order.findUnique({ where: { tranId } });
    if (!order) return NextResponse.redirect(`${baseUrl}/`, 303);

    // Always verify with SSLCommerz's validation API - never trust the redirect alone
    const validation = await validatePayment(valId);
    if (validation.valid && Math.round(validation.amount) >= order.total) {
      await prisma.order.update({
        where: { id: order.id },
        data: { paid: true, status: "CONFIRMED" },
      });
      await sendSms(order.phone, orderConfirmationMessage(order.id, order.total));
      return NextResponse.redirect(`${baseUrl}/order/${order.id}`, 303);
    }

    await prisma.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
    return NextResponse.redirect(`${baseUrl}/order/${order.id}?payment=failed`, 303);
  } catch (e) {
    console.error("payment success handler error:", e);
    return NextResponse.redirect(`${baseUrl}/`, 303);
  }
}
