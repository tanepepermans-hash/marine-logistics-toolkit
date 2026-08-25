"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ShieldQuestion } from "lucide-react";
import { REFERENCE_ENTRIES, searchReference } from "@/dg/data/reference";
import HazardLabel from "@/dg/components/HazardLabel";

export default function ReferencePage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return REFERENCE_ENTRIES.slice(0, 12);
    return searchReference(query);
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-hazard-orange/15 text-hazard-orange">
          <ShieldQuestion size={22} />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-white">DG Reference</h1>
          <p className="text-sm text-mist-400">Search classes, UN numbers and key topics for a quick summary.</p>
        </div>
      </div>

      <div className="relative">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mist-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try “UN3481”, “Lithium batteries”, “Class 3”, “Corrosive”…"
          className="w-full rounded-2xl border border-white/10 bg-navy-800/70 py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-mist-500 focus:border-hazard-orange focus:outline-none"
        />
      </div>

      <div className="space-y-3">
        {results.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-navy-800/70 p-8 text-center text-mist-400">
            No results for &quot;{query}&quot;. Try a class number, UN number, or a keyword like &quot;corrosive&quot;.
          </div>
        ) : (
          results.map((entry) => (
            <div key={entry.id} className="flex gap-4 rounded-2xl border border-white/10 bg-navy-800/70 p-5">
              {entry.classId && (
                <div className="hidden shrink-0 sm:block">
                  <HazardLabel classId={entry.classId} size={64} />
                </div>
              )}
              <div className="min-w-0">
                <h2 className="font-semibold text-white">{entry.title}</h2>
                <p className="mt-1 text-sm text-mist-300">{entry.summary}</p>
                {entry.classId && (
                  <Link
                    href={`/dg-training/classes/${entry.classId}`}
                    className="mt-2 inline-block text-xs font-semibold text-hazard-orange hover:underline"
                  >
                    View full class details →
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-5 text-xs leading-relaxed text-mist-400">
        This reference is a training and learning tool. It is <span className="font-semibold text-mist-300">not a substitute</span> for
        the current official IATA Dangerous Goods Regulations (DGR), ADR, IMDG Code, or your company&apos;s Dangerous Goods
        procedures. Always confirm real shipments against the current regulations and your organization&apos;s DG policy.
      </div>
    </div>
  );
}
