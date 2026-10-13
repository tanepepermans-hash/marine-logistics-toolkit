import { cache } from "react";
import { cookies } from "next/headers";
import { tierHasToolkitFile, type TierId } from "@/config/site";
import { verifyPurchase } from "@/lib/payments";
import { updateOrderMetadata, type OrderRecord, type VerifyResult } from "@/lib/stripe";
import { sendAlert } from "@/lib/alerts";

// ---------------------------------------------------------------------------
// Access to the online toolkit (/toolkit).
//
// There are no user accounts. A buyer's access key is their order id (the
// Stripe Checkout Session id, or the Lemon Squeezy order id). Their personal
// link is /toolkit/access?key=<order id>, which verifies the order and sets
// two httpOnly cookies: the key, and a random id for this browser.
//
// Licence enforcement (Stripe orders):
//  - Each order may register at most MAX_DEVICES browsers. They're stored
//    in the order's PaymentIntent metadata as `toolkit_devices`. A browser
//    that isn't registered is refused, so a forwarded link stops working
//    once the buyer's own devices are in.
//  - A new browser can only register within LINK_DAYS of purchase.
//  - Hitting the device limit, or devices in many countries, sends an alert
//    (see src/lib/alerts.ts) and flags the order (`toolkit_flagged`).
//  - Setting `toolkit_blocked` = true on the payment cuts off all access.
//  - Deleting `toolkit_devices` on the payment resets the devices (e.g. a
//    buyer with a new laptop).
//
// Every visit re-verifies the order server-side, so cookies can't be forged
// into access, and a block takes effect immediately.
// ---------------------------------------------------------------------------

export const TOOLKIT_COOKIE = "toolkit_access";
export const DEVICE_COOKIE = "toolkit_device";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // one year
export const MAX_DEVICES = 3;
const LINK_DAYS = 30;
const DAY_MS = 86_400_000;
const DEVICES_KEY = "toolkit_devices";
const REFUSED_KEY = "toolkit_refused";
const FLAG_KEY = "toolkit_flagged";

export type DenyReason = "invalid" | "not-toolkit" | "suspended" | "devices" | "expired" | "device" | "no-cookie";

export type ToolkitAccess =
  | { ok: true; key: string; tier: TierId; email: string | null; premium: boolean }
  | { ok: false; reason: DenyReason };

type Paid = Extract<VerifyResult, { ok: true }>;
type Device = { id: string; country: string; date: string };

export function isPlausibleKey(key: string): boolean {
  return /^[A-Za-z0-9_\-]{6,255}$/.test(key);
}

export function newDeviceId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return Array.from(bytes, (b) => (b % 36).toString(36)).join("");
}

export function isPlausibleDeviceId(id: string): boolean {
  return /^[a-z0-9]{10}$/.test(id);
}

// Compact format so it fits Stripe's 500-character metadata value limit:
// "id:CC:YYYYMMDD|id:CC:YYYYMMDD|…"
function parseDevices(record: OrderRecord): Device[] {
  return (record.metadata[DEVICES_KEY] ?? "")
    .split("|")
    .filter(Boolean)
    .map((d) => {
      const [id, country = "??", date = ""] = d.split(":");
      return { id, country, date };
    });
}
function formatDevices(devices: Device[]): string {
  return devices.map((d) => `${d.id}:${d.country}:${d.date}`).join("|");
}

async function verify(key: string): Promise<{ ok: true; paid: Paid } | { ok: false; reason: DenyReason }> {
  if (!isPlausibleKey(key)) return { ok: false, reason: "invalid" };
  // allowExpired: the 30-day window is applied below, only to *new* devices.
  const result = await verifyPurchase(key, { allowExpired: true });
  if (!result.ok) return { ok: false, reason: /suspended/i.test(result.reason) ? "suspended" : "invalid" };
  if (!tierHasToolkitFile(result.tier)) return { ok: false, reason: "not-toolkit" };
  return { ok: true, paid: result };
}

function granted(key: string, paid: Paid): ToolkitAccess {
  return {
    ok: true,
    key,
    tier: paid.tier,
    email: paid.customerEmail,
    premium: paid.tier === "premium" || paid.tier === "bundle",
  };
}

const linkExpired = (paid: Paid) => Date.now() - paid.purchasedAt > LINK_DAYS * DAY_MS;

// Called by /toolkit/access when a buyer opens their personal link.
export async function claimToolkit(key: string, deviceId: string, country: string): Promise<ToolkitAccess> {
  const v = await verify(key);
  if (!v.ok) return v;
  const { paid } = v;

  // No per-order record (Lemon Squeezy, or an order without a
  // PaymentIntent): fall back to the plain 30-day link window.
  if (!paid.record) return linkExpired(paid) ? { ok: false, reason: "expired" } : granted(key, paid);

  const record = paid.record;
  const devices = parseDevices(record);
  if (devices.some((d) => d.id === deviceId)) return granted(key, paid);

  if (devices.length >= MAX_DEVICES) {
    const refused = Number(record.metadata[REFUSED_KEY] ?? "0") + 1;
    await updateOrderMetadata(record.paymentIntentId, {
      [REFUSED_KEY]: String(refused),
      [FLAG_KEY]: `device limit hit ${new Date().toISOString().slice(0, 10)}`,
    });
    // First refusal, then every fifth — enough to notice without spamming.
    if (refused === 1 || refused % 5 === 0) {
      await sendAlert({
        type: "device_limit_reached",
        orderId: key,
        email: paid.customerEmail,
        detail: `Link opened on a new browser (${country}) after ${MAX_DEVICES} devices were already registered (${devices
          .map((d) => d.country)
          .join(", ")}). Refused attempts so far: ${refused}.`,
      });
    }
    return { ok: false, reason: "devices" };
  }

  if (linkExpired(paid)) return { ok: false, reason: "expired" };

  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const next = [...devices, { id: deviceId, country, date: today }];
  const saved = await updateOrderMetadata(record.paymentIntentId, { [DEVICES_KEY]: formatDevices(next) });
  // If Stripe couldn't record the device, let the buyer in anyway rather
  // than lock out a paying customer over a hiccup.
  if (!saved) return granted(key, paid);

  const countries = new Set(next.map((d) => d.country).filter((c) => c !== "??"));
  if (countries.size >= 3) {
    await updateOrderMetadata(record.paymentIntentId, { [FLAG_KEY]: `devices in ${countries.size} countries` });
    await sendAlert({
      type: "many_countries",
      orderId: key,
      email: paid.customerEmail,
      detail: `Registered devices are in ${[...countries].join(", ")} — possibly a shared link.`,
    });
  }
  return granted(key, paid);
}

// Called on every /toolkit page view. Deduplicated per request.
export const getToolkitAccess = cache(async (): Promise<ToolkitAccess> => {
  const jar = await cookies();
  const key = jar.get(TOOLKIT_COOKIE)?.value ?? "";
  const deviceId = jar.get(DEVICE_COOKIE)?.value ?? "";
  if (!key) return { ok: false, reason: "no-cookie" };

  const v = await verify(key);
  if (!v.ok) return v;
  const { paid } = v;
  if (!paid.record) return granted(key, paid);

  // Only enforced once at least one device is recorded, so a browser that
  // got in during a Stripe hiccup isn't locked out.
  const devices = parseDevices(paid.record);
  if (devices.length > 0 && !devices.some((d) => d.id === deviceId)) return { ok: false, reason: "device" };
  return granted(key, paid);
});
