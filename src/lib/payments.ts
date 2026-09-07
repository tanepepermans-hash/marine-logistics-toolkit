import type { TierId } from "@/config/site";
import { createStripeCheckoutUrl, verifyCheckoutSession } from "@/lib/stripe";
import { createLemonSqueezyCheckoutUrl, verifyLemonSqueezyOrder } from "@/lib/lemonsqueezy";

export type { VerifyResult, CreateCheckoutResult } from "@/lib/stripe";

// Single switch between payment providers. Stripe is the default — you are
// the merchant of record and handle VAT/sales tax yourself (optionally with
// the paid Stripe Tax add-on). Set PAYMENT_PROVIDER=lemonsqueezy to use
// Lemon Squeezy instead, which acts as merchant of record and collects and
// remits VAT for you — useful if you want to sell before you've registered
// for VAT yourself. Every other route in the app calls only the two
// functions below, so this is the only place that needs to know which
// provider is active.
const PROVIDER = process.env.PAYMENT_PROVIDER === "lemonsqueezy" ? "lemonsqueezy" : "stripe";

export function createCheckoutUrl(tier: TierId, origin: string) {
  return PROVIDER === "lemonsqueezy" ? createLemonSqueezyCheckoutUrl(tier, origin) : createStripeCheckoutUrl(tier, origin);
}

export function verifyPurchase(id: string) {
  return PROVIDER === "lemonsqueezy" ? verifyLemonSqueezyOrder(id) : verifyCheckoutSession(id);
}
