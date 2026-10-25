import CheckoutView from "@/components/CheckoutView";
import { isOnlinePaymentEnabled } from "@/lib/sslcommerz";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return <CheckoutView onlineEnabled={isOnlinePaymentEnabled()} />;
}
