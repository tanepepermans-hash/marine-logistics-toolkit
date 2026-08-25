import { TriangleAlert } from "lucide-react";

export default function LegalFooter() {
  return (
    <div className="mt-10 flex items-start gap-2.5 rounded-xl border border-white/10 bg-navy-950/40 px-4 py-3 text-xs leading-relaxed text-mist-500">
      <TriangleAlert size={14} className="mt-0.5 shrink-0 text-hazard-amber" />
      <p>
        <span className="font-semibold text-mist-400">Training tool only — not an official DG certification.</span>{" "}
        DG Training is an educational study aid and does not issue, replace, or count toward any legally required
        Dangerous Goods certification or recurrent training. It is not a substitute for the current official{" "}
        <span className="text-mist-400">IATA Dangerous Goods Regulations (DGR)</span>,{" "}
        <span className="text-mist-400">ADR</span>, <span className="text-mist-400">IMDG Code</span>, or your
        employer&apos;s approved DG procedures. Regulations change periodically (IATA DGR annually, ADR/IMDG on
        their own cycles) — always verify current requirements with an accredited training provider and your
        company&apos;s DG compliance officer before handling, packaging, labeling, or shipping dangerous goods.
      </p>
    </div>
  );
}
