"use client";

import Link from "next/link";
import { Award, RotateCcw, Sparkles, Target, XCircle } from "lucide-react";
import type { QuizResultEntry } from "@/dg/types";
import { getDgClass } from "@/dg/data/classes";
import HazardLabel from "@/dg/components/HazardLabel";

const PASS_THRESHOLD = 70;

interface ResultScreenProps {
  score: number;
  total: number;
  entries: QuizResultEntry[];
  xpEarned: number;
  perfect: boolean;
  onRetry?: () => void;
}

export default function ResultScreen({ score, total, entries, xpEarned, perfect, onRetry }: ResultScreenProps) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed = pct >= PASS_THRESHOLD;
  const incorrect = entries.filter((e) => !e.correct);

  const classesToStudy = Array.from(
    new Set(incorrect.map((e) => e.question.classId).filter((c): c is NonNullable<typeof c> => Boolean(c)))
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-navy-800/70 p-6 text-center shadow-premium sm:p-10">
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
            passed ? "bg-hazard-green/15 text-hazard-green" : "bg-hazard-red/15 text-hazard-red"
          }`}
        >
          {passed ? <Award size={30} /> : <Target size={30} />}
        </div>
        <div className="mt-4 text-3xl font-extrabold text-white">
          {score} / {total}
        </div>
        <div className="mt-1 text-lg font-semibold text-mist-200">{pct}% correct</div>
        <div
          className={`mt-3 inline-block rounded-full px-4 py-1 text-sm font-bold uppercase tracking-wide ${
            passed ? "bg-hazard-green/15 text-hazard-green" : "bg-hazard-red/15 text-hazard-red"
          }`}
        >
          {passed ? "Pass" : "Needs Review"}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm">
          <span className="flex items-center gap-1.5 rounded-full bg-hazard-amber/15 px-3 py-1 font-semibold text-hazard-amber">
            <Sparkles size={14} /> +{xpEarned} XP
          </span>
          {perfect && (
            <span className="flex items-center gap-1.5 rounded-full bg-hazard-orange/15 px-3 py-1 font-semibold text-hazard-orange">
              Perfect quiz bonus!
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              <RotateCcw size={15} /> Retry
            </button>
          )}
          <Link
            href="/dg-training/quiz"
            className="rounded-full bg-hazard-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-hazard-reddeep"
          >
            Back to Quiz Hub
          </Link>
          <Link
            href="/dg-training"
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-mist-200 transition-colors hover:bg-white/10"
          >
            Dashboard
          </Link>
        </div>
      </div>

      {classesToStudy.length > 0 && (
        <div className="rounded-2xl border border-hazard-amber/30 bg-hazard-amber/5 p-5">
          <div className="mb-3 text-sm font-semibold text-hazard-amber">You should study more:</div>
          <div className="flex flex-wrap gap-2">
            {classesToStudy.map((id) => {
              const c = getDgClass(id);
              return (
                <Link
                  key={id}
                  href={`/dg-training/classes/${id}`}
                  className="flex items-center gap-2 rounded-full bg-navy-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-navy-700"
                >
                  Class {c.id} – {c.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {incorrect.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-mist-400">
            Review incorrect questions ({incorrect.length})
          </h3>
          <div className="space-y-3">
            {incorrect.map((e, i) => (
              <div key={i} className="rounded-2xl border border-hazard-red/25 bg-navy-800/70 p-5">
                <div className="flex items-start gap-3">
                  <XCircle size={18} className="mt-0.5 shrink-0 text-hazard-red" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">{e.question.prompt}</p>
                    <p className="mt-1 text-xs text-mist-400">
                      Your answer: <span className="text-hazard-red">{e.question.options[e.selectedIndex]}</span>
                    </p>
                    <p className="text-xs text-hazard-green">
                      Correct answer: {e.question.options[e.question.correctIndex]}
                    </p>
                    <p className="mt-2 text-sm text-mist-300">{e.question.explanation}</p>
                  </div>
                  {e.question.showLabelFor && (
                    <div className="hidden shrink-0 sm:block">
                      <HazardLabel classId={e.question.showLabelFor} size={64} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
