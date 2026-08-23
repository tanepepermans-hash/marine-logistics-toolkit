import { ClipboardCheck, Compass, Send } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionBadge from "@/components/ui/SectionBadge";

const steps = [
  {
    icon: Compass,
    number: "01",
    title: "Identify the Situation",
    description: "Choose the relevant checklist, workflow or template.",
  },
  {
    icon: ClipboardCheck,
    number: "02",
    title: "Follow the Workflow",
    description: "Verify the documents, cargo details and operational requirements.",
  },
  {
    icon: Send,
    number: "03",
    title: "Take Action",
    description: "Use the email template or AI prompt to communicate and move the shipment forward.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-navy-900 py-24 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionBadge tone="dark">How It Works</SectionBadge>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Use It While You&apos;re Working
          </h2>
        </Reveal>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3 md:gap-6">
          <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block" />
          {steps.map(({ icon: Icon, number, title, description }, i) => (
            <Reveal key={number} delay={i * 0.1}>
              <div className="relative flex flex-col items-center text-center md:items-start md:text-left">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-navy-800 shadow-premium">
                  <Icon className="h-7 w-7 text-ocean-400" aria-hidden />
                </div>
                <span className="mt-5 text-xs font-bold tracking-[0.2em] text-ocean-400">
                  STEP {number}
                </span>
                <h3 className="mt-2 text-xl font-semibold text-white">{title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-mist-400">{description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
