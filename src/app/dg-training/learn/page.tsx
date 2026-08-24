"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, GraduationCap } from "lucide-react";
import { DG_CLASS_GROUPS } from "@/dg/data/classes";
import HazardLabel from "@/dg/components/HazardLabel";
import { useDg } from "@/dg/lib/DgStateProvider";
import { getClassAccuracy, isClassMastered } from "@/dg/lib/quizEngine";

export default function LearnPage() {
  const { state } = useDg();
  const [openGroup, setOpenGroup] = useState<string | null>("1");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-hazard-orange/15 text-hazard-orange">
          <GraduationCap size={22} />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Learning Mode</h1>
          <p className="text-sm text-mist-400">Study each class before you quiz yourself. Work through them in order, or jump to what you need.</p>
        </div>
      </div>

      <div className="space-y-3">
        {DG_CLASS_GROUPS.map((group) => {
          const open = openGroup === group.classNumber;
          return (
            <div key={group.classNumber} className="overflow-hidden rounded-2xl border border-white/10 bg-navy-800/70">
              <button
                onClick={() => setOpenGroup(open ? null : group.classNumber)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-hazard-orange">
                    Class {group.classNumber}
                  </div>
                  <div className="text-base font-semibold text-white">{group.title}</div>
                </div>
                <ChevronDown size={18} className={`shrink-0 text-mist-400 transition-transform ${open ? "rotate-180" : ""}`} />
              </button>

              {open && (
                <div className="border-t border-white/10 px-5 py-5">
                  <p className="mb-5 text-sm text-mist-300">{group.intro}</p>
                  <div className="space-y-6">
                    {group.items.map((item) => {
                      const acc = getClassAccuracy(state, item.id);
                      const mastered = isClassMastered(state, item.id);
                      return (
                        <div key={item.id} className="grid gap-5 rounded-xl border border-white/5 bg-navy-900/40 p-5 sm:grid-cols-[auto_1fr]">
                          <div className="flex justify-center sm:justify-start">
                            <HazardLabel classId={item.id} size={110} />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-bold uppercase tracking-wide text-hazard-orange">
                                Class {item.id}
                              </span>
                              {mastered && (
                                <span className="rounded-full bg-hazard-green/15 px-2 py-0.5 text-[10px] font-semibold text-hazard-green">
                                  Mastered
                                </span>
                              )}
                              {acc.total > 0 && (
                                <span className="text-[11px] text-mist-400">{acc.pct}% accuracy ({acc.total} answered)</span>
                              )}
                            </div>
                            <h3 className="mt-1 text-lg font-bold uppercase tracking-tight text-white">{item.name}</h3>
                            <p className="mt-2 text-sm text-mist-300">{item.meaning}</p>

                            <div className="mt-3">
                              <div className="text-xs font-semibold uppercase text-mist-400">Examples</div>
                              <ul className="mt-1 flex flex-wrap gap-1.5">
                                {item.examples.map((ex) => (
                                  <li key={ex} className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-mist-200">
                                    {ex}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="mt-3">
                              <div className="text-xs font-semibold uppercase text-mist-400">Main Hazard</div>
                              <p className="mt-1 text-sm text-mist-300">{item.mainHazard}</p>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              <Link
                                href={`/dg-training/classes/${item.id}`}
                                className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-mist-200 hover:bg-white/10"
                              >
                                View Full Flashcard
                              </Link>
                              <Link
                                href={`/dg-training/quiz/play?mode=mixed&classId=${item.id}&count=8`}
                                className="rounded-full bg-hazard-orange px-4 py-2 text-xs font-semibold text-white hover:bg-hazard-reddeep"
                              >
                                Test Me
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
