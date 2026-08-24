# Marine Logistics Operator Toolkit — Sales Site

A one-page, conversion-focused sales website for the **Marine Logistics Operator
Toolkit** digital product. Built with Next.js (App Router), React, TypeScript
and Tailwind CSS.

## 1. Final File Structure

```
marine-logistics-toolkit/
├── .env.example                 # Copy to .env.local and fill in Stripe keys
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts           # Brand colors, shadows, animations
├── tsconfig.json
├── public/                      # Static assets (add real images here if desired)
└── src/
    ├── app/
    │   ├── layout.tsx           # Root layout, fonts, SEO metadata
    │   ├── page.tsx             # Assembles every section, in order
    │   ├── globals.css          # Tailwind entrypoint + small global styles
    │   ├── icon.svg              # Favicon (Next.js file convention)
    │   ├── opengraph-image.tsx   # Generated OG/social preview image
    │   ├── privacy/page.tsx      # Placeholder legal page
    │   ├── terms/page.tsx        # Placeholder legal page
    │   ├── refunds/page.tsx      # Placeholder legal page
    │   ├── download/page.tsx     # Post-purchase page — verifies payment, shows download button
    │   └── api/
    │       ├── checkout/route.ts # Server-side Stripe Checkout Session creation
    │       └── download/route.ts # Re-verifies payment, streams the toolkit PDF
    ├── lib/
    │   └── stripe.ts             # Shared helper: verifies a Checkout Session with Stripe
    ├── components/
    │   ├── Navbar.tsx
    │   ├── Hero.tsx
    │   ├── ProblemSection.tsx
    │   ├── Features.tsx          # "What's Included"
    │   ├── ScenarioExample.tsx   # Interactive shipment → action plan demo
    │   ├── HowItWorks.tsx
    │   ├── Audience.tsx
    │   ├── ProductPreview.tsx
    │   ├── Bonus.tsx
    │   ├── Pricing.tsx
    │   ├── TrustSection.tsx
    │   ├── FAQ.tsx
    │   ├── FinalCTA.tsx
    │   ├── Footer.tsx
    │   ├── LegalPage.tsx         # Shared layout for /privacy, /terms, /refunds
    │   ├── CheckoutButton.tsx    # Client component that drives checkout
    │   └── ui/
    │       ├── Container.tsx
    │       ├── SectionBadge.tsx
    │       ├── Reveal.tsx        # Scroll-entrance animation wrapper
    │       ├── ProductMockup.tsx # CSS-built hero "laptop + documents" mockup
    │       └── DocumentMockup.tsx# Reusable "toolkit page" preview card
    └── config/
        └── site.ts               # Prices (both tiers), checkout links, contact email

private/
└── toolkit/
    ├── marine-logistics-operator-toolkit.pdf           # Standard tier deliverable
    └── marine-logistics-operator-toolkit-premium.zip   # Premium tier deliverable (see section 5)

scripts/
└── toolkit-content/       # Regenerates the files in private/toolkit/ — see its own README
    ├── build_pdf.py         # All toolkit copy + PDF layout (Standard and Premium)
    ├── build_docx.py        # Editable Word doc of all templates (Premium only)
    └── build_xlsx.py        # Editable Excel shipment tracker (Premium only)
```

## 2. Run Locally

Requires Node.js 18.18+ and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note on this environment:** this project was built in a sandbox whose
> outbound network access to npm's registry was blocked, so `npm install`
> could not be executed or verified here. Every file was hand-written and
> statically reviewed (including a `tsc --noEmit` pass against the actual
> `tsconfig.json`, which reported zero syntax or logic errors — only the
> expected "cannot find module" noise from the missing `node_modules`). Run
> `npm install && npm run build` in a normal environment to install
> dependencies and confirm the production build.

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```

## 3. Deploy to Vercel

1. Push this repository to GitHub (or GitLab/Bitbucket).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
   Vercel auto-detects Next.js — no configuration needed.
3. Add environment variables under **Project Settings → Environment
   Variables** (see `.env.example`):
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRICE_ID_STANDARD`
   - `STRIPE_PRICE_ID_PREMIUM`
   - `NEXT_PUBLIC_SITE_URL` (your production domain)
   - `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_STANDARD` / `_PREMIUM` (optional, see below)
