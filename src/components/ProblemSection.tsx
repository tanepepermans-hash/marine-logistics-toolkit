import {
  AlertTriangle,
  CalendarX,
  Clock,
  FileWarning,
  MapPin,
  PackageX,
  PlaneOff,
  Warehouse,
} from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionBadge from "@/components/ui/SectionBadge";

const situations = [
  { icon: Clock, text: "Vessel leaves in 12 hours" },
  { icon: Warehouse, text: "Cargo is still at another warehouse" },
  { icon: FileWarning, text: "Agent needs documents urgently" },
  { icon: AlertTriangle, text: "Shipment contains potential DG" },
  { icon: PackageX, text: "Supplier has not released cargo" },
  { icon: PlaneOff, text: "Airline rejects the booking" },
  { icon: MapPin, text: "Vessel changes port" },
  { icon: CalendarX, text: "Shipment misses the deadline" },
];

export default function ProblemSection() {
  return (
    <section className="bg-mist-50 py-24 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionBadge>The Reality on the Ground</SectionBadge>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Marine Logistics Moves Fast. Training Usually Doesn&apos;t.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-navy-600">
            Junior operators are often expected to figure it out through trial and error —
            learning what to do the hard way, one urgent shipment at a time.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {situations.map(({ icon: Icon, text }, i) => (
            <Reveal key={text} delay={i * 0.04}>
              <div className="group flex h-full flex-col justify-between gap-6 rounded-2xl border border-navy-900/8 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-premium">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean-500/10 text-ocean-600 transition-colors group-hover:bg-ocean-500 group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <p className="text-sm font-semibold leading-snug text-navy-800">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15} className="mx-auto mt-14 max-w-2xl text-center">
          <p className="text-base leading-relaxed text-navy-600">
            Instead of searching through old emails or asking the same questions every time, use
            structured workflows, templates and checklists to know what to do next.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
