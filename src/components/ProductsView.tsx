"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/language-context";
import { typeLabel, occasionLabel } from "@/lib/catalog";
import ProductCard from "./ProductCard";
import type { ProductDTO } from "@/lib/types";

type Active = {
  category: string;
  type: string;
  occasion: string;
  age: string;
  size: string;
  color: string;
  price: string;
  sort: string;
  q: string;
};

const PRICE_RANGES = ["0-500", "500-1000", "1000-2000", "2000+"];

export default function ProductsView({
  products,
  facets,
  active,
}: {
  products: ProductDTO[];
  facets: {
    types: string[];
    occasions: string[];
    sizes: string[];
    colors: string[];
    ages: string[];
  };
  active: Active;
}) {
  const { t, lang, localizedAge, formatPrice } = useLang();
  const router = useRouter();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const makeUrl = (changes: Partial<Active>) => {
    const next = { ...active, ...changes };
    const params = new URLSearchParams();
    if (next.category) params.set("category", next.category);
    if (next.type) params.set("type", next.type);
    if (next.occasion) params.set("occasion", next.occasion);
    if (next.age) params.set("age", next.age);
    if (next.size) params.set("size", next.size);
    if (next.color) params.set("color", next.color);
    if (next.price) params.set("price", next.price);
    if (next.sort && next.sort !== "newest") params.set("sort", next.sort);
    if (next.q) params.set("q", next.q);
    const qs = params.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  };

  // Changing category resets filters whose options depend on the category
  const categoryUrl = (cat: string) =>
    makeUrl({ category: cat, type: "", occasion: "", size: "", color: "", age: "" });

  const hasActiveFilters =
    active.category ||
    active.type ||
    active.occasion ||
    active.age ||
    active.size ||
    active.color ||
    active.price ||
    active.q;

  const priceLabel = (range: string) => {
    if (range.endsWith("+")) return `${formatPrice(parseInt(range, 10))} ${t("above")}`;
    const [min, max] = range.split("-");
    return `${formatPrice(parseInt(min, 10))} – ${formatPrice(parseInt(max, 10))}`;
  };

  const chip = (isActive: boolean) =>
    `min-h-10 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
      isActive
        ? "border-rose-600 bg-rose-600 text-white"
        : "border-gray-300 bg-white text-gray-700 hover:border-rose-400"
    }`;

  const listItem = (isActive: boolean) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive ? "bg-rose-50 font-bold text-rose-600" : "text-gray-700 hover:bg-gray-100"
    }`;

  const sectionTitle = "mb-2 text-sm font-bold uppercase tracking-wide text-gray-800";

  const filterPanel = (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className={sectionTitle}>{t("category")}</h3>
        <div className="flex flex-col gap-1">
          {[
            { id: "", label: t("all") },
            { id: "men", label: t("cat_men") },
            { id: "women", label: t("cat_women") },
            { id: "kids", label: t("cat_kids") },
          ].map((c) => (
            <Link
              key={c.id || "all"}
              href={categoryUrl(c.id)}
              className={listItem(active.category === c.id)}
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Product type (dress type) */}
      {facets.types.length > 0 && (
        <div>
          <h3 className={sectionTitle}>{t("product_type")}</h3>
          <div className="flex flex-col gap-1">
            {facets.types.map((ty) => (
              <Link
                key={ty}
                href={makeUrl({ type: active.type === ty ? "" : ty })}
                className={listItem(active.type === ty)}
              >
                {typeLabel(ty, lang)}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Occasion (Eid, Pohela Boishakh etc.) */}
      {facets.occasions.length > 0 && (
        <div>
          <h3 className={sectionTitle}>{t("occasion")}</h3>
          <div className="flex flex-wrap gap-2">
            {facets.occasions.map((oc) => (
              <Link
                key={oc}
                href={makeUrl({ occasion: active.occasion === oc ? "" : oc })}
                className={chip(active.occasion === oc)}
              >
                {occasionLabel(oc, lang)}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Age (only for kids) */}
      {active.category === "kids" && facets.ages.length > 0 && (
        <div>
          <h3 className={sectionTitle}>{t("age_group")}</h3>
          <div className="flex flex-wrap gap-2">
            {facets.ages.map((a) => (
              <Link
                key={a}
                href={makeUrl({ age: active.age === a ? "" : a })}
                className={chip(active.age === a)}
              >
                {localizedAge(a)}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Size */}
      <div>
        <h3 className={sectionTitle}>{t("size")}</h3>
        <div className="flex flex-wrap gap-2">
          {facets.sizes.map((s) => (
            <Link
              key={s}
              href={makeUrl({ size: active.size === s ? "" : s })}
              className={chip(active.size === s)}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h3 className={sectionTitle}>{t("color")}</h3>
        <div className="flex flex-wrap gap-2">
          {facets.colors.map((c) => (
            <Link
              key={c}
              href={makeUrl({ color: active.color === c ? "" : c })}
              className={chip(active.color === c)}
            >
              {c}
            </Link>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className={sectionTitle}>{t("price_range")}</h3>
        <div className="flex flex-col gap-1">
          {PRICE_RANGES.map((range) => (
            <Link
              key={range}
              href={makeUrl({ price: active.price === range ? "" : range })}
              className={listItem(active.price === range)}
            >
              {priceLabel(range)}
            </Link>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Link
          href="/products"
          className="block rounded-lg border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-600 hover:bg-gray-100"
        >
          ✕ {t("clear_filters")}
        </Link>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Title + result count + sort */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            {active.q
              ? `${t("search_results_for")}: "${active.q}"`
              : active.occasion
                ? occasionLabel(active.occasion, lang)
                : active.type
                  ? typeLabel(active.type, lang)
                  : t("all_products")}
          </h1>
          <p className="text-sm text-gray-500">
            {lang === "bn"
              ? `${new Intl.NumberFormat("bn-BD").format(products.length)} ${t("products_found")}`
              : `${products.length} ${t("products_found")}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowMobileFilters((v) => !v)}
            className="flex min-h-11 items-center gap-1 rounded-xl border border-gray-300 bg-white px-4 py-2 font-semibold md:hidden"
          >
            ⚙ {showMobileFilters ? t("hide_filters") : t("show_filters")}
          </button>
          {/* Sort */}
          <select
            value={active.sort}
            onChange={(e) => router.push(makeUrl({ sort: e.target.value }))}
            className="min-h-11 rounded-xl border border-gray-300 bg-white px-3 py-2 font-semibold"
            aria-label={t("sort_by")}
          >
            <option value="newest">{t("sort_newest")}</option>
            <option value="price_low">{t("sort_price_low")}</option>
            <option value="price_high">{t("sort_price_high")}</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[230px_1fr]">
        {/* Sidebar (desktop) / collapsible panel (mobile) */}
        <aside
          className={`${showMobileFilters ? "block" : "hidden"} rounded-2xl border border-gray-200 bg-white p-4 md:block md:self-start md:sticky md:top-36`}
        >
          {filterPanel}
        </aside>

        {/* Product grid */}
        <div>
          {products.length === 0 ? (
            <p className="py-16 text-center text-gray-500">{t("no_products")}</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
