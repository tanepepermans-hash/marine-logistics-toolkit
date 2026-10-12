"use client";

import { TrendingUp } from "lucide-react";
import { useDg } from "@/dg/lib/DgStateProvider";
import { DG_CLASS_GROUPS } from "@/dg/data/classes";
import { getOverallAccuracy } from "@/dg/lib/quizEngine";
import ProgressBar from "@/dg/components/ProgressBar";
import XPIndicator from "@/dg/components/XPIndicator";
import PremiumGate from "@/dg/components/PremiumGate";

function barColor(pct: number) {
  if (pct >= 80) return "bg-hazard-green";
  if (pct >= 50) return "bg-hazard-amber";
  return "bg-hazard-red";
}

export default function ProgressPage() {
  const { state, loaded } = useDg();

  if (!loaded) {
    return <div className="py-20 text-center text-mist-400">Loading…</div>;
  }

  const overall = getOverallAccuracy(state);

  const groupStats = DG_CLASS_GROUPS.map((group) => {
    let correct = 0;
    let total = 0;
    for (const item of group.items) {
      const stat = state.classStats[item.id];
      if (stat) {
        correct += stat.correct;
        total += stat.total;
      }
    }
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { ...group, correct, total, pct };
  });

  const attempted = groupStats.filter((g) => g.total > 0);
  const weakest = attempted.length > 0 ? [...attempted].sort((a, b) => a.pct - b.pct)[0] : null;

  return (
    <PremiumGate title="Progress tracking">
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-hazard-orange/15 text-hazard-orange">
          <TrendingUp size={22} />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Your Progress</h1>
          <p className="text-sm text-mist-400">Track accuracy by class and see what to review next.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-navy-800/70 p-6 text-center">
          <div className="text-xs font-semibold uppercase tracking-wide text-mist-400">Overall Accuracy</div>
          <div className="mt-2 text-5xl font-extrabold text-white">{overall}%</div>
          <div className="mt-1 text-xs text-mist-400">{state.correctAnswered} / {state.questionsAnswered} questions correct</div>
        </div>
        <div className="lg:col-span-2">
          <XPIndicator xp={state.xp} />
        </div>
      </div>

      {weakest && weakest.pct < 80 && (
        <div className="rounded-2xl border border-hazard-amber/30 bg-hazard-amber/5 p-5 text-sm text-hazard-amber">
          You should practice <span className="font-semibold">Class {weakest.classNumber} — {weakest.title}</span> ({weakest.pct}% accuracy).
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-navy-800/70 p-6">
        <h2 className="mb-4 text-sm font-semibold text-white">Accuracy by DG Class</h2>
        <div className="space-y-4">
          {groupStats.map((g) => (
            <div key={g.classNumber}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-white">Class {g.classNumber} — {g.title}</span>
                <span className="text-mist-400">{g.total > 0 ? `${g.pct}%` : "Not attempted"}</span>
              </div>
              <ProgressBar
                value={g.pct}
                label={`Class ${g.classNumber} — ${g.title} accuracy, ${g.total > 0 ? `${g.pct}%` : "not attempted"}`}
                colorClass={g.total > 0 ? barColor(g.pct) : "bg-white/10"}
              />
            </div>
          ))}
        </div>
      </div>

      {state.quizHistory.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-navy-800/70 p-6">
          <h2 className="mb-4 text-sm font-semibold text-white">Recent Quiz History</h2>
          <div className="space-y-2">
            {state.quizHistory.slice(0, 8).map((h) => (
              <div key={h.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
                <span className="text-mist-300">{new Date(h.date).toLocaleDateString()} · {h.mode}</span>
                <span className="font-semibold text-white">
                  {h.score}/{h.total} ({Math.round((h.score / h.total) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </PremiumGate>
  );
}
