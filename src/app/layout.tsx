import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FacebookPixel from "@/components/FacebookPixel";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SITE_NAME } from "@/lib/config";

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-hind-siliguri",
});

export const metadata: Metadata = {
  title: `${SITE_NAME} — পুরো পরিবারের পোশাক | Clothing for Men, Women & Kids`,
  description:
    "পুরুষ, নারী ও শিশুদের মানসম্মত পোশাক। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি। Quality clothing for men, women and kids with Cash on Delivery all over Bangladesh.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <body className={`${hindSiliguri.variable} bg-gray-50 text-gray-900 antialiased`}>
        <LanguageProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <WhatsAppButton />
            <FacebookPixel />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