4. Deploy. Every push to your main branch redeploys automatically.

## 4. Connect Stripe and Get Paid

### 4a. One-time setup in the Stripe Dashboard

1. Create a [Stripe account](https://dashboard.stripe.com/register) (or log
   into your existing one). You can build and test everything below in
   **Test mode** first — the toggle is in the top-right of the dashboard.
2. Go to **Product catalog → + Add product** and create **two** products
   (or one product with two Prices):
   - `Marine Logistics Operator Toolkit — Standard`, one-time, `€29.00`
   - `Marine Logistics Operator Toolkit — Premium`, one-time, `€59.00`
   - Open each and copy its **Price ID** — looks like `price_1AbCdEfGhIjKlMnO`.
3. Go to **Developers → API keys** and copy the **Secret key** — it looks
   like `sk_test_...` in test mode, `sk_live_...` once you activate live
   payments. Never share this key or commit it to git.
4. Later, to accept real money: click **Activate payments** in the
   dashboard, fill in your business/bank details, then switch the dashboard
   toggle to **Live mode** and repeat step 2–3 to get your **live** price
   IDs and secret key.

### 4b. Wire it into the site — two options

- **Option A — Dynamic Checkout Session (built in, default, recommended):**
  set `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_STANDARD` and
  `STRIPE_PRICE_ID_PREMIUM` from step 4a as environment variables (in
  `.env.local` for local dev, or Vercel → Project Settings → Environment
  Variables for production). Every CTA button POSTs `{ tier: "standard" |
  "premium" }` to `/api/checkout` (`src/app/api/checkout/route.ts`), which
  creates a real Stripe Checkout Session for the right price and redirects
  the buyer to Stripe's hosted payment page. The secret key is read only on
  the server and is **never** sent to the browser.
- **Option B — Stripe Payment Links (no code):** in the Stripe Dashboard,
  create a Payment Link for each tier's product, and under **After
  payment** set each one's redirect URL to
  `https://yourdomain.com/download?session_id={CHECKOUT_SESSION_ID}`
  (Stripe fills in the `{CHECKOUT_SESSION_ID}` part automatically — type it
  literally). Then set `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_STANDARD` and
  `_PREMIUM` to those URLs and the matching buttons link straight to them
  instead of using `/api/checkout`.

### 4c. Test before going live

With Stripe still in **Test mode**, run the site and click a "Get
Standard"/"Get Premium" button. On Stripe's checkout page, pay with the
test card `4242 4242 4242 4242`, any future expiry date, any CVC. You
should land on `/download` with a working download button for the tier you
bought. Only switch to your **live** keys once this works end-to-end for
both tiers.

## 5. How Buyers Receive the Toolkit After Paying

This is wired up already — you only need to do the Stripe setup above and
make sure the real files exist in `private/toolkit/` (they're already
there — see below).

1. Stripe redirects a paying customer to
   `/download?session_id=...` (`src/app/download/page.tsx`).
2. That page calls `verifyCheckoutSession()` (`src/lib/stripe.ts`), which
   asks Stripe's API to confirm the session is real, `payment_status` is
   `paid`, and which **tier** was purchased (read from the session's
   metadata, or — for Payment Link checkouts, which don't carry our
   metadata — inferred from the Price ID that was actually bought). If
   payment isn't confirmed, the buyer sees a friendly "we couldn't confirm
   this order" message with your support email — never a download link.
