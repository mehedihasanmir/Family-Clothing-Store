"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/lib/language-context";
import { useCart } from "@/lib/cart-context";
import { typeLabel, occasionLabel } from "@/lib/catalog";
import { trackEvent } from "@/components/FacebookPixel";
import type { ProductDTO } from "@/lib/types";

const KIDS_SIZE_CHART = [
  { size: "S", chest: "24-26", length: "17-18", age: "2-3" },
  { size: "M", chest: "26-28", length: "19-20", age: "4-5" },
  { size: "L", chest: "28-30", length: "21-22", age: "6-7" },
  { size: "XL", chest: "30-32", length: "23-24", age: "8-9" },
];

const ADULT_SIZE_CHART = [
  { size: "S", chest: "36-38", length: "26-27", age: "" },
  { size: "M", chest: "38-40", length: "27-28", age: "" },
  { size: "L", chest: "40-42", length: "28-29", age: "" },
  { size: "XL", chest: "42-44", length: "29-30", age: "" },
  { size: "XXL", chest: "44-46", length: "30-31", age: "" },
];

export default function ProductDetail({ product }: { product: ProductDTO }) {
  const { lang, t, formatPrice, localizedAge } = useLang();
  const { addItem } = useCart();
  const router = useRouter();

  const sizes = product.sizes.split(",");
  const colors = product.colors.split(",");

  const [size, setSize] = useState(sizes[0]);
  const [color, setColor] = useState(colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const name = lang === "bn" ? product.nameBn : product.nameEn;
  const description = lang === "bn" ? product.descriptionBn : product.descriptionEn;

  const isKids = product.category === "kids";
  const letterSizes = ["S", "M", "L", "XL", "XXL"];
  const showSizeChart = isKids || sizes.some((s) => letterSizes.includes(s));
  const sizeChart = isKids ? KIDS_SIZE_CHART : ADULT_SIZE_CHART;

  const handleAdd = () => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        nameEn: product.nameEn,
        nameBn: product.nameBn,
        image: product.image,
        price: product.price,
        size,
        color,
      },
      quantity
    );
    trackEvent("AddToCart", {
      content_name: product.nameEn,
      value: product.price * quantity,
      currency: "BDT",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAdd();
    router.push("/checkout");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={name} className="aspect-square w-full object-cover" />
        </div>

        {/* Info */}
        <div>
          <p className="mb-1 text-sm text-gray-500">
            {t(`cat_${product.category}` as "cat_men")}
            {product.productType ? ` · ${typeLabel(product.productType, lang)}` : ""}
            {product.ageGroup ? ` · ${localizedAge(product.ageGroup)}` : ""}
          </p>
          <h1 className="mb-3 text-2xl font-bold sm:text-3xl">{name}</h1>

          {/* Occasion badges */}
          {product.occasions && (
            <div className="mb-3 flex flex-wrap gap-2">
              {product.occasions.split(",").map((oc) => (
                <Link
                  key={oc}
                  href={`/products?occasion=${oc}`}
                  className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-200"
                >
                  🎉 {occasionLabel(oc, lang)}
                </Link>
              ))}
            </div>
          )}

          <div className="mb-6 flex items-center gap-3">
            <span className="text-3xl font-bold text-rose-600">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-xl text-gray-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {/* Size */}
          <div className="mb-4">
            <p className="mb-2 font-semibold">{t("size")}:</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-h-11 min-w-14 rounded-xl border-2 px-4 py-2 font-semibold transition ${
                    size === s
                      ? "border-rose-600 bg-rose-50 text-rose-600"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="mb-4">
            <p className="mb-2 font-semibold">{t("color")}:</p>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`min-h-11 rounded-xl border-2 px-4 py-2 font-semibold transition ${
                    color === c
                      ? "border-rose-600 bg-rose-50 text-rose-600"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <p className="mb-2 font-semibold">{t("quantity")}:</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-11 w-11 rounded-xl border-2 border-gray-300 bg-white text-xl font-bold hover:border-gray-400"
              >
                −
              </button>
              <span className="w-10 text-center text-lg font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="h-11 w-11 rounded-xl border-2 border-gray-300 bg-white text-xl font-bold hover:border-gray-400"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mb-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAdd}
              className={`min-h-13 flex-1 rounded-xl px-6 py-4 text-lg font-bold transition active:scale-95 ${
                added
                  ? "bg-green-600 text-white"
                  : "border-2 border-rose-600 bg-white text-rose-600 hover:bg-rose-50"
              }`}
            >
              {added ? t("added_to_cart") : `🛒 ${t("add_to_cart")}`}
            </button>
            <button
              onClick={handleBuyNow}
              className="min-h-13 flex-1 rounded-xl bg-rose-600 px-6 py-4 text-lg font-bold text-white transition hover:bg-rose-700 active:scale-95"
            >
              ⚡ {t("buy_now")}
            </button>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="mb-2 text-lg font-bold">{t("description")}</h2>
            <p className="leading-relaxed text-gray-600">{description}</p>
          </div>

          {/* Size chart (only for products with standard letter sizes) */}
          {showSizeChart && (
            <div>
              <h2 className="mb-2 text-lg font-bold">📏 {t("size_chart")}</h2>
              <p className="mb-3 text-sm text-gray-500">{t("size_chart_note")}</p>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full bg-white text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-4 py-2 font-bold">{t("sc_size")}</th>
                      <th className="px-4 py-2 font-bold">{t("sc_chest")} (″)</th>
                      <th className="px-4 py-2 font-bold">{t("sc_length")} (″)</th>
                      {isKids && <th className="px-4 py-2 font-bold">{t("sc_age")}</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChart.map((row) => (
                      <tr key={row.size} className="border-t border-gray-100">
                        <td className="px-4 py-2 font-semibold">{row.size}</td>
                        <td className="px-4 py-2">{row.chest}</td>
                        <td className="px-4 py-2">{row.length}</td>
                        {isKids && <td className="px-4 py-2">{localizedAge(row.age)}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
