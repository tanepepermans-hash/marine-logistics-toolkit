// Server-only helper — verifies a completed Stripe Checkout Session directly
// against Stripe's REST API. Used by the /download page and /api/download
// route so a buyer can only reach the toolkit file after a real, paid order.
// STRIPE_SECRET_KEY never leaves the server.

type VerifyResult =
  | { ok: true; customerEmail: string | null }
  | { ok: false; reason: string };

export async function verifyCheckoutSession(sessionId: string): Promise<VerifyResult> {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return { ok: false, reason: "Stripe is not configured on this site yet." };
  }
  if (!sessionId) {
    return { ok: false, reason: "No order was found for this link." };
  }

  try {
    const res = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      {
        headers: { Authorization: `Bearer ${secretKey}` },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      return { ok: false, reason: "We couldn't find an order matching this link." };
    }

    const session = await res.json();

    if (session.payment_status !== "paid") {
      return { ok: false, reason: "This order has not completed payment yet." };
    }

    return { ok: true, customerEmail: session.customer_details?.email ?? null };
  } catch {
    return { ok: false, reason: "Could not reach Stripe to verify this order. Please try again." };
  }
}
