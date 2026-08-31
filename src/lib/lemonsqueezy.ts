import type { TierId } from "@/config/site";
import type { VerifyResult, CreateCheckoutResult } from "@/lib/stripe";

// Server-only helper — mirrors src/lib/stripe.ts but talks to the Lemon
// Squeezy API instead. Lemon Squeezy is a "merchant of record": it is the
// legal seller on every order and handles VAT/sales-tax collection and
// remittance for you, which is why this exists as a swappable alternative
// to a direct Stripe integration (see src/lib/payments.ts for the switch).
//
// To activate:
//   1. Create a Lemon Squeezy store and one product+variant per tier.
//   2. Set LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID and
//      LEMONSQUEEZY_VARIANT_ID_{STANDARD,PREMIUM,DG,BUNDLE}.
//   3. Set PAYMENT_PROVIDER=lemonsqueezy.
// This has not been tested against a real Lemon Squeezy account yet — do a
// real test purchase before relying on it (see the launch checklist).

const LINK_EXPIRY_DAYS = 30;

const VARIANT_ID_ENV: Record<TierId, string | undefined> = {
  standard: process.env.LEMONSQUEEZY_VARIANT_ID_STANDARD,
  premium: process.env.LEMONSQUEEZY_VARIANT_ID_PREMIUM,
  dg: process.env.LEMONSQUEEZY_VARIANT_ID_DG,
  bundle: process.env.LEMONSQUEEZY_VARIANT_ID_BUNDLE,
};
const VALID_TIERS: TierId[] = ["standard", "premium", "dg", "bundle"];

export async function createLemonSqueezyCheckoutUrl(tier: TierId, origin: string): Promise<CreateCheckoutResult> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const variantId = VARIANT_ID_ENV[tier];

  if (!apiKey || !storeId || !variantId) {
    return {
      error: `Lemon Squeezy is not configured yet for the ${tier} tier. Set LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID and LEMONSQUEEZY_VARIANT_ID_${tier.toUpperCase()} in your environment.`,
      status: 501,
    };
  }

  // {order_id} is a Lemon Squeezy "link variable" — it gets substituted with
  // the real order id when the buyer is redirected back, the same way
  // Stripe substitutes {CHECKOUT_SESSION_ID}. We keep our own query param
  // name ("session_id") so /download, /api/download and /api/dg-unlock
  // never need to know which provider is active.
  const redirectUrl = `${origin}/download?session_id={order_id}`;

  const body = {
    data: {
      type: "checkouts",
      attributes: {
        checkout_data: { custom: { tier } },
        product_options: { redirect_url: redirectUrl },
      },
      relationships: {
        store: { data: { type: "stores", id: storeId } },
        variant: { data: { type: "variants", id: variantId } },
      },
    },
  };

  try {
    const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
      const message = json?.errors?.[0]?.detail ?? "Lemon Squeezy checkout could not be created.";
      return { error: message, status: res.status };
    }

    return { url: json.data.attributes.url };
  } catch {
    return { error: "Could not reach Lemon Squeezy. Please try again.", status: 502 };
  }
}

export async function verifyLemonSqueezyOrder(orderId: string): Promise<VerifyResult> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;

  if (!apiKey) {
    return { ok: false, reason: "Lemon Squeezy is not configured on this site yet." };
  }
  if (!orderId) {
    return { ok: false, reason: "No order was found for this link." };
  }

  try {
    const res = await fetch(`https://api.lemonsqueezy.com/v1/orders/${encodeURIComponent(orderId)}`, {
      headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/vnd.api+json" },
      cache: "no-store",
    });

    if (!res.ok) {
      return { ok: false, reason: "We couldn't find an order matching this link." };
    }

    const { data } = await res.json();
    const attrs = data?.attributes;

    if (!attrs || attrs.status !== "paid") {
      return { ok: false, reason: "This order has not completed payment yet." };
    }

    const ageMs = Date.now() - new Date(attrs.created_at).getTime();
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
      customerEmail: attrs.user_email ?? null,
      tier: resolveTier(attrs),
    };
  } catch {
    return { ok: false, reason: "Could not reach Lemon Squeezy to verify this order. Please try again." };
  }
}

function resolveTier(attrs: { first_order_item?: { variant_id?: number | string } }): TierId {
  const purchasedVariantId = attrs.first_order_item?.variant_id?.toString();
  for (const tier of VALID_TIERS) {
    if (purchasedVariantId && purchasedVariantId === VARIANT_ID_ENV[tier]) return tier;
  }
  return "standard";
}
