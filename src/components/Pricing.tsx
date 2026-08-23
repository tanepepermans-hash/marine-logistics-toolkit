import { CheckCircle2, Lock } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import CheckoutButton from "@/components/CheckoutButton";
import { siteConfig } from "@/config/site";

const includes = [
  "Marine Logistics Operator Toolkit",
  "30 professional email templates",
  "12 operational checklists",
  "Shipment problem workflows",
  "AI Operator prompts",
  "Emergency Vessel Shipment Checklist",
  "Instant digital access",
  "One-time payment",
];

const paymentMethods = ["Visa", "Mastercard", "Apple Pay", "Google Pay"];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-mist-50 py-24 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl">
          <div className="relative overflow-hidden rounded-3xl border border-navy-900/10 bg-navy-900 p-8 shadow-premium-lg sm:p-12">
            <div className="pointer-events-none absolute inset-0 bg-radial-fade" />

            <div className="relative text-center">
              <span className="inline-flex items-center rounded-full bg-ocean-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-ocean-300">
                Launch Offer
              </span>

              <div className="mt-6 flex items-end justify-center gap-3">
                <span className="text-lg font-medium text-mist-500 line-through">
                  {siteConfig.currencySymbol}
                  {siteConfig.originalPrice}
                </span>
                <span className="text-6xl font-bold tracking-tight text-white">
                  {siteConfig.currencySymbol}
                  {siteConfig.price}
                </span>
              </div>
              <p className="mt-2 text-sm text-mist-400">One-time payment · Instant digital access</p>

              <ul className="mx-auto mt-9 max-w-sm space-y-3 text-left">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-ocean-400" aria-hidden />
                    <span className="text-sm font-medium text-mist-100">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex justify-center">
                <CheckoutButton
                  label={`Get Instant Access — ${siteConfig.currencySymbol}${siteConfig.price}`}
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                />
              </div>

              <p className="mt-3.5 flex items-center justify-center gap-1.5 text-xs text-mist-400">
                <Lock className="h-3.5 w-3.5" aria-hidden />
                Secure checkout
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                {paymentMethods.map((method) => (
                  <span
                    key={method}
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-mist-300"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
