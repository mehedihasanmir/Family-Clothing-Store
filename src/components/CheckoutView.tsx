"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/lib/language-context";
import { useCart } from "@/lib/cart-context";
import { DELIVERY_FEE_DHAKA, DELIVERY_FEE_OUTSIDE, FREE_DELIVERY_OVER } from "@/lib/config";

export default function CheckoutView({ onlineEnabled }: { onlineEnabled: boolean }) {
  const { lang, t, formatPrice } = useLang();
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [zone, setZone] = useState<"dhaka" | "outside">("dhaka");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const deliveryFee =
    subtotal >= FREE_DELIVERY_OVER
      ? 0
      : zone === "dhaka"
        ? DELIVERY_FEE_DHAKA
        : DELIVERY_FEE_OUTSIDE;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="mb-2 text-5xl">🛒</p>
        <h1 className="mb-6 text-xl font-bold text-gray-600">{t("cart_empty")}</h1>
        <Link
          href="/products"
          className="inline-block rounded-full bg-rose-600 px-8 py-3 font-bold text-white hover:bg-rose-700"
        >
          {t("continue_shopping")}
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError(t("err_name"));
    if (!/^01[3-9]\d{8}$/.test(phone.trim())) return setError(t("err_phone"));
    if (address.trim().length < 10) return setError(t("err_address"));

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          zone,
          note: note.trim() || null,
          paymentMethod,
          items: items.map((i) => ({
            productId: i.productId,
            size: i.size,
            color: i.color,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "failed");
      clearCart();
      if (data.gatewayUrl) {
        // Online payment: send the customer to the SSLCommerz payment page
        window.location.href = data.gatewayUrl;
        return;
      }
      router.push(`/order/${data.orderId}`);
    } catch {
      setError(t("err_generic"));
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 outline-none focus:border-rose-500";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold">{t("checkout_title")}</h1>
      <p className="mb-6 text-sm text-gray-500">✅ {t("checkout_guest_note")}</p>

      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-5">
        {/* Form */}
        <div className="space-y-4 md:col-span-3">
          <div>
            <label className="mb-1 block font-semibold">{t("your_name")} *</label>
            <input
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("name_placeholder")}
            />
          </div>
          <div>
            <label className="mb-1 block font-semibold">{t("phone")} *</label>
            <input
              className={inputCls}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ""))}
              placeholder={t("phone_placeholder")}
              inputMode="numeric"
              maxLength={11}
            />
          </div>
          <div>
            <label className="mb-1 block font-semibold">{t("address")} *</label>
            <textarea
              className={inputCls}
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t("address_placeholder")}
            />
          </div>
          <div>
            <label className="mb-2 block font-semibold">{t("delivery_area")} *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setZone("dhaka")}
                className={`min-h-12 rounded-xl border-2 px-4 py-3 font-semibold transition ${
                  zone === "dhaka"
                    ? "border-rose-600 bg-rose-50 text-rose-600"
                    : "border-gray-300 bg-white"
                }`}
              >
                {t("inside_dhaka")}
                <span className="block text-xs font-normal text-gray-500">
                  ৳{DELIVERY_FEE_DHAKA}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setZone("outside")}
                className={`min-h-12 rounded-xl border-2 px-4 py-3 font-semibold transition ${
                  zone === "outside"
                    ? "border-rose-600 bg-rose-50 text-rose-600"
                    : "border-gray-300 bg-white"
                }`}
              >
                {t("outside_dhaka")}
                <span className="block text-xs font-normal text-gray-500">
                  ৳{DELIVERY_FEE_OUTSIDE}
                </span>
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1 block font-semibold">{t("order_note")}</label>
            <input
              className={inputCls}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Payment method */}
          <div>
            <label className="mb-2 block font-semibold">{t("payment_method")}</label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={`w-full rounded-xl border-2 p-4 text-left transition ${
                  paymentMethod === "COD"
                    ? "border-rose-600 bg-rose-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <p className="font-bold">
                  💵 {t("cod")} {paymentMethod === "COD" && "✓"}
                </p>
                <p className="text-sm text-gray-600">{t("cod_desc")}</p>
              </button>
              {onlineEnabled ? (
                <button
                  type="button"
                  onClick={() => setPaymentMethod("ONLINE")}
                  className={`w-full rounded-xl border-2 p-4 text-left transition ${
                    paymentMethod === "ONLINE"
                      ? "border-rose-600 bg-rose-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <p className="font-bold">
                    💳 {t("online_payment")} {paymentMethod === "ONLINE" && "✓"}
                  </p>
                  <p className="text-sm text-gray-600">{t("online_desc")}</p>
                </button>
              ) : (
                <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-4 opacity-60">
                  <p className="font-bold">💳 {t("online_payment")}</p>
                  <p className="text-sm text-gray-500">{t("online_coming_soon")}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="md:col-span-2">
          <div className="sticky top-32 rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-lg font-bold">{t("order_summary")}</h2>
            <div className="mb-4 space-y-2 border-b border-gray-100 pb-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex justify-between gap-2 text-sm"
                >
                  <span className="text-gray-600">
                    {lang === "bn" ? item.nameBn : item.nameEn} ({item.size}) × {item.quantity}
                  </span>
                  <span className="font-semibold whitespace-nowrap">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-gray-600">{t("subtotal")}</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="mb-3 flex justify-between text-sm">
              <span className="text-gray-600">{t("delivery_fee")}</span>
              <span className="font-semibold">
                {deliveryFee === 0 ? t("free") : formatPrice(deliveryFee)}
              </span>
            </div>
            {subtotal < FREE_DELIVERY_OVER && (
              <p className="mb-3 text-xs text-green-600">
                💡 {t("free_delivery_hint", { amount: FREE_DELIVERY_OVER })}
              </p>
            )}
            <div className="mb-4 flex justify-between border-t border-gray-100 pt-3 text-lg font-bold">
              <span>{t("total")}</span>
              <span className="text-rose-600">{formatPrice(total)}</span>
            </div>

            {error && (
              <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-600">
                ⚠️ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-rose-600 py-4 text-lg font-bold text-white transition hover:bg-rose-700 active:scale-95 disabled:opacity-50"
            >
              {submitting ? t("placing_order") : `✅ ${t("place_order")}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
