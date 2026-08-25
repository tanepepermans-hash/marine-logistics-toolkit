import type { TierId } from "@/config/site";

// Server-only helper — verifies a completed Stripe Checkout Session directly
// against Stripe's REST API. Used by the /download page and /api/download
// route so a buyer can only reach the toolkit file after a real, paid order.
// STRIPE_SECRET_KEY never leaves the server.

type VerifyResult =
  | { ok: true; customerEmail: string | null; tier: TierId }
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
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}?expand[]=line_items`,
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

    return {
      ok: true,
      customerEmail: session.customer_details?.email ?? null,
      tier: resolveTier(session),
    };
  } catch {
    return { ok: false, reason: "Could not reach Stripe to verify this order. Please try again." };
  }
}

// Prefer the metadata set by our own /api/checkout route (works for the
// dynamic Checkout Session flow); fall back to matching the purchased
// Price ID against STRIPE_PRICE_ID_PREMIUM so Stripe Payment Links — which
// don't carry our metadata — still resolve to the right tier.
const VALID_TIERS: TierId[] = ["standard", "premium", "dg", "bundle"];

function resolveTier(session: {
  metadata?: { tier?: string };
  line_items?: { data?: { price?: { id?: string } }[] };
}): TierId {
  const metaTier = session.metadata?.tier;
  if (metaTier && VALID_TIERS.includes(metaTier as TierId)) return metaTier as TierId;

  // Payment Links don't carry our metadata — fall back to matching the
  // purchased Price ID against each tier's configured price.
  const purchasedPriceId = session.line_items?.data?.[0]?.price?.id;
  const priceIdByTier: Record<TierId, string | undefined> = {
    standard: process.env.STRIPE_PRICE_ID_STANDARD,
    premium: process.env.STRIPE_PRICE_ID_PREMIUM,
    dg: process.env.STRIPE_PRICE_ID_DG,
    bundle: process.env.STRIPE_PRICE_ID_BUNDLE,
  };
  for (const tier of VALID_TIERS) {
    if (purchasedPriceId && purchasedPriceId === priceIdByTier[tier]) return tier;
  }
  return "standard";
}
