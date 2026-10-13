import { cleanEnv } from "@/lib/env";

// ---------------------------------------------------------------------------
// Security alerts — e.g. one order's toolkit link being opened on more
// devices than the licence allows.
//
// Every alert is logged (Vercel → Logs, search "[toolkit-alert]"). If
// ALERT_WEBHOOK_URL is set (or, failing that, ORDER_WEBHOOK_URL), it is also
// POSTed there as JSON — point it at a Zapier / Make / n8n hook that emails
// or messages you. The suspicious order is also flagged in its Stripe
// metadata (toolkit_flagged), so it's visible on the payment itself.
// ---------------------------------------------------------------------------

export type ToolkitAlert = {
  type: "device_limit_reached" | "many_countries";
  orderId: string;
  email: string | null;
  detail: string;
};

export async function sendAlert(alert: ToolkitAlert) {
  console.warn("[toolkit-alert]", JSON.stringify(alert));

  const url = cleanEnv("ALERT_WEBHOOK_URL") ?? cleanEnv("ORDER_WEBHOOK_URL");
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "toolkit_security_alert", ...alert, at: new Date().toISOString() }),
      cache: "no-store",
    });
  } catch {
    console.error("[toolkit-alert] could not reach the alert webhook");
  }
}
