"use client";

import Link from "next/link";
import { useLang } from "@/lib/language-context";
import type { ProductDTO } from "@/lib/types";

export default function ProductCard({ product }: { product: ProductDTO }) {
  const { lang, t, formatPrice, localizedAge } = useLang();
  const name = lang === "bn" ? product.nameBn : product.nameEn;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={name}
          className="h-full w-full object-cover transition group-hover:scale-105"
          loading="lazy"
        />
        {product.comparePrice && (
          <span className="absolute left-2 top-2 rounded-full bg-rose-600 px-2 py-1 text-xs font-bold text-white">
            -{Math.round((1 - product.price / product.comparePrice) * 100)}%
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="mb-1 line-clamp-2 min-h-12 font-semibold leading-snug">{name}</h3>
        <p className="mb-2 text-xs text-gray-500">
          {t(`cat_${product.category}` as "cat_men")}
          {product.ageGroup ? ` · ${localizedAge(product.ageGroup)}` : ""}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-rose-600">{formatPrice(product.price)}</span>
          {product.comparePrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
