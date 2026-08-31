import { NextResponse } from "next/server";
import { siteConfig, type TierId } from "@/config/site";

// ---------------------------------------------------------------------------
// Stripe Checkout Session creation — SERVER SIDE ONLY.
//
// This route talks to Stripe's REST API directly with `fetch`, so no Stripe
// SDK dependency is required. STRIPE_SECRET_KEY is read from the server
// environment only (see .env.example) and is never exposed to the client.
//
// To activate:
//   1. Create one-time Prices for all four tiers in the Stripe Dashboard
//      (standard, premium, dg, bundle — see src/config/site.ts).
//   2. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID_{STANDARD,PREMIUM,DG,BUNDLE}
//      in your environment (Vercel: Project Settings -> Environment Variables).
//   3. That's it — every CTA button already POSTs { tier } here.
//
// If the matching NEXT_PUBLIC_STRIPE_PAYMENT_LINK_* env var is set instead,
// the front-end buttons skip this route entirely and link straight to that
// Payment Link.
// ---------------------------------------------------------------------------

const PRICE_ID_ENV: Record<TierId, string | undefined> = {
  standard: process.env.STRIPE_PRICE_ID_STANDARD,
  premium: process.env.STRIPE_PRICE_ID_PREMIUM,
  dg: process.env.STRIPE_PRICE_ID_DG,
  bundle: process.env.STRIPE_PRICE_ID_BUNDLE,
};
const VALID_TIERS: TierId[] = ["standard", "premium", "dg", "bundle"];

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  let tier: TierId = "standard";
  let idempotencyKey = "";
  try {
    const body = await request.json();
    if (VALID_TIERS.includes(body?.tier)) tier = body.tier;
    if (typeof body?.idempotencyKey === "string" && body.idempotencyKey.length > 0) {
      idempotencyKey = body.idempotencyKey;
    }
  } catch {
    // no/invalid body -> default to "standard"
  }
  // Falls back to a fresh key if the client didn't send one, which still
  // makes this one request idempotent against Stripe-side transport
  // retries — it just can't dedupe a second, separate request the way a
  // client-supplied key (reused across retries of the same attempt) can.
  if (!idempotencyKey) idempotencyKey = crypto.randomUUID();

  const priceId = PRICE_ID_ENV[tier];

  if (!secretKey || !priceId) {
    return NextResponse.json(
      {
        error: `Stripe is not configured yet for the ${tier} tier. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID_${tier.toUpperCase()} in your environment (see .env.example), or set a NEXT_PUBLIC_STRIPE_PAYMENT_LINK_${tier.toUpperCase()} to use a Payment Link instead.`,
      },
      { status: 501 },
    );
  }

  // The Origin header is attacker-controllable on a direct API request (no
  // browser required) — trusting it blindly for success_url/cancel_url
  // would let anyone build a real Stripe Checkout link for this store that
  // redirects a paying customer to an attacker's domain afterward. Only
  // ever redirect back to this deployment's own known URL.
  const requestOrigin = request.headers.get("origin");
  const allowedOrigins = new Set([siteConfig.url]);
  if (process.env.VERCEL_URL) allowedOrigins.add(`https://${process.env.VERCEL_URL}`);
  const origin = requestOrigin && allowedOrigins.has(requestOrigin) ? requestOrigin : siteConfig.url;

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("line_items[0][price]", priceId);
  params.set("line_items[0][quantity]", "1");
  params.set("metadata[tier]", tier);
  params.set("success_url", `${origin}/download?session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${origin}/?checkout=cancelled`);

  // Managed Payments (a newer, opt-in-by-default Stripe account setting)
  // is incompatible with the custom_text below — Stripe would otherwise
  // reject session creation outright. Disabling it for this session keeps
  // our own EU consent wording, which Managed Payments doesn't support.
  params.set("managed_payments[enabled]", "false");

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
        // Prevents a duplicate Checkout Session (and a confused buyer facing
        // two orders) if the client retries with the same key — see
        // idempotencyKey handling above.
        "Idempotency-Key": idempotencyKey,
      },
      body: params.toString(),
      cache: "no-store",
    });

    const session = await stripeResponse.json();

    if (!stripeResponse.ok) {
      return NextResponse.json(
        { error: session?.error?.message ?? "Stripe checkout session could not be created." },
        { status: stripeResponse.status },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Could not reach Stripe. Please try again." },
      { status: 502 },
    );
  }
}
