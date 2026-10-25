import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OrderConfirmation from "@/components/OrderConfirmation";

export const dynamic = "force-dynamic";

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment?: string }>;
}) {
  const { id } = await params;
  const { payment } = await searchParams;
  const orderId = parseInt(id, 10);
  if (isNaN(orderId)) notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <OrderConfirmation
      paymentFailed={payment === "failed"}
      order={{
        id: order.id,
        customerName: order.customerName,
        phone: order.phone,
        address: order.address,
        district: order.district,
        paymentMethod: order.paymentMethod,
        paid: order.paid,
        deliveryFee: order.deliveryFee,
        subtotal: order.subtotal,
        total: order.total,
        items: order.items.map((i) => ({
          nameEn: i.nameEn,
          nameBn: i.nameBn,
          size: i.size,
          color: i.color,
          price: i.price,
          quantity: i.quantity,
        })),
      }}
    />
  );
}
