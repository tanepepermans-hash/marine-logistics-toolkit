import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import CheckoutButton from "@/components/CheckoutButton";
import { siteConfig } from "@/config/site";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
      <div className="pointer-events-none absolute inset-0 bg-grid-overlay" />
      <Container className="relative text-center">
        <Reveal>
          <h2 className="mx-auto max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Spend Less Time Searching. Spend More Time Solving Shipments.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-mist-300">
            Keep your most-used marine logistics workflows, email templates and checklists in one
            place.
          </p>
          <div className="mt-10 flex justify-center">
            <CheckoutButton
              label={`Get the Marine Logistics Operator Toolkit — ${siteConfig.currencySymbol}${siteConfig.tiers.standard.price}`}
              size="lg"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
