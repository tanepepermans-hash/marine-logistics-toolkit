import { CheckCircle2, ListChecks, Mail, Sparkles, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionBadge from "@/components/ui/SectionBadge";

const emailTemplates = [
  "Pickup requests",
  "POD requests",
  "Pre-alerts",
  "Vessel delivery instructions",
  "Warehouse releases",
  "Dimensions requests",
  "Missing shipment follow-ups",
  "Delay notifications",
  "Next-port proposals",
  "DG information requests",
  "Airfreight quotation requests",
  "Agent coordination",
];

const checklists = [
  "Vessel Delivery Checklist",
  "Urgent Shipment Checklist",
  "Airfreight Quote Checklist",
  "Cargo Readiness Checklist",
  "Pre-alert Checklist",
  "DG Pre-check",
  "Customs Documentation Check",
  "Warehouse Pickup Check",
  "Next Port Checklist",
  "Onboard Delivery Checklist",
];

const workflows = [
  "Shipment will miss vessel",
  "Supplier hasn't released cargo",
  "Airline rejects shipment",
  "Documents are missing",
  "Vessel changes port",
  "Cargo cannot be delivered onboard",
];

const aiOutputs = [
  "Operational action plans",
  "Customer emails",
  "Agent instructions",
  "Risk assessments",
  "Backup solutions",
  "Missing-information checklists",
];

type FeatureCard = {
  icon: LucideIcon;
  title: string;
  description: string;
  items: string[];
};

const cards: FeatureCard[] = [
  {
    icon: Mail,
    title: "30 Professional Email Templates",
    description: "Ready-to-send templates for the messages operators write every day.",
    items: emailTemplates,
  },
  {
    icon: ListChecks,
    title: "12 Operational Checklists",
    description: "Step-by-step checklists to verify cargo, documents and vessel requirements.",
    items: checklists,
  },
  {
    icon: Workflow,
    title: "Shipment Problem Workflows",
    description: "Decision paths for the situations that derail an otherwise smooth shipment.",
    items: workflows,
  },
];

export default function Features() {
  return (
    <section id="whats-included" className="bg-navy-900 py-24 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionBadge tone="dark">What&apos;s Included</SectionBadge>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything You Need in One Operator Toolkit
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {cards.map(({ icon: Icon, title, description, items }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-colors duration-200 hover:border-ocean-400/30 sm:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-400 to-ocean-600 shadow-glow">
                  <Icon className="h-6 w-6 text-white" aria-hidden />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-400">{description}</p>
                <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-mist-200">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ocean-400" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}

          {/* Card 4 — AI Operator Prompts, with a sample prompt visual */}
          <Reveal delay={0.24}>
            <div className="flex h-full flex-col rounded-2xl border border-ocean-400/25 bg-gradient-to-b from-ocean-500/[0.08] to-transparent p-7 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-400 to-ocean-600 shadow-glow">
                <Sparkles className="h-6 w-6 text-white" aria-hidden />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">AI Operator Prompts</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist-400">
                Turn raw shipment data into ready operational output — paste your prompt into any
                AI assistant along with your shipment details.
              </p>
              <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {aiOutputs.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-mist-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ocean-400" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-xl border border-white/10 bg-navy-950/60 p-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-ocean-300">
                  Sample Prompt
                </p>
                <p className="font-mono text-[13px] leading-relaxed text-mist-300">
                  &ldquo;Here is my shipment data: [vessel, ETD, cargo, weight, DG status]. Generate an
                  operational action plan, identify risks, and draft a customer update
                  email.&rdquo;
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
