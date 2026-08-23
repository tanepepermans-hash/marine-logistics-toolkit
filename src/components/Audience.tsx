import { GraduationCap, Ship, UserCheck, Users } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionBadge from "@/components/ui/SectionBadge";

const audiences = [
  {
    icon: GraduationCap,
    title: "Logistics Trainees",
    description: "Learn operational processes faster.",
  },
  {
    icon: UserCheck,
    title: "Junior Operators",
    description: "Handle shipments with more structure and confidence.",
  },
  {
    icon: Ship,
    title: "Freight Forwarders",
    description: "Use practical vessel-logistics templates and workflows.",
  },
  {
    icon: Users,
    title: "Shipping Teams",
    description: "Provide new employees with a structured operational reference.",
  },
];

export default function Audience() {
  return (
    <section className="bg-mist-50 py-24 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionBadge>Who It&apos;s For</SectionBadge>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Built for People Doing the Actual Work
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map(({ icon: Icon, title, description }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-2xl border border-navy-900/8 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-premium">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ocean-500/10 text-ocean-600">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mt-4 text-base font-semibold text-navy-900">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-navy-600">{description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
