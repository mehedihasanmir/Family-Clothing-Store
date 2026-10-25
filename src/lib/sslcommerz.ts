// SSLCommerz payment gateway integration (bKash, Nagad, Rocket, cards - all in one)
//
// To enable online payment:
// 1. Register a sandbox account: https://developer.sslcommerz.com/registration/
// 2. Put SSLCOMMERZ_STORE_ID and SSLCOMMERZ_STORE_PASSWORD in .env
// 3. For production, set SSLCOMMERZ_SANDBOX="false" and use your live credentials.
// When credentials are missing, the checkout automatically shows online payment as "coming soon".

type OrderForPayment = {
  id: number;
  tranId: string;
  total: number;
  customerName: string;
  phone: string;
  address: string;
  district: string;
};

function sandbox(): boolean {
  return process.env.SSLCOMMERZ_SANDBOX !== "false";
}

function apiBase(): string {
  return sandbox() ? "https://sandbox.sslcommerz.com" : "https://securepay.sslcommerz.com";
}

export function isOnlinePaymentEnabled(): boolean {
  return Boolean(process.env.SSLCOMMERZ_STORE_ID && process.env.SSLCOMMERZ_STORE_PASSWORD);
}

export async function createPaymentSession(
  order: OrderForPayment,
  baseUrl: string
): Promise<string> {
  const params = new URLSearchParams({
    store_id: process.env.SSLCOMMERZ_STORE_ID!,
    store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD!,
    total_amount: String(order.total),
    currency: "BDT",
    tran_id: order.tranId,
    success_url: `${baseUrl}/api/payment/success`,
    fail_url: `${baseUrl}/api/payment/fail`,
    cancel_url: `${baseUrl}/api/payment/cancel`,
    cus_name: order.customerName,
    cus_email: "customer@example.com", // required by SSLCommerz; we only collect phone
    cus_add1: order.address,
    cus_city: order.district,
    cus_country: "Bangladesh",
    cus_phone: order.phone,
    shipping_method: "Courier",
    ship_name: order.customerName,
    ship_add1: order.address,
    ship_city: order.district,
    ship_country: "Bangladesh",
    product_name: "Kids Clothing",
    product_category: "Clothing",
    product_profile: "physical-goods",
  });

  const res = await fetch(`${apiBase()}/gwprocess/v4/api.php`, {
    method: "POST",
    body: params,
  });
  const data = await res.json();
  if (data.status !== "SUCCESS" || !data.GatewayPageURL) {
    throw new Error(`SSLCommerz session failed: ${data.failedreason ?? "unknown"}`);
  }
  return data.GatewayPageURL as string;
}

export async function validatePayment(valId: string): Promise<{
  valid: boolean;
  tranId: string;
  amount: number;
}> {
  const url =
    `${apiBase()}/validator/api/validationserverAPI.php` +
    `?val_id=${encodeURIComponent(valId)}` +
    `&store_id=${encodeURIComponent(process.env.SSLCOMMERZ_STORE_ID!)}` +
    `&store_passwd=${encodeURIComponent(process.env.SSLCOMMERZ_STORE_PASSWORD!)}` +
    `&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  return {
    valid: data.status === "VALID" || data.status === "VALIDATED",
    tranId: data.tran_id ?? "",
    amount: parseFloat(data.amount ?? "0"),
  };
}
