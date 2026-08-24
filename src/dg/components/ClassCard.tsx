import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { DgClass } from "@/dg/types";
import HazardLabel from "@/dg/components/HazardLabel";

interface ClassCardProps {
  dgClass: DgClass;
  href: string;
  accuracyPct?: number;
  mastered?: boolean;
}

export default function ClassCard({ dgClass, href, accuracyPct, mastered }: ClassCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-navy-800/70 p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-hazard-orange/50 hover:shadow-premium"
    >
      {mastered && (
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-hazard-green/15 px-2 py-0.5 text-[10px] font-semibold text-hazard-green">
          <CheckCircle2 size={12} /> Mastered
        </span>
      )}
      <HazardLabel classId={dgClass.id} size={88} />
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-hazard-orange">Class {dgClass.id}</div>
        <div className="mt-0.5 text-sm font-semibold text-white">{dgClass.name}</div>
      </div>
      {typeof accuracyPct === "number" && (
        <div className="text-xs text-mist-400">{accuracyPct}% accuracy</div>
      )}
    </Link>
  );
}
