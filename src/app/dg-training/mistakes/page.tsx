"use client";

import Link from "next/link";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { useDg } from "@/dg/lib/DgStateProvider";
import { QUESTIONS_BY_ID } from "@/dg/data/questions";
import MistakeReview from "@/dg/components/MistakeReview";

export default function MistakesPage() {
  const { state, loaded } = useDg();

  if (!loaded) {
    return <div className="py-20 text-center text-mist-400">Loading…</div>;
  }

  const mistakes = Object.values(state.mistakes).sort((a, b) => b.wrongCount - a.wrongCount || b.lastSeenAt - a.lastSeenAt);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-hazard-red/15 text-hazard-red">
            <RotateCcw size={22} />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Mistakes</h1>
            <p className="text-sm text-mist-400">
              Questions you&apos;ve gotten wrong, saved for spaced-repetition practice. Repeat misses show up more often.
            </p>
          </div>
        </div>
        {mistakes.length > 0 && (
          <Link
            href="/dg-training/quiz/play?mode=mistakes&count=10"
            className="rounded-full bg-hazard-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-hazard-reddeep"
          >
            Practice My Mistakes
          </Link>
        )}
      </div>

      {mistakes.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-navy-800/70 p-10 text-center">
          <CheckCircle2 size={32} className="mx-auto text-hazard-green" />
          <p className="mt-3 text-mist-200">No mistakes saved right now. Keep quizzing — anything you miss will land here.</p>
          <Link href="/dg-training/quiz" className="mt-4 inline-block rounded-full bg-hazard-orange px-5 py-2.5 text-sm font-semibold text-white">
            Go to Quiz Hub
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {mistakes.map((m) => {
            const question = QUESTIONS_BY_ID[m.questionId];
            if (!question) return null;
            return <MistakeReview key={m.questionId} question={question} mistake={m} />;
          })}
        </div>
      )}
    </div>
  );
}
