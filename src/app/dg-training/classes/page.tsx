"use client";

import { Boxes } from "lucide-react";
import { DG_CLASS_GROUPS } from "@/dg/data/classes";
import ClassCard from "@/dg/components/ClassCard";
import { useDg } from "@/dg/lib/DgStateProvider";
import { getClassAccuracy, isClassMastered } from "@/dg/lib/quizEngine";

export default function ClassesOverviewPage() {
  const { state } = useDg();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-hazard-orange/15 text-hazard-orange">
          <Boxes size={22} />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-white">DG Classes 1–9</h1>
          <p className="text-sm text-mist-400">Browse every class and division with its accurate hazard label, meaning and examples.</p>
        </div>
      </div>

      <div className="space-y-8">
        {DG_CLASS_GROUPS.map((group) => (
          <div key={group.classNumber}>
            <div className="mb-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-hazard-orange">Class {group.classNumber}</div>
              <h2 className="text-lg font-bold text-white">{group.title}</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {group.items.map((item) => (
                <ClassCard
                  key={item.id}
                  dgClass={item}
                  href={`/dg-training/classes/${item.id}`}
                  accuracyPct={getClassAccuracy(state, item.id).total > 0 ? getClassAccuracy(state, item.id).pct : undefined}
                  mastered={isClassMastered(state, item.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
