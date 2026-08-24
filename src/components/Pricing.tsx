import { CheckCircle2, Lock, Star } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionBadge from "@/components/ui/SectionBadge";
import CheckoutButton from "@/components/CheckoutButton";
import { siteConfig } from "@/config/site";

const standardIncludes = [
  "Marine Logistics Operator Toolkit (PDF)",
  "30 professional email templates",
  "12 operational checklists",
  "6 shipment problem workflows",
  "6 AI Operator prompts",
  "Emergency Vessel Shipment Checklist",
  "Instant digital access",
  "One-time payment",
];

const premiumIncludes = [
  "Everything in Standard",
  "5 extra Advanced Operator templates",
  "Claims & Damage checklist",
  "Editable Word doc — all 35 templates",
  "Editable Excel shipment tracker",
  "Priority email support",
];

const paymentMethods = ["Visa", "Mastercard", "Apple Pay", "Google Pay"];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-mist-50 py-24 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionBadge>Pricing</SectionBadge>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Choose Your Toolkit
          </h2>
          <p className="mt-4 text-base leading-relaxed text-navy-600">
            Start with the core toolkit, or go Premium for editable templates and a working
            shipment tracker.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-4xl gap-8 lg:grid-cols-2 lg:items-start">
          {/* Standard */}
          <Reveal>
            <div className="flex h-full flex-col rounded-3xl border border-navy-900/10 bg-white p-8 shadow-premium sm:p-10">
              <span className="inline-flex w-fit items-center rounded-full bg-ocean-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-ocean-700">
                Launch Offer
              </span>

              <h3 className="mt-6 text-xl font-bold text-navy-900">Standard</h3>

              <div className="mt-3 flex items-end gap-3">
                <span className="text-lg font-medium text-mist-400 line-through">
                  {siteConfig.currencySymbol}
                  {siteConfig.tiers.standard.originalPrice}
                </span>
                <span className="text-5xl font-bold tracking-tight text-navy-900">
                  {siteConfig.currencySymbol}
                  {siteConfig.tiers.standard.price}
                </span>
              </div>
              <p className="mt-2 text-sm text-navy-500">One-time payment · Instant digital access</p>

              <ul className="mt-8 flex-1 space-y-3">
                {standardIncludes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-ocean-500" aria-hidden />
                    <span className="text-sm font-medium text-navy-700">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <CheckoutButton
                  label={`Get Standard — ${siteConfig.currencySymbol}${siteConfig.tiers.standard.price}`}
                  tier="standard"
                  variant="dark"
                  size="lg"
                  className="w-full"
                />
              </div>
            </div>
          </Reveal>

          {/* Premium */}
          <Reveal delay={0.1}>
            <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-amber-400/30 bg-navy-900 p-8 shadow-premium-lg sm:p-10">
              <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
              <span className="relative inline-flex w-fit items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-300 to-amber-500 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-amber-950">
                <Star className="h-3.5 w-3.5" aria-hidden />
                Most Complete
              </span>

              <h3 className="relative mt-6 text-xl font-bold text-white">Premium</h3>

              <div className="relative mt-3 flex items-end gap-3">
                <span className="text-lg font-medium text-mist-500 line-through">
                  {siteConfig.currencySymbol}
                  {siteConfig.tiers.premium.originalPrice}
                </span>
                <span className="text-5xl font-bold tracking-tight text-white">
                  {siteConfig.currencySymbol}
                  {siteConfig.tiers.premium.price}
                </span>
              </div>
              <p className="relative mt-2 text-sm text-mist-400">One-time payment · Instant digital access</p>

              <ul className="relative mt-8 flex-1 space-y-3">
                {premiumIncludes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
                    <span className="text-sm font-medium text-mist-100">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="relative mt-8">
                <CheckoutButton
                  label={`Get Premium — ${siteConfig.currencySymbol}${siteConfig.tiers.premium.price}`}
                  tier="premium"
                  variant="primary"
                  size="lg"
                  className="w-full !bg-gradient-to-b !from-amber-300 !to-amber-500 !text-amber-950 !shadow-none hover:!from-amber-200 hover:!to-amber-400"
                />
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mx-auto mt-10 max-w-2xl text-center">
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
