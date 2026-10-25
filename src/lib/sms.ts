// SMS sending via BulkSMSBD (http://bulksmsbd.net)
// Works automatically once you set BULKSMSBD_API_KEY and BULKSMSBD_SENDER_ID in .env
// If not configured, SMS is silently skipped (the order still succeeds).

export async function sendSms(phone: string, message: string): Promise<void> {
  const apiKey = process.env.BULKSMSBD_API_KEY;
  const senderId = process.env.BULKSMSBD_SENDER_ID;
  if (!apiKey || !senderId) {
    console.log(`[SMS skipped - not configured] to ${phone}: ${message}`);
    return;
  }
  try {
    const url =
      `http://bulksmsbd.net/api/smsapi?api_key=${encodeURIComponent(apiKey)}` +
      `&type=text&number=88${phone}&senderid=${encodeURIComponent(senderId)}` +
      `&message=${encodeURIComponent(message)}`;
    const res = await fetch(url);
    const body = await res.text();
    console.log(`[SMS] to ${phone}: ${body}`);
  } catch (e) {
    // Never fail an order because SMS failed
    console.error("[SMS error]", e);
  }
}

export function orderConfirmationMessage(orderId: number, total: number): string {
  return `আপনার অর্ডার #${orderId} সফল হয়েছে। মোট: ${total} টাকা। ডেলিভারির সময় টাকা প্রস্তুত রাখুন। ধন্যবাদ!`;
}
