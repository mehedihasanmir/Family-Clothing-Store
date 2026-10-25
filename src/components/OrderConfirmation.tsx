"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/lib/language-context";
import { trackEvent } from "@/components/FacebookPixel";

type OrderData = {
  id: number;
  customerName: string;
  phone: string;
  address: string;
  district: string;
  paymentMethod: string;
  paid: boolean;
  deliveryFee: number;
  subtotal: number;
  total: number;
  items: {
    nameEn: string;
    nameBn: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
  }[];
};

export default function OrderConfirmation({
  order,
  paymentFailed = false,
}: {
  order: OrderData;
  paymentFailed?: boolean;
}) {
  const { lang, t, formatPrice } = useLang();

  useEffect(() => {
    if (!paymentFailed) {
      trackEvent("Purchase", { value: order.total, currency: "BDT" });
    }
  }, [order.total, paymentFailed]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      {paymentFailed ? (
        <div className="mb-6 rounded-2xl bg-red-50 p-6 text-center">
          <p className="mb-2 text-5xl">❌</p>
          <h1 className="mb-2 text-xl font-bold text-red-700">{t("payment_failed")}</h1>
          <p className="text-lg font-bold">
            {t("order_number")}: <span className="text-rose-600">#{order.id}</span>
          </p>
        </div>
      ) : (
        <div className="mb-6 rounded-2xl bg-green-50 p-6 text-center">
          <p className="mb-2 text-5xl">✅</p>
          <h1 className="mb-2 text-2xl font-bold text-green-700">{t("order_thanks")}</h1>
          <p className="text-lg font-bold">
            {t("order_number")}: <span className="text-rose-600">#{order.id}</span>
          </p>
          <p className="mt-2 text-sm text-gray-600">{t("order_confirm_sms")}</p>
          {order.paid ? (
            <p className="mt-1 text-sm font-semibold text-green-700">✓ {t("order_paid")}</p>
          ) : (
            <p className="mt-1 text-sm font-semibold text-gray-700">
              💵 {t("order_cod_reminder", { total: formatPrice(order.total) })}
            </p>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-bold">{t("order_summary")}</h2>
        <div className="mb-4 space-y-2 border-b border-gray-100 pb-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between gap-2 text-sm">
              <span className="text-gray-600">
                {lang === "bn" ? item.nameBn : item.nameEn} ({item.size}, {item.color}) ×{" "}
                {item.quantity}
              </span>
              <span className="font-semibold whitespace-nowrap">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="mb-1 flex justify-between text-sm">
          <span className="text-gray-600">{t("subtotal")}</span>
          <span className="font-semibold">{formatPrice(order.subtotal)}</span>
        </div>
        <div className="mb-3 flex justify-between text-sm">
          <span className="text-gray-600">{t("delivery_fee")}</span>
          <span className="font-semibold">
            {order.deliveryFee === 0 ? t("free") : formatPrice(order.deliveryFee)}
          </span>
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-3 text-lg font-bold">
          <span>{t("total")}</span>
          <span className="text-rose-600">{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="inline-block rounded-full bg-rose-600 px-8 py-3 font-bold text-white hover:bg-rose-700"
        >
          {t("back_home")}
        </Link>
      </div>
    </div>
  );
}