3. If confirmed, the page shows a tier-specific download button pointing
   at `/api/download?session_id=...` (`src/app/api/download/route.ts`),
   which re-verifies the session again and streams the right file:
   - **Standard** → `marine-logistics-operator-toolkit.pdf`
   - **Premium** → `marine-logistics-operator-toolkit-premium.zip`
     (Premium PDF + editable Word templates + Excel shipment tracker)
4. Both files live **outside** `public/`, so neither is reachable by
   guessing or sharing a direct URL — only through this verified route.

**Important:** both deliverables are committed to this repository under
`private/toolkit/` so they deploy together with the app (Vercel needs the
files present to serve them). Make sure this GitHub repository stays
**private** — anyone with read access to the repo can see the paid
products. If you'd rather keep them out of git entirely, swap the
`fs.readFile` call in `src/app/api/download/route.ts` for a fetch from a
storage service (Vercel Blob, S3, etc.) instead.

To edit the toolkit's actual content (templates, checklists, workflows,
prompts, the tracker) see `scripts/toolkit-content/README.md` — it
regenerates every file in `private/toolkit/` from one Python source of
truth, no `pip install` required.

## 6. Where to Change Prices

Edit `src/config/site.ts`:

```ts
export const siteConfig = {
  tiers: {
    standard: { price: 29, originalPrice: 49, ... },  // <-- Standard tier
    premium: { price: 59, originalPrice: 89, ... },    // <-- Premium tier
  },
  contactEmail: "support@marinelogisticstoolkit.com", // <-- support email
  ...
};
```

Every price shown on the site (nav, hero, pricing cards, final CTA) reads
from these two values.

> **Note:** `siteConfig.tiers` only controls the numbers displayed on the
> page. The amount actually charged is whatever price your
> `STRIPE_PRICE_ID_STANDARD` / `STRIPE_PRICE_ID_PREMIUM` point to in the
> Stripe Dashboard (see section 4) — if you change one, change the other to
> match.

## 7. Where to Change Text / Images

- **All copy** lives directly in each section's component under
  `src/components/` as plain strings or small arrays at the top of the file
  (e.g. `emailTemplates`, `checklists`, `workflows` in `Features.tsx`, or
  `faqs` in `FAQ.tsx`). Edit the arrays/strings — no other logic needs to
  change.
- **Site-wide values** (name, tagline, prices, contact email, checkout
  links) live in `src/config/site.ts`. The Pricing cards' own feature
  lists (`standardIncludes` / `premiumIncludes`) live at the top of
  `src/components/Pricing.tsx`.
- **Images:** the hero, product preview and bonus sections currently use
  CSS-built mockups (`src/components/ui/ProductMockup.tsx` and
  `DocumentMockup.tsx`) instead of real screenshots, so the site works with
  zero image assets. To swap in real product photography or screenshots,
  drop files into `public/` and replace the mockup component usage with a
  Next.js `<Image>` tag pointing at `/your-image.png`.
- **Colors/branding:** the full palette (navy, ocean-blue, mist grey) and
  shadows/animations are defined once in `tailwind.config.ts`.

## Notes

- The DG (dangerous goods) and regulatory disclaimer in the Trust section is
  intentional and should stay — see `src/components/TrustSection.tsx`.
- Legal pages (`/privacy`, `/terms`, `/refunds`) contain placeholder copy —
  replace with reviewed legal text before taking real payments.
- Both tiers ship real first-edition content, not placeholders:
  - **Standard PDF** — 30 email templates, 12 checklists, 6 shipment
    problem workflows, 6 AI operator prompts, and the bonus emergency
    checklist.
  - **Premium ZIP** — everything in Standard, plus 5 extra "Advanced
    Operator" templates (claims, multi-modal routing, escalation, vessel
    substitution, contract rate requests) and a Claims & Damage checklist,
    an **editable Word doc** with all 35 templates, and an **editable Excel
    shipment tracker**.
  - Regenerate or edit any of it any time via `scripts/toolkit-content/`.
