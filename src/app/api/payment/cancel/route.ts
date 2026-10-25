import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  try {
    const form = await req.formData();
    const tranId = String(form.get("tran_id") ?? "");
    const order = await prisma.order.findUnique({ where: { tranId } });
    if (order && !order.paid) {
      await prisma.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
      return NextResponse.redirect(`${baseUrl}/order/${order.id}?payment=failed`, 303);
    }
  } catch (e) {
    console.error("payment cancel handler error:", e);
  }
  return NextResponse.redirect(`${baseUrl}/`, 303);
}
