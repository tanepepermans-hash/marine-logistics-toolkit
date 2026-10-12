"use client";

import { useId, useState } from "react";
import { Plus, Trash2, Trophy } from "lucide-react";

type Quote = {
  id: string;
  carrier: string;
  mode: string;
  baseFreight: string;
  fuelSurcharge: string;
  destCharges: string;
  customsFee: string;
  insurance: string;
  quantity: string;
  productCost: string;
  dutyRate: string;
};

function emptyQuote(id: string): Quote {
  return {
    id,
    carrier: "",
    mode: "Sea",
    baseFreight: "",
    fuelSurcharge: "",
    destCharges: "",
    customsFee: "",
    insurance: "",
    quantity: "",
    productCost: "",
    dutyRate: "",
  };
}

const EXAMPLE: Quote = {
  id: "example",
  carrier: "Nordic Forwarding A/S",
  mode: "Sea",
  baseFreight: "1450",
  fuelSurcharge: "180",
  destCharges: "220",
  customsFee: "90",
  insurance: "60",
  quantity: "500",
  productCost: "3.20",
  dutyRate: "4.5",
};

const NUMBER_FIELDS: (keyof Quote)[] = [
  "baseFreight",
  "fuelSurcharge",
  "destCharges",
  "customsFee",
  "insurance",
  "quantity",
  "productCost",
  "dutyRate",
];

