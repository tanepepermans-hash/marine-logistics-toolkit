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
    │   └── api/checkout/route.ts # Server-side Stripe Checkout Session creation
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

## 4. Where to Add the Stripe Checkout Link

Two ways to connect Stripe — pick one:

- **Option A — Stripe Payment Link (no code):** create a Payment Link in the
  Stripe Dashboard for the €29 toolkit, then set
  `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` in your environment to that URL. Every
  "Get Instant Access" / "Get Toolkit" button will link straight to it.
- **Option B — Dynamic Checkout Session (built in, default):** leave
  `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` empty and set `STRIPE_SECRET_KEY` +
  `STRIPE_PRICE_ID` instead. Buttons POST to `/api/checkout`
  (`src/app/api/checkout/route.ts`), which creates a Stripe Checkout Session
  server-side via Stripe's REST API and redirects the buyer. The secret key
  is read only on the server and is **never** sent to the browser.

All checkout wiring lives in `src/components/CheckoutButton.tsx` and
`src/app/api/checkout/route.ts` — nothing else needs to change.

## 5. Where to Change the Product Price

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

## 6. Where to Change Text / Images

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
