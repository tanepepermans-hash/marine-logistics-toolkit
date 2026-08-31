import { NextResponse } from "next/server";
import Stripe from "stripe";

// ---------------------------------------------------------------------------
// Stripe webhook — the authoritative record of a completed order.
//
// The /download and /dg-unlock routes already re-verify payment directly
// against the Checkout Session, so this endpoint isn't required for buyers
// to get their purchase. It exists so an order is recorded even if the
// buyer closes the tab before the redirect completes, and so delayed
// payment methods (e.g. bank debits) that settle after checkout still
// produce a record once they clear.
//
// To activate: in the Stripe Dashboard, add an endpoint pointing at
// {your domain}/api/webhooks/stripe listening for at least
// checkout.session.completed and checkout.session.async_payment_succeeded,
// then set STRIPE_WEBHOOK_SECRET to its signing secret. For local testing,
// use `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.
// ---------------------------------------------------------------------------

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    console.warn("STRIPE_WEBHOOK_SECRET is not set — webhook ignored.");
    // 200 so Stripe doesn't retry a webhook we're not configured to handle.
    return NextResponse.json({ received: false, reason: "not configured" });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  // Signature verification needs the exact raw request body — Next.js App
  // Router route handlers don't parse the body automatically, so this is
  // already the untouched payload Stripe signed.
  const payload = await request.text();

  const stripe = new Stripe(secretKey);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status === "paid") {
        await forwardOrder(session);
      }
      break;
    }
    case "checkout.session.async_payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.warn("Checkout session payment failed after redirect:", session.id);
      break;
    }
    default:
      // Ignore everything else — this endpoint only cares about order state.
      break;
  }

  return NextResponse.json({ received: true });
}

// Forwards a paid order to whatever tool is configured, mirroring the
// LEAD_WEBHOOK_URL pattern in /api/lead — no provider is required to see
// order confirmations working, but nothing is recorded until one is set.
async function forwardOrder(session: Stripe.Checkout.Session) {
  const webhookUrl = process.env.ORDER_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("ORDER_WEBHOOK_URL is not set — order was not forwarded anywhere:", session.id);
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: session.id,
        tier: session.metadata?.tier ?? null,
        email: session.customer_details?.email ?? null,
        amountTotal: session.amount_total,
        currency: session.currency,
        completedAt: new Date().toISOString(),
      }),
      cache: "no-store",
    });
  } catch {
    // Don't let a broken downstream webhook affect Stripe's retry
    // behavior for this event — the order is still valid.
    console.error("Failed to forward order to ORDER_WEBHOOK_URL:", session.id);
  }
}
