"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/language-context";
import { useCart } from "@/lib/cart-context";
import { SITE_NAME } from "@/lib/config";

export default function Header() {
  const { lang, setLang, t } = useLang();
  const { count } = useCart();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  };

  const searchForm = (
    <form onSubmit={handleSearch} className="relative w-full">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("search_placeholder")}
        className="w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-4 pr-12 outline-none focus:border-rose-500 focus:bg-white"
      />
      <button
        type="submit"
        aria-label={t("search")}
        className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-rose-600 text-white hover:bg-rose-700"
      >
        🔍
      </button>
    </form>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      {/* Top row: logo, search (desktop), language + cart */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-600 text-lg font-black text-white">
            M
          </span>
          <span className="text-2xl font-black tracking-wide text-gray-900">{SITE_NAME}</span>
        </Link>

        <div className="hidden max-w-md flex-1 md:block">{searchForm}</div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => setLang(lang === "bn" ? "en" : "bn")}
            className="min-h-11 rounded-full border border-gray-300 px-3 py-1 text-sm font-semibold hover:bg-gray-100"
            aria-label="Switch language"
          >
            {lang === "bn" ? "EN" : "বাংলা"}
          </button>
          <Link
            href="/cart"
            className="relative flex min-h-11 items-center gap-1 rounded-full bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700"
          >
            🛒 <span className="hidden sm:inline">{t("nav_cart")}</span>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-gray-900">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Search (mobile) */}
      <div className="px-4 pb-2 md:hidden">{searchForm}</div>

      {/* Nav row */}
      <nav className="border-t border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-1 overflow-x-auto px-4 sm:gap-6">
          <Link href="/" className="whitespace-nowrap px-3 py-2.5 font-semibold hover:text-rose-600">
            {t("nav_home")}
          </Link>
          <Link
            href="/products"
            className="whitespace-nowrap px-3 py-2.5 font-semibold hover:text-rose-600"
          >
            {t("nav_products")}
          </Link>
          <Link
            href="/products?category=men"
            className="whitespace-nowrap px-3 py-2.5 font-semibold hover:text-rose-600"
          >
            {t("nav_men")}
          </Link>
          <Link
            href="/products?category=women"
            className="whitespace-nowrap px-3 py-2.5 font-semibold hover:text-rose-600"
          >
            {t("nav_women")}
          </Link>
          <Link
            href="/products?category=kids"
            className="whitespace-nowrap px-3 py-2.5 font-semibold hover:text-rose-600"
          >
            {t("nav_kids")}
          </Link>
        </div>
      </nav>
    </header>
  );
}
