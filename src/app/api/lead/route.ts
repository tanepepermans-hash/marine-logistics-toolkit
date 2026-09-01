import { NextResponse } from "next/server";
import { clientIp, isRateLimited } from "@/lib/rateLimit";

// ---------------------------------------------------------------------------
// Lead capture for the free "Emergency Vessel Shipment Checklist" — the
// email is forwarded to whatever marketing tool you configure via a plain
// webhook URL, so this route works with Zapier, Make, Mailchimp,
// ConvertKit, Beehiiv, a Google Sheets webhook, etc. without picking one
// provider or needing an SDK.
//
// To activate: set LEAD_WEBHOOK_URL in your environment to the webhook URL
// your tool gives you (server-side only). Until you do, the checklist
// still downloads for visitors — you just won't be capturing the email
// anywhere. Check your server logs for the "LEAD_WEBHOOK_URL is not set"
// warning to know whether it's wired up yet.
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const webhookUrl = process.env.LEAD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("LEAD_WEBHOOK_URL is not set — lead was not forwarded anywhere:", email);
  } else {
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
  }

  return NextResponse.json({ ok: true });
}
