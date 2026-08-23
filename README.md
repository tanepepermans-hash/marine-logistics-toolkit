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
        └── site.ts               # Price, checkout link, contact email — see below

private/
└── toolkit/
    └── marine-logistics-operator-toolkit.pdf   # The actual paid product (see section 4)
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
   - `STRIPE_PRICE_ID`
   - `NEXT_PUBLIC_SITE_URL` (your production domain)
   - `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` (optional, see below)
4. Deploy. Every push to your main branch redeploys automatically.

## 4. Connect Stripe and Get Paid

### 4a. One-time setup in the Stripe Dashboard

1. Create a [Stripe account](https://dashboard.stripe.com/register) (or log
   into your existing one). You can build and test everything below in
   **Test mode** first — the toggle is in the top-right of the dashboard.
2. Go to **Product catalog → + Add product**.
   - Name: `Marine Logistics Operator Toolkit`
   - Pricing: **One time**, amount `€29.00` (or your current price)
   - Save the product, then open it and copy the **Price ID** — it looks
     like `price_1AbCdEfGhIjKlMnO`.
3. Go to **Developers → API keys** and copy the **Secret key** — it looks
   like `sk_test_...` in test mode, `sk_live_...` once you activate live
   payments. Never share this key or commit it to git.
4. Later, to accept real money: click **Activate payments** in the
   dashboard, fill in your business/bank details, then switch the dashboard
   toggle to **Live mode** and repeat step 2–3 to get your **live** price ID
   and secret key.

### 4b. Wire it into the site — two options

- **Option A — Dynamic Checkout Session (built in, default, recommended):**
  set `STRIPE_SECRET_KEY` and `STRIPE_PRICE_ID` from step 4a as environment
  variables (in `.env.local` for local dev, or Vercel → Project Settings →
  Environment Variables for production). Every "Get Instant Access" / "Get
  Toolkit" button then POSTs to `/api/checkout`
  (`src/app/api/checkout/route.ts`), which creates a real Stripe Checkout
  Session server-side and redirects the buyer to Stripe's hosted payment
  page. The secret key is read only on the server and is **never** sent to
  the browser.
- **Option B — Stripe Payment Link (no code):** in the Stripe Dashboard, go
  to **Payment links → +**, select your toolkit product, and under
  **After payment** set the redirect URL to
  `https://yourdomain.com/download?session_id={CHECKOUT_SESSION_ID}`
  (Stripe fills in the `{CHECKOUT_SESSION_ID}` part automatically — type it
  literally). Then set `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` to that Payment
  Link URL and every button links straight to it instead of using
  `/api/checkout`.

### 4c. Test before going live

With Stripe still in **Test mode**, run the site and click "Get Instant
Access". On Stripe's checkout page, pay with the test card
`4242 4242 4242 4242`, any future expiry date, any CVC. You should land on
`/download` with a working download button. Only switch to your **live**
keys once this works end-to-end.

## 5. How Buyers Receive the Toolkit After Paying

This is wired up already — you only need to do the Stripe setup above and
make sure the real PDF file exists at
`private/toolkit/marine-logistics-operator-toolkit.pdf`.

1. Stripe redirects a paying customer to
   `/download?session_id=...` (`src/app/download/page.tsx`).
2. That page calls `verifyCheckoutSession()` (`src/lib/stripe.ts`), which
   asks Stripe's API to confirm the session is real and `payment_status`
   is `paid`. If it isn't, the buyer sees a friendly "we couldn't confirm
   this order" message with your support email — never a download link.
3. If the payment is confirmed, the page shows a **Download Toolkit (PDF)**
   button pointing at `/api/download?session_id=...`
   (`src/app/api/download/route.ts`), which re-verifies the session again
   and streams the PDF from `private/toolkit/`.
4. The real file lives **outside** `public/`, so it is never reachable by
   guessing or sharing a direct URL — only through this verified route.

**Important:** the actual toolkit PDF is committed to this repository at
`private/toolkit/marine-logistics-operator-toolkit.pdf` so it deploys
together with the app (Vercel needs the file present to serve it). Make
sure this GitHub repository stays **private** — anyone with read access to
the repo can see the paid product. If you'd rather keep the file out of
git entirely, swap the `fs.readFile` call in
`src/app/api/download/route.ts` for a fetch from a storage service (Vercel
Blob, S3, etc.) instead.

To replace the toolkit content itself, generate a new PDF and overwrite
`private/toolkit/marine-logistics-operator-toolkit.pdf` — nothing else
needs to change.

## 6. Where to Change the Product Price

Edit `src/config/site.ts`:

```ts
export const siteConfig = {
  price: 29,          // <-- current price, shown everywhere
  originalPrice: 49,   // <-- crossed-out "launch offer" price
  contactEmail: "support@marinelogisticstoolkit.com", // <-- support email
  ...
};
```

Every price shown on the site (nav, hero, pricing card, final CTA) reads from
this single `siteConfig.price` value.

> **Note:** `siteConfig.price` only controls the number displayed on the
> page. The amount actually charged is whatever price your `STRIPE_PRICE_ID`
> points to in the Stripe Dashboard (see section 4) — if you change one,
> change the other to match.

## 7. Where to Change Text / Images

- **All copy** lives directly in each section's component under
  `src/components/` as plain strings or small arrays at the top of the file
  (e.g. `emailTemplates`, `checklists`, `workflows` in `Features.tsx`, or
  `faqs` in `FAQ.tsx`). Edit the arrays/strings — no other logic needs to
  change.
- **Site-wide values** (name, tagline, price, contact email, checkout URL)
  live in `src/config/site.ts`.
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
- The toolkit PDF (`private/toolkit/marine-logistics-operator-toolkit.pdf`)
  is a real first edition: 30 email templates, 12 checklists, 6 shipment
  problem workflows, 6 AI operator prompts, and the bonus emergency
  checklist. Regenerate or replace it any time — see section 5.
