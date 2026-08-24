import {
  Anchor,
  CheckSquare,
  FileText,
  Gift,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionBadge from "@/components/ui/SectionBadge";
import LeadMagnetForm from "@/components/LeadMagnetForm";

const checks = [
  { icon: Anchor, label: "Vessel information" },
  { icon: Package, label: "Cargo information" },
  { icon: ShieldCheck, label: "Customs status" },
  { icon: Truck, label: "Transport options" },
  { icon: FileText, label: "Required documents" },
  { icon: CheckSquare, label: "Backup options" },
];

export default function Bonus() {
  return (
    <section className="bg-mist-50 py-24 sm:py-28">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionBadge>
              <Gift className="h-3.5 w-3.5" aria-hidden />
              Free Bonus
            </SectionBadge>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
              Bonus: Emergency Vessel Shipment Checklist
            </h2>
            <p className="mt-5 text-base leading-relaxed text-navy-600">
              A compact one-page checklist for urgent vessel shipments — pull it up the moment a
              shipment turns urgent and work through it top to bottom.
            </p>
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-ocean-600">
              What it checks
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {checks.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2.5 rounded-lg border border-navy-900/8 bg-white px-3.5 py-2.5 text-sm font-medium text-navy-800 shadow-sm"
                >
                  <Icon className="h-4 w-4 shrink-0 text-ocean-600" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mx-auto w-full max-w-sm rounded-2xl border border-navy-900/10 bg-white p-6 shadow-premium-lg">
              <div className="mb-4 flex items-center justify-between border-b border-navy-900/10 pb-4">
                <div>
                  <p className="text-sm font-bold text-navy-900">Emergency Vessel Shipment</p>
                  <p className="text-xs text-navy-500">One-Page Checklist</p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-ocean-400 to-ocean-600">
                  <Anchor className="h-4 w-4 text-white" aria-hidden />
                </span>
              </div>
              <ul className="space-y-3">
                {checks.map(({ label }) => (
                  <li key={label} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border-2 border-ocean-500">
                      <CheckSquare className="h-3.5 w-3.5 text-ocean-500" aria-hidden />
                    </span>
                    <span className="text-sm font-medium text-navy-700">{label}</span>
                  </li>
                ))}
              </ul>
              <LeadMagnetForm />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
