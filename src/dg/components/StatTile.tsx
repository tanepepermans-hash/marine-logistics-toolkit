import type { LucideIcon } from "lucide-react";

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  accent?: string; // tailwind text-* color for the icon
}

export default function StatTile({ icon: Icon, label, value, accent = "text-hazard-orange" }: StatTileProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-navy-800/70 p-4">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 ${accent}`}>
        <Icon size={20} />
      </span>
      <div className="min-w-0">
        <div className="truncate text-lg font-bold text-white">{value}</div>
        <div className="truncate text-xs text-mist-400">{label}</div>
      </div>
    </div>
  );
}
