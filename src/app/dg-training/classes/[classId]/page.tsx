"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { ArrowLeft, ShieldAlert, TriangleAlert } from "lucide-react";
import { ALL_CLASS_IDS, getDgClass } from "@/dg/data/classes";
import type { DgClassId } from "@/dg/types";
import HazardLabel from "@/dg/components/HazardLabel";
import { useDg } from "@/dg/lib/DgStateProvider";
import { getClassAccuracy, isClassMastered } from "@/dg/lib/quizEngine";
import ProgressBar from "@/dg/components/ProgressBar";

export default function ClassDetailPage() {
  const params = useParams<{ classId: string }>();
  const classId = params.classId as DgClassId;

  if (!ALL_CLASS_IDS.includes(classId)) {
    notFound();
  }

  const dgClass = getDgClass(classId);
  const { state } = useDg();
  const acc = getClassAccuracy(state, classId);
  const mastered = isClassMastered(state, classId);

  return (
    <div className="space-y-6">
      <Link href="/dg-training/classes" className="flex items-center gap-1.5 text-sm text-mist-400 hover:text-white">
        <ArrowLeft size={15} /> Back to DG Classes
      </Link>

      <div className="grid gap-6 rounded-3xl border border-white/10 bg-navy-800/70 p-6 shadow-premium sm:p-8 lg:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center gap-3">
          <HazardLabel classId={dgClass.id} size={180} />
          {mastered && (
            <span className="rounded-full bg-hazard-green/15 px-3 py-1 text-xs font-semibold text-hazard-green">
              Mastered
            </span>
          )}
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-hazard-orange">
            Class {dgClass.id}
            {dgClass.division ? ` · Division ${dgClass.division}` : ""}
          </div>
          <h1 className="mt-1 text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl">{dgClass.name}</h1>
          <p className="mt-3 text-mist-200">{dgClass.meaning}</p>

          <div className="mt-4 flex items-start gap-2 rounded-xl border border-hazard-red/25 bg-hazard-red/5 p-3 text-sm text-mist-200">
            <TriangleAlert size={16} className="mt-0.5 shrink-0 text-hazard-red" />
            <span>
              <span className="font-semibold text-hazard-red">Main hazard: </span>
              {dgClass.mainHazard}
            </span>
          </div>

          {acc.total > 0 && (
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs text-mist-400">
                <span>Your accuracy on this class</span>
                <span>{acc.pct}% ({acc.correct}/{acc.total})</span>
              </div>
              <ProgressBar value={acc.pct} colorClass={mastered ? "bg-hazard-green" : "bg-hazard-orange"} />
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/dg-training/quiz/play?mode=mixed&classId=${dgClass.id}&count=8`}
              className="rounded-full bg-hazard-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-hazard-reddeep"
            >
              Test Me
            </Link>
            <Link
              href={`/dg-training/quiz/play?mode=symbol&classId=${dgClass.id}&count=6`}
              className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-mist-200 hover:bg-white/10"
            >
              Practice Symbol Recognition
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-navy-800/70 p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <ShieldAlert size={16} className="text-hazard-orange" /> Common Examples
          </h2>
          <ul className="space-y-2">
            {dgClass.examples.map((ex) => (
              <li key={ex} className="rounded-lg bg-white/5 px-3 py-2 text-sm text-mist-200">
                {ex}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/70 p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <TriangleAlert size={16} className="text-hazard-red" /> Typical Transport Risks
          </h2>
          <ul className="space-y-2">
            {dgClass.transportRisks.map((risk) => (
              <li key={risk} className="rounded-lg bg-white/5 px-3 py-2 text-sm text-mist-200">
                {risk}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/70 p-5">
        <h2 className="mb-2 text-sm font-semibold text-white">Packing Group</h2>
        {dgClass.packingGroups ? (
          <div className="flex flex-wrap gap-2">
            {dgClass.packingGroups.map((pg) => (
              <span key={pg} className="rounded-full bg-hazard-amber/15 px-3 py-1 text-xs font-semibold text-hazard-amber">
                Packing Group {pg}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-mist-300">Not assigned a Packing Group under the standard system.</p>
        )}
        {dgClass.notes && <p className="mt-3 text-sm text-mist-400">{dgClass.notes}</p>}
      </div>
    </div>
  );
}
