import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

// ---------------------------------------------------------------------------
// Stripe Checkout Session creation — SERVER SIDE ONLY.
//
// This route talks to Stripe's REST API directly with `fetch`, so no Stripe
// SDK dependency is required. STRIPE_SECRET_KEY is read from the server
// environment only (see .env.example) and is never exposed to the client.
//
// To activate:
//   1. Create a one-time Price for the toolkit in the Stripe Dashboard.
//   2. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID in your environment
//      (Vercel: Project Settings -> Environment Variables).
//   3. That's it — the "Get Instant Access" buttons already POST here.
//
// If NEXT_PUBLIC_STRIPE_PAYMENT_LINK is set instead, the front-end buttons
// skip this route entirely and link straight to the Payment Link.
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!secretKey || !priceId) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured yet. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID in your environment (see .env.example), or set NEXT_PUBLIC_STRIPE_PAYMENT_LINK to use a Payment Link instead.",
      },
      { status: 501 },
    );
  }

  const origin = request.headers.get("origin") ?? siteConfig.url;

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("line_items[0][price]", priceId);
  params.set("line_items[0][quantity]", "1");
  params.set("success_url", `${origin}/?checkout=success`);
  params.set("cancel_url", `${origin}/?checkout=cancelled`);

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
