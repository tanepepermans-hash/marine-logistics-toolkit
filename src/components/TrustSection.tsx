import { ShieldAlert } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionBadge from "@/components/ui/SectionBadge";

export default function TrustSection() {
  return (
    <section className="bg-navy-900 py-24 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionBadge tone="dark">What to Expect</SectionBadge>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            A Practical Reference. Not Another Theory Course.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-mist-300">
            The Marine Logistics Operator Toolkit is designed to help you work more
            systematically, communicate professionally and quickly find the right operational
            next step.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mx-auto mt-10 max-w-3xl">
          <div className="flex items-start gap-3.5 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-6">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
            <p className="text-sm leading-relaxed text-mist-300">
              This toolkit is an educational and operational reference. Dangerous goods, customs
              and regulatory requirements must always be confirmed with qualified parties and the
              relevant carrier, authorities or logistics provider.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
