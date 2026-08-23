import { AlertTriangle, GitBranch, ListChecks, Mail, Plane, Sparkles } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionBadge from "@/components/ui/SectionBadge";
import DocumentMockup from "@/components/ui/DocumentMockup";

const pages = [
  { title: "Vessel Delivery Checklist", kind: "Checklist", icon: ListChecks, accent: "ocean" as const, lines: 6 },
  { title: "Missing Shipment Workflow", kind: "Workflow", icon: GitBranch, accent: "amber" as const, lines: 5 },
  { title: "Airfreight Quote Checklist", kind: "Checklist", icon: Plane, accent: "ocean" as const, lines: 6 },
  { title: "DG Pre-check", kind: "Pre-check", icon: AlertTriangle, accent: "amber" as const, lines: 5 },
  { title: "Pickup Request Email", kind: "Email Template", icon: Mail, accent: "emerald" as const, lines: 7 },
  { title: "Next Port Decision Tree", kind: "Decision Tree", icon: GitBranch, accent: "violet" as const, lines: 5 },
  { title: "AI Operator Prompt", kind: "AI Prompt", icon: Sparkles, accent: "violet" as const, lines: 4 },
];

export default function ProductPreview() {
  return (
    <section className="bg-navy-900 py-24 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionBadge tone="dark">Inside the Toolkit</SectionBadge>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            A Preview of What You&apos;ll Get
          </h2>
          <p className="mt-4 text-base leading-relaxed text-mist-400">
            Real pages, formatted for daily operational use — not theory slides.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {pages.map((page, i) => (
            <Reveal
              key={page.title}
              delay={i * 0.06}
              className={i === 6 ? "col-span-2 sm:col-span-1" : ""}
            >
              <DocumentMockup {...page} className="transition-transform duration-300 hover:-translate-y-1.5" />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
