import { CheckCircle2, Lock, ShieldAlert, Sparkles, Star } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionBadge from "@/components/ui/SectionBadge";
import CheckoutButton from "@/components/CheckoutButton";
import { siteConfig } from "@/config/site";

const standardIncludes = [
  "Marine Logistics Operator Toolkit (PDF)",
  "Quick-Start Guide for your first month",
  "49 professional email templates",
  "19 operational checklists",
  "9 shipment problem workflows",
  "11 AI Operator prompts",
  "Glossary & Incoterms reference",
  "Emergency Vessel Shipment Checklist",
  "Instant digital access",
  "One-time payment",
];

const premiumIncludes = [
  "Everything in Standard",
  "8 extra Advanced Operator templates",
  "Claims & Damage checklist",
  "Editable Word doc — all 57 templates",
  "Editable Excel shipment tracker",
  "Priority email support",
];

const dgIncludes = [
  "Full DG Training Academy access",
  "162 practice questions across all 9 hazard classes",
  "7 quiz modes + a guided Course Path + a 10/20/50-question Mixed Exam",
  "Spaced-repetition mistake tracking",
  "XP, levels, streaks & progress analytics",
  "Instant access · One-time payment",
];

const bundleIncludes = [
  "Everything in Toolkit Premium",
  "Everything in DG Training Academy",
  "One toolkit for onboarding AND DG competency",
  "Instant digital access",
  "One-time payment",
];

