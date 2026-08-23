import type { LucideIcon } from "lucide-react";

type DocumentMockupProps = {
  title: string;
  kind: string;
  icon: LucideIcon;
  accent?: "ocean" | "amber" | "emerald" | "violet";
  lines?: number;
  rotate?: string;
  className?: string;
};

const accentMap = {
  ocean: {
    gradient: "from-ocean-400 to-ocean-600",
    text: "text-ocean-600",
    chip: "bg-ocean-500/10",
  },
  amber: {
    gradient: "from-amber-400 to-orange-500",
    text: "text-amber-600",
    chip: "bg-amber-500/10",
  },
  emerald: {
    gradient: "from-emerald-400 to-teal-500",
    text: "text-emerald-600",
    chip: "bg-emerald-500/10",
  },
  violet: {
    gradient: "from-violet-400 to-indigo-500",
    text: "text-violet-600",
    chip: "bg-violet-500/10",
  },
};

// A reusable "premium document page" mockup — used across the hero,
// product preview and bonus sections instead of real screenshots.
export default function DocumentMockup({
  title,
  kind,
  icon: Icon,
  accent = "ocean",
  lines = 6,
  rotate = "",
  className = "",
}: DocumentMockupProps) {
  const { gradient, text, chip } = accentMap[accent];

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-white/10 bg-mist-50 shadow-premium ${rotate} ${className}`}
    >
      <div className={`flex items-center gap-2.5 bg-gradient-to-r ${gradient} px-4 py-3`}>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20">
          <Icon className="h-4 w-4 text-white" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-white">{title}</p>
          <p className="text-[10px] uppercase tracking-wide text-white/75">{kind}</p>
        </div>
      </div>
      <div className="space-y-2.5 px-4 py-4">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full bg-navy-900/10 ${
              i === 0 ? "w-4/5" : i % 3 === 0 ? "w-2/3" : "w-full"
            }`}
          />
        ))}
        <div className="flex gap-2 pt-1">
          <span className={`rounded-md px-2 py-1 text-[10px] font-semibold ${chip} ${text}`}>
            Ready to use
          </span>
        </div>
      </div>
    </div>
  );
}
