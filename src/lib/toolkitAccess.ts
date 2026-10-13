import { cache } from "react";
import { cookies } from "next/headers";
import { tierHasToolkitFile, type TierId } from "@/config/site";
import { verifyPurchase } from "@/lib/payments";

// ---------------------------------------------------------------------------
// Access to the online toolkit (/toolkit).
//
// There are no user accounts. A buyer's access key is their order id (the
// Stripe Checkout Session id, or the Lemon Squeezy order id) — the same id
// the /download page already uses. Their personal link is
//   /toolkit/access?key=<order id>
// which verifies the order with the payment provider and stores the key in
// an httpOnly cookie, so the buyer can keep using /toolkit on that device.
//
// Every request re-verifies the key server-side, so a cookie can't be
// forged into access. Like the download link, the personal link only
// grants access to a *new* browser within 30 days of purchase (so a link
// posted publicly goes stale); a browser that already has the cookie keeps
// access for a year.
// ---------------------------------------------------------------------------

export const TOOLKIT_COOKIE = "toolkit_access";
export const TOOLKIT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // one year

export type ToolkitAccess =
  | { ok: true; key: string; tier: TierId; email: string | null; premium: boolean }
  | { ok: false; reason: string };

// Order ids are short ASCII tokens. Rejecting anything else up front keeps
// junk from ever reaching the payment provider's API.
export function isPlausibleKey(key: string): boolean {
  return /^[A-Za-z0-9_\-]{6,255}$/.test(key);
}

export async function checkToolkitKey(
  key: string,
  opts: { fromCookie?: boolean } = {},
): Promise<ToolkitAccess> {
  if (!isPlausibleKey(key)) return { ok: false, reason: "This access link isn't valid." };

  const result = await verifyPurchase(key, { allowExpired: opts.fromCookie });
  if (!result.ok) return { ok: false, reason: result.reason };
  if (!tierHasToolkitFile(result.tier)) {
    return {
      ok: false,
      reason: "This order is for the DG Training Academy only — it doesn't include the operator toolkit.",
    };
  }
  return {
    ok: true,
    key,
    tier: result.tier,
    email: result.customerEmail,
    premium: result.tier === "premium" || result.tier === "bundle",
  };
}

// Deduplicated per request, so a page and its layout share one check.
export const getToolkitAccess = cache(async (): Promise<ToolkitAccess> => {
  const key = (await cookies()).get(TOOLKIT_COOKIE)?.value ?? "";
  if (!key) return { ok: false, reason: "no-cookie" };
  return checkToolkitKey(key, { fromCookie: true });
});