const paymentMethods = ["Visa", "Mastercard", "Apple Pay", "Google Pay"];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-mist-50 py-24 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionBadge>Pricing</SectionBadge>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Choose What You Need
          </h2>
          <p className="mt-4 text-base leading-relaxed text-navy-600">
            Get the operator toolkit, the DG Training Academy on its own, or both together at a
            discount.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:items-start">
          {/* Standard */}
          <Reveal>
            <div className="flex h-full flex-col rounded-3xl border border-navy-900/10 bg-white p-7 shadow-premium">
              <span className="inline-flex w-fit items-center rounded-full bg-ocean-500/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ocean-700">
                Launch Offer
              </span>
              <h3 className="mt-5 text-lg font-bold text-navy-900">Standard</h3>
              <div className="mt-3 flex items-end gap-2.5">
                <span className="text-base font-medium text-mist-400 line-through">
                  {siteConfig.currencySymbol}
                  {siteConfig.tiers.standard.originalPrice}
                </span>
                <span className="text-4xl font-bold tracking-tight text-navy-900">
                  {siteConfig.currencySymbol}
                  {siteConfig.tiers.standard.price}
                </span>
              </div>
              <p className="mt-2 text-xs text-navy-500">One-time payment</p>

              <ul className="mt-7 flex-1 space-y-2.5">
                {standardIncludes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ocean-500" aria-hidden />
                    <span className="text-[13px] font-medium leading-snug text-navy-700">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <CheckoutButton
                  label={`Get Standard — ${siteConfig.currencySymbol}${siteConfig.tiers.standard.price}`}
                  tier="standard"
                  variant="dark"
                  size="md"
                  className="w-full"
                />
              </div>
            </div>
          </Reveal>

          {/* Premium */}
          <Reveal delay={0.08}>
            <div className="flex h-full flex-col rounded-3xl border border-navy-900/10 bg-white p-7 shadow-premium">
              <span className="inline-flex w-fit items-center rounded-full bg-ocean-500/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ocean-700">
                Most Popular
              </span>
              <h3 className="mt-5 text-lg font-bold text-navy-900">Premium</h3>
              <div className="mt-3 flex items-end gap-2.5">
                <span className="text-base font-medium text-mist-400 line-through">
                  {siteConfig.currencySymbol}
                  {siteConfig.tiers.premium.originalPrice}
                </span>
                <span className="text-4xl font-bold tracking-tight text-navy-900">
                  {siteConfig.currencySymbol}
                  {siteConfig.tiers.premium.price}
                </span>
              </div>
              <p className="mt-2 text-xs text-navy-500">One-time payment</p>

              <ul className="mt-7 flex-1 space-y-2.5">
                {premiumIncludes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ocean-500" aria-hidden />
                    <span className="text-[13px] font-medium leading-snug text-navy-700">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <CheckoutButton
                  label={`Get Premium — ${siteConfig.currencySymbol}${siteConfig.tiers.premium.price}`}
                  tier="premium"
                  variant="dark"
                  size="md"
                  className="w-full"
                />
              </div>
            </div>
          </Reveal>

          {/* DG Training Academy */}
          <Reveal delay={0.16}>
            <div className="flex h-full flex-col rounded-3xl border border-amber-500/25 bg-navy-900 p-7 shadow-premium">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-400/15 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-amber-300">
                <ShieldAlert className="h-3.5 w-3.5" aria-hidden />
                Sold Separately
              </span>
              <h3 className="mt-5 text-lg font-bold text-white">DG Training Academy</h3>
              <div className="mt-3 flex items-end gap-2.5">
                <span className="text-base font-medium text-mist-500 line-through">
                  {siteConfig.currencySymbol}
                  {siteConfig.tiers.dg.originalPrice}
                </span>
                <span className="text-4xl font-bold tracking-tight text-white">
                  {siteConfig.currencySymbol}
                  {siteConfig.tiers.dg.price}
                </span>
              </div>
              <p className="mt-2 text-xs text-mist-400">One-time payment</p>

              <ul className="mt-7 flex-1 space-y-2.5">
                {dgIncludes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden />
                    <span className="text-[13px] font-medium leading-snug text-mist-200">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <CheckoutButton
                  label={`Get DG Training — ${siteConfig.currencySymbol}${siteConfig.tiers.dg.price}`}
                  tier="dg"
                  variant="primary"
                  size="md"
                  className="w-full !bg-gradient-to-b !from-amber-300 !to-amber-500 !text-amber-950 !shadow-none hover:!from-amber-200 hover:!to-amber-400"
                />
              </div>
            </div>
          </Reveal>

          {/* Bundle */}
          <Reveal delay={0.24}>
            <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-amber-400/30 bg-navy-900 p-7 shadow-premium-lg">
              <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
              <span className="relative inline-flex w-fit items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-300 to-amber-500 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-amber-950">
                <Star className="h-3.5 w-3.5" aria-hidden />
                Best Value
              </span>
              <h3 className="relative mt-5 text-lg font-bold text-white">Everything Bundle</h3>
              <div className="relative mt-3 flex items-end gap-2.5">
                <span className="text-base font-medium text-mist-500 line-through">
                  {siteConfig.currencySymbol}
                  {siteConfig.tiers.bundle.originalPrice}
                </span>
                <span className="text-4xl font-bold tracking-tight text-white">
                  {siteConfig.currencySymbol}
                  {siteConfig.tiers.bundle.price}
                </span>
              </div>
              <p className="relative mt-2 text-xs text-mist-400">
                Save {siteConfig.currencySymbol}
                {siteConfig.tiers.bundle.originalPrice - siteConfig.tiers.bundle.price} vs. buying separately
              </p>

              <ul className="relative mt-7 flex-1 space-y-2.5">
                {bundleIncludes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden />
                    <span className="text-[13px] font-medium leading-snug text-mist-100">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="relative mt-7">
                <CheckoutButton
                  label={`Get the Bundle — ${siteConfig.currencySymbol}${siteConfig.tiers.bundle.price}`}
                  tier="bundle"
                  variant="primary"
                  size="md"
                  className="w-full !bg-gradient-to-b !from-amber-300 !to-amber-500 !text-amber-950 !shadow-none hover:!from-amber-200 hover:!to-amber-400"
                />
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.3} className="mx-auto mt-10 max-w-2xl text-center">
          <p className="flex items-center justify-center gap-1.5 text-xs text-navy-500">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            Secure checkout via Stripe
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="rounded-md border border-navy-900/10 bg-white px-3 py-1.5 text-[11px] font-semibold text-navy-600"
              >
                {method}
              </span>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
