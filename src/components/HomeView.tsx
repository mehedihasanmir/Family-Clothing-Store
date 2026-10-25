"use client";

import Link from "next/link";
import { useLang } from "@/lib/language-context";
import { occasionLabel } from "@/lib/catalog";
import ProductCard from "./ProductCard";
import type { ProductDTO } from "@/lib/types";

const HOME_OCCASIONS = [
  { id: "eid", icon: "🌙" },
  { id: "pohela-boishakh", icon: "🎊" },
  { id: "wedding", icon: "💍" },
  { id: "winter", icon: "🧣" },
];

export default function HomeView({ featured }: { featured: ProductDTO[] }) {
  const { t, lang } = useLang();

  const trustItems = [
    { icon: "💵", title: t("trust_cod"), desc: t("trust_cod_desc") },
    { icon: "🚚", title: t("trust_delivery"), desc: t("trust_delivery_desc") },
    { icon: "↩️", title: t("trust_return"), desc: t("trust_return_desc") },
    { icon: "📞", title: t("trust_support"), desc: t("trust_support_desc") },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-50 via-amber-50 to-sky-50">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:py-20">
          <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-5xl">
            {t("hero_title")}
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-gray-600 sm:text-lg">
            {t("hero_subtitle")}
          </p>
          <Link
            href="/products"
            className="inline-block rounded-full bg-rose-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-rose-700 active:scale-95"
          >
            {t("hero_cta")} →
          </Link>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-6 sm:grid-cols-4">
          {trustItems.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <p className="text-sm font-bold">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-3 gap-3 sm:gap-6">
          <Link
            href="/products?category=men"
            className="rounded-2xl bg-sky-100 p-6 text-center font-bold transition hover:bg-sky-200 sm:text-lg"
          >
            👔 {t("nav_men")}
          </Link>
          <Link
            href="/products?category=women"
            className="rounded-2xl bg-rose-100 p-6 text-center font-bold transition hover:bg-rose-200 sm:text-lg"
          >
            👗 {t("nav_women")}
          </Link>
          <Link
            href="/products?category=kids"
            className="rounded-2xl bg-amber-100 p-6 text-center font-bold transition hover:bg-amber-200 sm:text-lg"
          >
            🧒 {t("nav_kids")}
          </Link>
        </div>

        {/* Occasion collections (Eid, Pohela Boishakh etc.) */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-6">
          {HOME_OCCASIONS.map((oc) => (
            <Link
              key={oc.id}
              href={`/products?occasion=${oc.id}`}
              className="rounded-2xl border-2 border-dashed border-rose-200 bg-white p-4 text-center font-semibold transition hover:border-rose-400 hover:bg-rose-50"
            >
              {oc.icon} {occasionLabel(oc.id, lang)}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold sm:text-2xl">{t("featured")}</h2>
          <Link href="/products" className="font-semibold text-rose-600 hover:underline">
            {t("view_all")} →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
