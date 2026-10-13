import { cleanEnv } from "@/lib/env";
import { NextResponse } from "next/server";
import { clientIp, isRateLimited } from "@/lib/rateLimit";

// ---------------------------------------------------------------------------
// Lead capture for the free "Emergency Vessel Shipment Checklist".
//
// Two ways to capture it (pick one, or set neither and just log a warning):
//
// 1) Mailchimp (recommended — sends straight to Mailchimp's own API, no
//    third account needed): set MAILCHIMP_API_KEY and MAILCHIMP_AUDIENCE_ID.
//    The API key's own suffix (e.g. "...-us21") tells us which Mailchimp
//    server to call, so nothing else is required.
//
// 2) A generic webhook: set LEAD_WEBHOOK_URL to whatever URL your tool gives
//    you — works with Zapier, Make, ConvertKit, Beehiiv, a Google Sheets
//    webhook, etc. Used only when Mailchimp isn't configured.
//
// Until one of these is set, the checklist still downloads for visitors —
// you just won't be capturing the email anywhere. Check your server logs
// for a warning to know whether it's wired up yet.
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function addToMailchimp(email: string, apiKey: string, audienceId: string): Promise<boolean> {
  // Mailchimp API keys end in "-usNN", naming the data center that
  // actually hosts the account — no separate server-prefix setting needed.
  const server = apiKey.split("-").pop();
  if (!server) return false;

  try {
    const res = await fetch(`https://${server}.api.mailchimp.com/3.0/lists/${audienceId}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
        tags: ["emergency-vessel-shipment-checklist"],
      }),
      cache: "no-store",
    });

    // A repeat signup (this email is already subscribed) isn't a failure —
    // Mailchimp reports it as 400 "Member Exists", and the visitor should
    // still get their download either way.
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      if (data?.title !== "Member Exists") {
        console.error("Mailchimp lead capture failed:", data?.detail ?? res.status);
      }
    }
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  // 5 submissions per minute per IP — plenty for a real visitor, tight
  // enough to blunt a script spamming this route with junk emails.
  if (isRateLimited(`lead:${clientIp(request)}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment and try again." }, { status: 429 });
  }

  let email = "";
  let honeypot = "";
  try {
    const body = await request.json();
    email = typeof body?.email === "string" ? body.email.trim() : "";
    honeypot = typeof body?.company === "string" ? body.company.trim() : "";
  } catch {
    // fall through to validation error below
  }

  // A field real visitors never see or fill (hidden via CSS in
  // LeadMagnetForm.tsx) — a bot that fills every field trips it. Report
  // success without actually forwarding anything, so the bot doesn't learn
  // it was caught and keep adapting.
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const mailchimpKey = process.env.MAILCHIMP_API_KEY;
  const mailchimpAudience = process.env.MAILCHIMP_AUDIENCE_ID;
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;

  if (mailchimpKey && mailchimpAudience) {
    const sent = await addToMailchimp(email, mailchimpKey, mailchimpAudience);
    if (!sent) console.error("Failed to reach Mailchimp for lead:", email);
  } else if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "emergency-vessel-shipment-checklist",
          submittedAt: new Date().toISOString(),
        }),
        cache: "no-store",
      });
    } catch {
      // Don't fail the request over a broken webhook — the visitor still
      // gets their free checklist. Fix the webhook and past leads are
      // simply the ones that got missed while it was down.
      console.error("Failed to forward lead to LEAD_WEBHOOK_URL");
    }
  } else if (cleanEnv("STRIPE_SECRET_KEY")) {
    // No email tool connected yet: keep the lead as a Stripe Customer
    // (Stripe Dashboard → Customers, metadata lead_source), so no sign-up
    // is lost before Mailchimp or a webhook is set up.
    const saved = await saveLeadToStripe(email);
    if (!saved) console.error("Failed to save lead to Stripe:", email);
  } else {
    console.warn("No lead capture configured (MAILCHIMP_API_KEY or LEAD_WEBHOOK_URL) — lead was not saved anywhere:", email);
  }

  return NextResponse.json({ ok: true });
}

// Creates (or tags, if one already exists for this email) a Stripe
// Customer for a free-checklist sign-up.
async function saveLeadToStripe(email: string): Promise<boolean> {
  const key = cleanEnv("STRIPE_SECRET_KEY");
  if (!key) return false;
  const headers = { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" };
  try {
    const found = await fetch(`https://api.stripe.com/v1/customers?limit=1&email=${encodeURIComponent(email)}`, {
      headers,
      cache: "no-store",
    });
    const existing = found.ok ? ((await found.json()).data?.[0]?.id as string | undefined) : undefined;

    const body = new URLSearchParams();
    body.set("metadata[lead_source]", "emergency-vessel-shipment-checklist");
    body.set("metadata[lead_signed_up]", new Date().toISOString().slice(0, 10));
    if (!existing) {
      body.set("email", email);
      body.set("description", "Free checklist sign-up");
    }
    const res = await fetch(`https://api.stripe.com/v1/customers${existing ? `/${existing}` : ""}`, {
      method: "POST",
      headers,
      body,
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}
