"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Origin = "eu" | "non-eu";
type Category = "electronics" | "textile" | "unknown";

// Duty-rate ranges are deliberately broad category averages, not HS-code
// lookups — see the "why we skip the HS code" note below. VAT is a
// representative EU average since this tool isn't country-locked; the real
// rate runs 17-27% depending on destination.
const CATEGORY_DUTY: Record<Category, { label: string; low: number; high: number }> = {
  electronics: { label: "Electronics & general goods", low: 0, high: 4 },
  textile: { label: "Textiles & footwear", low: 8, high: 12 },
  unknown: { label: "Not sure", low: 2, high: 8 },
};
const EU_VAT_RATE = 0.21;

function num(v: string): number {
  const n = parseFloat(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function round(n: number): number {
  return Math.round(n);
}

function fmt(n: number): string {
  return round(n).toLocaleString("en-EU");
}

export default function LandedCostEstimator() {
  const [origin, setOrigin] = useState<Origin>("non-eu");
  const [productValue, setProductValue] = useState("4000");
  const [freight, setFreight] = useState("500");
  const [category, setCategory] = useState<Category>("electronics");
  const [vatReclaimable, setVatReclaimable] = useState(false);

  const pv = num(productValue);
  const fr = num(freight);
  const customsValue = pv + fr;

  const isEu = origin === "eu";
  const duty = CATEGORY_DUTY[category];
  const dutyLowPct = isEu ? 0 : duty.low;
  const dutyHighPct = isEu ? 0 : duty.high;

  const dutyLow = customsValue * (dutyLowPct / 100);
  const dutyHigh = customsValue * (dutyHighPct / 100);
  const vatRate = isEu ? 0 : EU_VAT_RATE;
  const vatLow = (customsValue + dutyLow) * vatRate;
  const vatHigh = (customsValue + dutyHigh) * vatRate;

  const includedVatLow = vatReclaimable ? 0 : vatLow;
  const includedVatHigh = vatReclaimable ? 0 : vatHigh;

  const landedLow = customsValue + dutyLow + includedVatLow;
  const landedHigh = customsValue + dutyHigh + includedVatHigh;
  const isRange = round(landedLow) !== round(landedHigh);

  const hasInput = pv > 0;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
      {/* Form */}
      <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-5 sm:p-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-mist-400">
          Where are the goods coming from?
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setOrigin("eu")}
            aria-pressed={isEu}
            className={`rounded-lg border px-4 py-3.5 text-sm font-semibold transition-colors ${
              isEu
                ? "border-ocean-400 bg-ocean-500/15 text-white"
                : "border-white/10 text-mist-300 hover:bg-white/5"
            }`}
          >
            Within the EU
          </button>
          <button
            type="button"
            onClick={() => setOrigin("non-eu")}
            aria-pressed={!isEu}
            className={`rounded-lg border px-4 py-3.5 text-sm font-semibold transition-colors ${
              !isEu
                ? "border-ocean-400 bg-ocean-500/15 text-white"
                : "border-white/10 text-mist-300 hover:bg-white/5"
            }`}
          >
            Outside the EU
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="lc-product" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-mist-400">
              Product value
            </label>
            <div className="flex items-center rounded-lg border border-white/10 bg-navy-950 px-3">
              <span className="text-mist-500">€</span>
              <input
                id="lc-product"
                type="number"
                inputMode="decimal"
                min={0}
                value={productValue}
                onChange={(e) => setProductValue(e.target.value)}
                placeholder="4000"
                className="w-full bg-transparent px-2 py-2.5 text-white placeholder:text-mist-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label htmlFor="lc-freight" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-mist-400">
              Freight cost
            </label>
            <div className="flex items-center rounded-lg border border-white/10 bg-navy-950 px-3">
              <span className="text-mist-500">€</span>
              <input
                id="lc-freight"
                type="number"
                inputMode="decimal"
                min={0}
                value={freight}
                onChange={(e) => setFreight(e.target.value)}
                placeholder="500"
                className="w-full bg-transparent px-2 py-2.5 text-white placeholder:text-mist-500 focus:outline-none"
              />
            </div>
            <p className="mt-1 text-[11px] text-mist-500">One total — no need to split it out</p>
          </div>
        </div>

        {!isEu && (
          <div className="mt-4">
            <label htmlFor="lc-category" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-mist-400">
              Product category
            </label>
            <select
              id="lc-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2.5 text-white focus:border-ocean-400 focus:outline-none"
            >
              {Object.entries(CATEGORY_DUTY).map(([key, c]) => (
                <option key={key} value={key}>
                  {c.label} ({key === "unknown" ? "avg." : `${c.low}–${c.high}%`} duty)
                </option>
              ))}
            </select>
          </div>
        )}

        {!isEu && (
          <label className="mt-4 flex items-start gap-2.5 text-sm text-mist-300">
            <input
              type="checkbox"
              checked={vatReclaimable}
              onChange={(e) => setVatReclaimable(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-white/20 bg-navy-950 accent-ocean-500"
            />
            My business can reclaim import VAT (show cost price, not cash-out)
          </label>
        )}
      </div>

      {/* Result */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        {hasInput ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide text-mist-400">Estimated landed cost</p>
            <p className="mt-1 font-mono text-3xl font-bold text-white sm:text-4xl">
              {isRange ? `€${fmt(landedLow)} – €${fmt(landedHigh)}` : `€${fmt(landedLow)}`}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-mist-400">
              {isEu
                ? "Intra-EU trade: no customs declaration, import duty or import VAT applies here."
                : "Estimate based on an average duty rate for this category, not your product's exact HS code — not customs, tax or legal advice."}
            </p>

            <dl className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
              <Row label="Product value" value={`€${fmt(pv)}`} />
              <Row label="Freight" value={`€${fmt(fr)}`} />
              <Row label="Customs value" value={`€${fmt(customsValue)}`} />
              <Row
                label={`Import duty${isEu ? "" : ` (${dutyLowPct}–${dutyHighPct}%)`}`}
                value={isEu ? "€0" : dutyLow === dutyHigh ? `€${fmt(dutyLow)}` : `€${fmt(dutyLow)} – €${fmt(dutyHigh)}`}
              />
              <Row
                label={vatReclaimable ? "Import VAT (reclaimable, excluded)" : `Import VAT (~${Math.round(vatRate * 100)}%)`}
                value={
                  isEu
                    ? "€0"
                    : vatReclaimable
                      ? "€0"
                      : vatLow === vatHigh
                        ? `€${fmt(vatLow)}`
                        : `€${fmt(vatLow)} – €${fmt(vatHigh)}`
                }
              />
            </dl>

            <Link
              href="/tools/quote-comparison"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-ocean-400 to-ocean-600 px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01]"
            >
              Got real quotes? Compare them for the exact cost
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </>
        ) : (
          <p className="text-sm text-mist-400">Enter a product value to see your estimate.</p>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-mist-400">{label}</dt>
      <dd className="font-mono text-white">{value}</dd>
    </div>
  );
}
