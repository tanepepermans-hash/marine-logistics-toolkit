import { NextResponse } from "next/server";
import { siteConfig, type TierId } from "@/config/site";
import { createCheckoutUrl } from "@/lib/payments";
import { clientIp, isRateLimited } from "@/lib/rateLimit";

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
  // 10 session-creation attempts per minute per IP — generous for a real
  // buyer clicking around tiers, tight enough to blunt a script hammering
  // this route to burn through Stripe API quota.
  if (isRateLimited(`checkout:${clientIp(request)}`, 10, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment and try again." }, { status: 429 });
  }

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

  // The Origin header is attacker-controllable on a direct API request (no
  // browser required) — trusting it blindly for the post-payment redirect
  // would let anyone build a real checkout link for this store that sends a
  // paying customer to an attacker's domain afterward. Only ever redirect
  // back to this deployment's own known URL.
  const requestOrigin = request.headers.get("origin");
  const allowedOrigins = new Set([siteConfig.url]);
  // Vercel's own hostnames for this deployment: the per-deployment URL, the
  // branch alias, and the project's production domain (e.g.
  // <project>.vercel.app, or a custom domain once one is attached). Without
  // these, a buyer on the .vercel.app address would be sent back to
  // siteConfig.url after paying — a domain that may not exist yet.
  for (const host of [
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ]) {
    if (host) allowedOrigins.add(`https://${host}`);
  }
  const origin = requestOrigin && allowedOrigins.has(requestOrigin) ? requestOrigin : siteConfig.url;

  const result = await createCheckoutUrl(tier, origin, idempotencyKey);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ url: result.url });
}
