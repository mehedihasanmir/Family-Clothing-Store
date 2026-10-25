"use client";

import Link from "next/link";
import { useLang } from "@/lib/language-context";
import { SITE_NAME, SITE_PHONE, SITE_WHATSAPP, SITE_FACEBOOK } from "@/lib/config";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="mt-12 border-t border-gray-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl">🧸</span>
            <span className="text-lg font-bold text-rose-600">{SITE_NAME}</span>
          </div>
          <p className="text-sm text-gray-600">{t("footer_about")}</p>
        </div>

        <div>
          <h3 className="mb-3 font-bold">{t("footer_links")}</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link href="/products" className="hover:text-rose-600">
                {t("nav_products")}
              </Link>
            </li>
            <li>{t("footer_return_policy")}</li>
            <li>{t("footer_shipping_policy")}</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-bold">{t("footer_contact")}</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              📞 {t("footer_call_us")}: <a href={`tel:${SITE_PHONE}`} className="font-semibold text-rose-600">{SITE_PHONE}</a>
            </li>
            <li>
              <a
                href={`https://wa.me/${SITE_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-rose-600"
              >
                💬 WhatsApp
              </a>
            </li>
            <li>
              <a href={SITE_FACEBOOK} target="_blank" rel="noopener noreferrer" className="hover:text-rose-600">
                👍 Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} {SITE_NAME}
      </div>
    </footer>
  );
}
