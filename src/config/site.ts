// ---------------------------------------------------------------------------
// Central site configuration.
// Edit the values below to rebrand, reprice or repoint checkout — nothing
// else in the codebase should need to change.
// ---------------------------------------------------------------------------

export const siteConfig = {
  name: "Marine Logistics Operator Toolkit",
  shortName: "Operator Toolkit",
  tagline:
    "The practical toolkit for junior marine logistics operators — with ready-to-use email templates, operational checklists, AI prompts and shipment workflows.",

  // <-- CHANGE PRODUCT PRICE HERE (used everywhere on the site)
  price: 29,
  originalPrice: 49,
  currency: "EUR" as const,
  currencySymbol: "€",

  // <-- CHANGE CONTACT EMAIL HERE
  contactEmail: "support@marinelogisticstoolkit.com",

  // Canonical production URL, used for metadata / Open Graph / sitemap.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://marinelogisticstoolkit.com",

  // ---------------------------------------------------------------------
  // STRIPE CHECKOUT
  // ---------------------------------------------------------------------
  // Two supported modes — pick whichever fits your setup:
  //
  // 1) Stripe Payment Link (no server code needed): set
  //    NEXT_PUBLIC_STRIPE_PAYMENT_LINK in your environment to a URL like
  //    https://buy.stripe.com/xxxxxxxx and every CTA button will link to it
  //    directly.
  //
  // 2) Dynamic Checkout Session (this repo's default): leave the payment
  //    link empty and set STRIPE_SECRET_KEY + STRIPE_PRICE_ID (server-side
  //    only, see .env.example). CTA buttons will POST to /api/checkout,
  //    which creates a Stripe Checkout Session and redirects the buyer.
  //    See src/app/api/checkout/route.ts.
  //
  // The secret key is read only inside the server route and is never sent
  // to the browser.
  stripePaymentLink: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? "",

  social: {
    twitter: "",
    linkedin: "",
  },
} as const;

export function formatPrice(amount: number): string {
  return `${siteConfig.currencySymbol}${amount}`;
}
