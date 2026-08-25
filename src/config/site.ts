// ---------------------------------------------------------------------------
// Central site configuration.
// Edit the values below to rebrand, reprice or repoint checkout — nothing
// else in the codebase should need to change.
// ---------------------------------------------------------------------------

export type TierId = "standard" | "premium" | "dg" | "bundle";

export const siteConfig = {
  name: "Marine Logistics Operator Toolkit",
  shortName: "Operator Toolkit",
  tagline:
    "The practical toolkit for junior marine logistics operators — with ready-to-use email templates, operational checklists, AI prompts and shipment workflows.",

  currency: "EUR" as const,
  currencySymbol: "€",

  // <-- CHANGE CONTACT EMAIL HERE
  contactEmail: "support@marinelogisticstoolkit.com",

  // Canonical production URL, used for metadata / Open Graph / sitemap.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://marinelogisticstoolkit.com",

  // ---------------------------------------------------------------------
  // PRICING TIERS
  // ---------------------------------------------------------------------
  // <-- CHANGE PRODUCT PRICES HERE (used everywhere on the site)
  // "standard" is the toolkit alone. "premium" adds the editable Word
  // templates, the Excel shipment tracker and 5 extra advanced templates —
  // see scripts/toolkit-content/ for that content. "dg" is the DG Training
  // Academy (/dg-training) sold on its own. "bundle" is Toolkit Premium +
  // DG Training Academy together at a discount.
  tiers: {
    standard: {
      id: "standard" as TierId,
      name: "Standard",
      price: 29,
      originalPrice: 49,
    },
    premium: {
      id: "premium" as TierId,
      name: "Premium",
      price: 59,
      originalPrice: 89,
    },
    dg: {
      id: "dg" as TierId,
      name: "DG Training Academy",
      price: 19,
      originalPrice: 29,
    },
    bundle: {
      id: "bundle" as TierId,
      name: "Everything Bundle",
      price: 69,
      // Premium (59) + DG Training Academy (19) bought separately = 78.
      originalPrice: 78,
    },
  },

  // ---------------------------------------------------------------------
  // STRIPE CHECKOUT
  // ---------------------------------------------------------------------
  // Two supported modes — pick whichever fits your setup:
  //
  // 1) Stripe Payment Links (no server code needed): set
  //    NEXT_PUBLIC_STRIPE_PAYMENT_LINK_STANDARD / _PREMIUM in your
  //    environment to URLs like https://buy.stripe.com/xxxxxxxx and the
  //    matching CTA buttons will link to them directly. Remember to set
  //    each Payment Link's "After payment" redirect to
  //    {yourdomain}/download?session_id={CHECKOUT_SESSION_ID} in the
  //    Stripe Dashboard so the download page still works.
  //
  // 2) Dynamic Checkout Session (this repo's default): leave both payment
  //    links empty and set STRIPE_SECRET_KEY + STRIPE_PRICE_ID_STANDARD +
  //    STRIPE_PRICE_ID_PREMIUM (server-side only, see .env.example). CTA
  //    buttons POST { tier } to /api/checkout, which creates a Stripe
  //    Checkout Session for the right price and redirects the buyer.
  //    See src/app/api/checkout/route.ts.
  //
  // The secret key is read only inside the server route and is never sent
  // to the browser.
  stripePaymentLinks: {
    standard: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_STANDARD ?? "",
    premium: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PREMIUM ?? "",
    dg: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_DG ?? "",
    bundle: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_BUNDLE ?? "",
  },

  social: {
    twitter: "",
    linkedin: "",
  },
} as const;

export function formatPrice(amount: number): string {
  return `${siteConfig.currencySymbol}${amount}`;
}

// Which tiers grant access to the DG Training Academy (/dg-training premium
// features), and which tiers include a downloadable toolkit file.
export function tierUnlocksDg(tier: TierId): boolean {
  return tier === "dg" || tier === "bundle";
}
export function tierHasToolkitFile(tier: TierId): boolean {
  return tier === "standard" || tier === "premium" || tier === "bundle";
}
