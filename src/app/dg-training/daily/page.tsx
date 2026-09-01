"use client";

import Link from "next/link";
import { CalendarCheck, Flame, Sparkles } from "lucide-react";
import { useDg } from "@/dg/lib/DgStateProvider";
import { hasDoneDailyChallengeToday } from "@/dg/lib/quizEngine";
import PremiumGate from "@/dg/components/PremiumGate";

export default function DailyChallengePage() {
  const { state, loaded } = useDg();

  if (!loaded) {
    return <div className="py-20 text-center text-mist-400">Loading…</div>;
  }

  const doneToday = hasDoneDailyChallengeToday(state);

  return (
    <PremiumGate title="Daily Challenge">
    <div className="mx-auto max-w-xl">
      <div className="rounded-3xl border border-white/10 bg-navy-800/70 p-8 text-center shadow-premium">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-hazard-orange/15 text-hazard-orange">
          <CalendarCheck size={30} />
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-white">Daily DG Challenge</h1>
        <p className="mt-2 text-sm text-mist-400">5 quick questions a day. Complete it to keep your streak alive.</p>

        <div className="mt-6 flex items-center justify-center gap-2 text-lg font-bold text-hazard-orange">
          <Flame size={22} /> {state.streak} Day Streak
        </div>

        {doneToday ? (
          <div className="mt-6 space-y-3">
            <div className="rounded-2xl bg-hazard-green/10 p-4 text-hazard-green">
              You already completed today&apos;s challenge — {state.dailyChallenge.lastScore} / {state.dailyChallenge.lastTotal} correct. Come back tomorrow!
            </div>
            <Link
              href="/dg-training"
              className="inline-block rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-mist-200 hover:bg-white/10"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <Link
            href="/dg-training/quiz/play?mode=daily&count=5"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-hazard-orange px-8 py-3.5 text-sm font-semibold text-navy-950 shadow-premium hover:bg-hazard-reddeep"
          >
            <Sparkles size={16} /> Start Today&apos;s Challenge
          </Link>
        )}
      </div>
    </div>
    </PremiumGate>
  );
}
