import { NextResponse } from "next/server";
import { siteConfig, type TierId } from "@/config/site";
import { createCheckoutUrl } from "@/lib/payments";

// ---------------------------------------------------------------------------
// Checkout creation — SERVER SIDE ONLY.
//
// Delegates to src/lib/payments.ts, which picks Stripe or Lemon Squeezy
// based on the PAYMENT_PROVIDER env var (see that file for how to switch).
// Secret keys are read only inside the server-side provider modules and are
// never exposed to the client.
//
// If the matching NEXT_PUBLIC_STRIPE_PAYMENT_LINK_* env var is set instead,
// the front-end buttons skip this route entirely and link straight to that
// Stripe Payment Link.
// ---------------------------------------------------------------------------

const VALID_TIERS: TierId[] = ["standard", "premium", "dg", "bundle"];

export async function POST(request: Request) {
  let tier: TierId = "standard";
  try {
    const body = await request.json();
    if (VALID_TIERS.includes(body?.tier)) tier = body.tier;
  } catch {
    // no/invalid body -> default to "standard"
  }

  // The Origin header is attacker-controllable on a direct API request (no
  // browser required) — trusting it blindly for the post-payment redirect
  // would let anyone build a real checkout link for this store that sends a
  // paying customer to an attacker's domain afterward. Only ever redirect
  // back to this deployment's own known URL.
  const requestOrigin = request.headers.get("origin");
  const allowedOrigins = new Set([siteConfig.url]);
  if (process.env.VERCEL_URL) allowedOrigins.add(`https://${process.env.VERCEL_URL}`);
  const origin = requestOrigin && allowedOrigins.has(requestOrigin) ? requestOrigin : siteConfig.url;

  const result = await createCheckoutUrl(tier, origin);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ url: result.url });
}
