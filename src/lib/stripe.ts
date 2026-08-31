import type { TierId } from "@/config/site";

// Server-only helper — verifies a completed Stripe Checkout Session directly
// against Stripe's REST API. Used by the /download page and /api/download
// route (via src/lib/payments.ts) so a buyer can only reach the toolkit file
// after a real, paid order. STRIPE_SECRET_KEY never leaves the server.

export type VerifyResult =
  | { ok: true; customerEmail: string | null; tier: TierId }
  | { ok: false; reason: string };

export type CreateCheckoutResult = { url: string } | { error: string; status: number };

// How long a download/unlock link keeps working after purchase. This is
// the main defense against a buyer's link being posted publicly and reused
// indefinitely — a buyer who already unlocked DG Training in their own
// browser keeps that access forever (see setPremiumUnlocked), this only
// stops the *link itself* from granting fresh access after it's gone stale.
const LINK_EXPIRY_DAYS = 30;

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

    // session.created is a Unix timestamp (seconds) — always present on a
    // Checkout Session, no `expand` needed.
    const ageMs = Date.now() - session.created * 1000;
    const expiryMs = LINK_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    if (ageMs > expiryMs) {
      return {
        ok: false,
        reason:
          "This download link has expired for security reasons. Contact support with your order email and we'll send you a fresh one.",
      };
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

const PRICE_ID_ENV: Record<TierId, string | undefined> = {
  standard: process.env.STRIPE_PRICE_ID_STANDARD,
  premium: process.env.STRIPE_PRICE_ID_PREMIUM,
  dg: process.env.STRIPE_PRICE_ID_DG,
  bundle: process.env.STRIPE_PRICE_ID_BUNDLE,
};

export async function createStripeCheckoutUrl(tier: TierId, origin: string): Promise<CreateCheckoutResult> {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = PRICE_ID_ENV[tier];

  if (!secretKey || !priceId) {
    return {
      error: `Stripe is not configured yet for the ${tier} tier. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID_${tier.toUpperCase()} in your environment (see .env.example), or set a NEXT_PUBLIC_STRIPE_PAYMENT_LINK_${tier.toUpperCase()} to use a Payment Link instead.`,
      status: 501,
    };
  }

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("line_items[0][price]", priceId);
  params.set("line_items[0][quantity]", "1");
  params.set("metadata[tier]", tier);
  params.set("success_url", `${origin}/download?session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${origin}/?checkout=cancelled`);

  // EU consumers have a 14-day right of withdrawal by default. For an
  // instantly-delivered digital product, that right can only be waived if
  // the buyer gives explicit, informed consent *before* paying — this is
  // exactly that consent step, shown as a required checkbox on the Stripe
  // Checkout page itself (linking to the Terms of Service URL configured
  // in the Stripe Dashboard under Settings -> Business -> Public details).
  params.set("consent_collection[terms_of_service]", "required");
  params.set(
    "custom_text[terms_of_service_acceptance][message]",
    "I understand I'll get instant access to the digital toolkit, and that this means I give up my 14-day right of withdrawal, per the Terms & Refund Policy.",
  );

  try {
    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      cache: "no-store",
    });

    const session = await stripeResponse.json();

    if (!stripeResponse.ok) {
      return {
        error: session?.error?.message ?? "Stripe checkout session could not be created.",
        status: stripeResponse.status,
      };
    }

    return { url: session.url };
  } catch {
    return { error: "Could not reach Stripe. Please try again.", status: 502 };
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
