import { FileText, ListChecks, Mail, Sparkles } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import CheckoutButton from "@/components/CheckoutButton";
import ProductMockup from "@/components/ui/ProductMockup";
import { siteConfig } from "@/config/site";

const trustBadges = [
  { icon: Mail, label: "30 Email Templates" },
  { icon: ListChecks, label: "12 Checklists" },
  { icon: Sparkles, label: "AI Operator Prompts" },
  { icon: FileText, label: "Practical Shipment Workflows" },
];

export default function Hero() {
  return (
    <section id="product" className="relative overflow-hidden pb-20 pt-16 sm:pb-28 sm:pt-20 lg:pb-32">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
      <div className="pointer-events-none absolute inset-0 bg-grid-overlay" />

      <Container className="relative grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
        <Reveal>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ocean-300">
            For Marine &amp; Vessel Logistics Operators
          </p>
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
            Handle Urgent Vessel Shipments With Confidence
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist-300">
            {siteConfig.tagline}
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <CheckoutButton label={`Get Instant Access — ${siteConfig.currencySymbol}${siteConfig.price}`} size="lg" />
            <a
              href="#whats-included"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-7 py-4 text-base font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/5"
            >
              See What&apos;s Included
            </a>
          </div>
          <p className="mt-4 text-sm text-mist-400">One-time payment • Instant digital access</p>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3"
              >
                <Icon className="h-4 w-4 text-ocean-400" aria-hidden />
                <span className="text-xs font-medium leading-snug text-mist-200">{label}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <ProductMockup />
        </Reveal>
      </Container>
    </section>
  );
}