function num(v: string): number {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

function computeLandedCost(q: Quote) {
  const totalFreight =
    num(q.baseFreight) + num(q.fuelSurcharge) + num(q.destCharges) + num(q.customsFee) + num(q.insurance);
  const quantity = num(q.quantity);
  const freightPerUnit = quantity > 0 ? totalFreight / quantity : null;
  const dutyPerUnit = num(q.productCost) * (num(q.dutyRate) / 100);
  const landedPerUnit = freightPerUnit === null ? null : freightPerUnit + num(q.productCost) + dutyPerUnit;

  return { totalFreight, freightPerUnit, dutyPerUnit, landedPerUnit };
}

function formatCurrency(n: number | null) {
  if (n === null) return "—";
  return n.toLocaleString("en-EU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function QuoteComparisonTool() {
  const baseId = useId();
  const [quotes, setQuotes] = useState<Quote[]>([
    EXAMPLE,
    emptyQuote(`${baseId}-1`),
    emptyQuote(`${baseId}-2`),
  ]);

  function updateQuote(id: string, field: keyof Quote, value: string) {
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  }

  function addQuote() {
    setQuotes((prev) => [...prev, emptyQuote(`${baseId}-${prev.length}-${Date.now()}`)]);
  }

  function removeQuote(id: string) {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
  }

  const results = quotes.map((q) => ({ quote: q, ...computeLandedCost(q) }));

  const ranked = [...results]
    .filter((r) => r.landedPerUnit !== null)
    .sort((a, b) => (a.landedPerUnit as number) - (b.landedPerUnit as number));
  const rankOf = new Map<string, number>();
  ranked.forEach((r, i) => {
    if (i > 0 && r.landedPerUnit === ranked[i - 1].landedPerUnit) {
      rankOf.set(r.quote.id, rankOf.get(ranked[i - 1].quote.id) as number);
    } else {
      rankOf.set(r.quote.id, i + 1);
    }
  });
  const bestId = ranked[0]?.quote.id;

  return (
    <div>
      <p className="mb-2 text-xs text-mist-400">Scroll right to see duty, landed cost and rank →</p>
      <div className="relative">
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-900/60">
        <table className="w-full min-w-[1300px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-left text-xs uppercase tracking-wide text-mist-400">
              <th className="px-4 py-3 font-semibold">Carrier / forwarder</th>
              <th className="px-3 py-3 font-semibold">Mode</th>
              <th className="px-3 py-3 font-semibold">Base freight</th>
              <th className="px-3 py-3 font-semibold">Fuel / BAF</th>
              <th className="px-3 py-3 font-semibold">Dest. charges</th>
              <th className="px-3 py-3 font-semibold">Customs fee</th>
              <th className="px-3 py-3 font-semibold">Insurance</th>
              <th className="px-3 py-3 font-semibold">Qty (units)</th>
              <th className="px-3 py-3 font-semibold">Product €/unit</th>
              <th className="px-3 py-3 font-semibold">Duty %</th>
              <th className="px-3 py-3 text-right font-semibold text-white">Landed €/unit</th>
              <th className="px-3 py-3 text-center font-semibold">Rank</th>
              <th className="px-2 py-3" />
            </tr>
          </thead>
          <tbody>
            {results.map(({ quote, landedPerUnit }) => {
              const isBest = quote.id === bestId && ranked.length > 1;
              return (
                <tr
                  key={quote.id}
                  className={`border-b border-white/5 ${isBest ? "bg-ocean-500/10" : ""}`}
                >
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={quote.carrier}
                      onChange={(e) => updateQuote(quote.id, "carrier", e.target.value)}
                      placeholder="Forwarder name"
                      className="w-full min-w-[140px] rounded-md border border-white/10 bg-navy-950 px-2.5 py-1.5 text-white placeholder:text-mist-500 focus:border-ocean-400 focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={quote.mode}
                      onChange={(e) => updateQuote(quote.id, "mode", e.target.value)}
                      className="rounded-md border border-white/10 bg-navy-950 px-2 py-1.5 text-white focus:border-ocean-400 focus:outline-none"
                    >
                      <option>Sea</option>
                      <option>Air</option>
                      <option>Road</option>
                      <option>Rail</option>
                    </select>
                  </td>
                  {NUMBER_FIELDS.filter((f) => f !== "quantity" && f !== "productCost" && f !== "dutyRate").map(
                    (field) => (
                      <td key={field} className="px-3 py-2">
                        <input
                          type="number"
                          inputMode="decimal"
                          value={quote[field]}
                          onChange={(e) => updateQuote(quote.id, field, e.target.value)}
                          placeholder="0"
                          className="w-24 rounded-md border border-white/10 bg-navy-950 px-2.5 py-1.5 text-right text-white placeholder:text-mist-500 focus:border-ocean-400 focus:outline-none"
                        />
                      </td>
                    ),
                  )}
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      inputMode="decimal"
                      value={quote.quantity}
                      onChange={(e) => updateQuote(quote.id, "quantity", e.target.value)}
                      placeholder="0"
                      className="w-24 rounded-md border border-white/10 bg-navy-950 px-2.5 py-1.5 text-right text-white placeholder:text-mist-500 focus:border-ocean-400 focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      inputMode="decimal"
                      value={quote.productCost}
                      onChange={(e) => updateQuote(quote.id, "productCost", e.target.value)}
                      placeholder="0.00"
                      className="w-24 rounded-md border border-white/10 bg-navy-950 px-2.5 py-1.5 text-right text-white placeholder:text-mist-500 focus:border-ocean-400 focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      inputMode="decimal"
                      value={quote.dutyRate}
                      onChange={(e) => updateQuote(quote.id, "dutyRate", e.target.value)}
                      placeholder="0.0"
                      className="w-20 rounded-md border border-white/10 bg-navy-950 px-2.5 py-1.5 text-right text-white placeholder:text-mist-500 focus:border-ocean-400 focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-semibold text-white">
                    {formatCurrency(landedPerUnit)}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {rankOf.has(quote.id) ? (
                      isBest ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-ocean-500/20 px-2 py-1 text-xs font-semibold text-ocean-300">
                          <Trophy className="h-3 w-3" aria-hidden />
                          {rankOf.get(quote.id)}
                        </span>
                      ) : (
                        <span className="text-mist-400">{rankOf.get(quote.id)}</span>
                      )
                    ) : (
                      <span className="text-mist-500">—</span>
                    )}
                  </td>
                  <td className="px-2 py-2">
                    <button
                      type="button"
                      onClick={() => removeQuote(quote.id)}
                      aria-label="Remove quote"
                      className="rounded-md p-1.5 text-mist-500 hover:bg-white/5 hover:text-hazard-red"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-10 rounded-r-2xl bg-gradient-to-l from-navy-900 to-transparent"
        />
      </div>

      <button
        type="button"
        onClick={addQuote}
        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-mist-200 transition-colors hover:bg-white/5 hover:text-white"
      >
        <Plus className="h-4 w-4" aria-hidden />
        Add another quote
      </button>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-relaxed text-mist-300">
        <p className="font-semibold text-white">How landed cost per unit is calculated</p>
        <p className="mt-2">
          Freight cost/unit = (base freight + fuel/BAF surcharge + destination charges + customs
          clearance fee + insurance) ÷ quantity. Landed cost/unit = freight cost/unit + product
          cost/unit + duty/unit (product cost × duty rate). Ranked by landed cost per unit, not
          the headline freight rate — that&apos;s what actually determines the cheapest quote.
        </p>
        <p className="mt-2">
          VAT is usually reclaimable for a VAT-registered business, so it&apos;s intentionally
          excluded — add it back in if yours can&apos;t reclaim it. Shipping from another EU
          country? Set duty rate to 0% — intra-EU trade isn&apos;t subject to import duty or
          customs clearance.
        </p>
      </div>
    </div>
  );
}
