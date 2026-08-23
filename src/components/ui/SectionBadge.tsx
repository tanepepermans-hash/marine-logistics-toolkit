import type { ReactNode } from "react";

export default function SectionBadge({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  const toneClasses =
    tone === "dark"
      ? "border-white/15 bg-white/5 text-ocean-300"
      : "border-navy-700/10 bg-ocean-500/10 text-ocean-700";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] ${toneClasses}`}
    >
      {children}
    </span>
  );
}
