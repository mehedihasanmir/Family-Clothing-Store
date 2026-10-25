"use client";

import Link from "next/link";
import { useLang } from "@/lib/language-context";
import { useCart } from "@/lib/cart-context";
import { DELIVERY_FEE_DHAKA, DELIVERY_FEE_OUTSIDE, FREE_DELIVERY_OVER } from "@/lib/config";

export default function CartPage() {
  const { lang, t, formatPrice } = useLang();
  const { items, removeItem, updateQuantity, subtotal } = useCart();

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

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">{t("cart_title")}</h1>

      <div className="mb-6 space-y-3">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.size}-${item.color}`}
            className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={lang === "bn" ? item.nameBn : item.nameEn}
              className="h-20 w-20 rounded-xl object-cover"
            />
            <div className="flex-1">
              <Link href={`/products/${item.slug}`} className="font-semibold hover:text-rose-600">
                {lang === "bn" ? item.nameBn : item.nameEn}
              </Link>
              <p className="text-sm text-gray-500">
                {t("size")}: {item.size} · {t("color")}: {item.color}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                    }
                    className="h-9 w-9 rounded-lg border border-gray-300 font-bold hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                    }
                    className="h-9 w-9 rounded-lg border border-gray-300 font-bold hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <span className="font-bold text-rose-600">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
            <button
              onClick={() => removeItem(item.productId, item.size, item.color)}
              className="self-start text-sm text-gray-400 hover:text-rose-600"
              aria-label={t("remove")}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-2 flex justify-between">
          <span className="text-gray-600">{t("subtotal")}</span>
          <span className="font-bold">{formatPrice(subtotal)}</span>
        </div>
        <p className="mb-4 text-sm text-gray-500">
          {subtotal >= FREE_DELIVERY_OVER
            ? `${t("delivery_fee")}: ${t("free")} 🎉`
            : t("in_dhaka_fee", { dhaka: DELIVERY_FEE_DHAKA, outside: DELIVERY_FEE_OUTSIDE })}
        </p>
        <Link
          href="/checkout"
          className="block w-full rounded-xl bg-rose-600 py-4 text-center text-lg font-bold text-white transition hover:bg-rose-700 active:scale-95"
        >
          {t("go_checkout")} →
        </Link>
      </div>
    </div>
  );
}
