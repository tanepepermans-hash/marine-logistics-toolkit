"use client";

import Link from "next/link";
import {
  Award,
  BookOpen,
  Boxes,
  Flame,
  ListChecks,
  Map,
  Percent,
  RotateCcw,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { useDg } from "@/dg/lib/DgStateProvider";
import { DG_CLASSES } from "@/dg/data/classes";
import { getOverallAccuracy, hasDoneDailyChallengeToday, isClassMastered } from "@/dg/lib/quizEngine";
import { getLevelProgress } from "@/dg/lib/xp";
import StatTile from "@/dg/components/StatTile";
import XPIndicator from "@/dg/components/XPIndicator";
import ProgressBar from "@/dg/components/ProgressBar";
import HazardLabel from "@/dg/components/HazardLabel";

export default function DashboardPage() {
  const { state, loaded } = useDg();
  const { level } = getLevelProgress(state.xp);
  const accuracy = getOverallAccuracy(state);

  const mastered = DG_CLASSES.filter((c) => isClassMastered(state, c.id));
  const toLearn = DG_CLASSES.filter((c) => !isClassMastered(state, c.id));
  const courseProgressPct = Math.round((mastered.length / DG_CLASSES.length) * 100);

  const dailyDone = hasDoneDailyChallengeToday(state);

  if (!loaded) {
    return <div className="py-20 text-center text-mist-400">Loading your progress…</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Welcome back, Operator</h1>
        <p className="text-sm text-mist-400">
          Level {level.level} · {level.title} — keep training to recognize every hazard label on sight.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatTile icon={Award} label="Current Level" value={`${level.level} · ${level.title}`} accent="text-hazard-orange" />
        <StatTile icon={Zap} label="XP Points" value={state.xp.toLocaleString()} accent="text-hazard-amber" />
        <StatTile icon={Flame} label="Daily Streak" value={`${state.streak} day${state.streak === 1 ? "" : "s"}`} accent="text-hazard-red" />
        <StatTile icon={ListChecks} label="Questions Answered" value={state.questionsAnswered} accent="text-ocean-400" />
        <StatTile icon={Percent} label="Correct Answers" value={`${accuracy}%`} accent="text-hazard-green" />
        <StatTile icon={Boxes} label="Classes Mastered" value={`${mastered.length} / ${DG_CLASSES.length}`} accent="text-hazard-green" />
        <StatTile icon={BookOpen} label="Classes To Learn" value={toLearn.length} accent="text-hazard-blue" />
        <StatTile icon={Target} label="Daily Challenge" value={dailyDone ? "Done today" : "Available"} accent="text-hazard-orange" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-white/10 bg-navy-800/70 p-5">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Course Progress</h2>
              <span className="text-sm text-mist-400">{courseProgressPct}%</span>
            </div>
            <ProgressBar value={courseProgressPct} label={`Course progress, ${courseProgressPct}% complete`} height={10} />
            <p className="mt-2 text-xs text-mist-400">
              {mastered.length} of {DG_CLASSES.length} classes &amp; divisions mastered (80%+ accuracy over 3+ questions).
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            <Link
              href="/dg-training/course"
              className="flex items-center justify-between rounded-2xl bg-hazard-orange px-5 py-4 font-semibold text-navy-950 shadow-premium transition-transform hover:-translate-y-0.5"
            >
              Course Path <Map size={18} />
            </Link>
            <Link
              href="/dg-training/learn"
              className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-4 font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-white/15"
            >
              Continue Learning <BookOpen size={18} />
            </Link>
            <Link
              href="/dg-training/quiz/play?mode=mixed&count=10"
              className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-4 font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-white/15"
            >
              Quick Quiz <Sparkles size={18} />
            </Link>
            <Link
              href="/dg-training/classes"
              className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-4 font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-white/15"
            >
              DG Classes <Boxes size={18} />
            </Link>
            <Link
              href="/dg-training/quiz/play?mode=mistakes&count=10"
              className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-4 font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-white/15"
            >
              Practice Mistakes <RotateCcw size={18} />
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <XPIndicator xp={state.xp} />

          <div className="rounded-2xl border border-white/10 bg-navy-800/70 p-5">
            <h2 className="mb-3 text-sm font-semibold text-white">Fast recognition preview</h2>
            <div className="flex flex-col items-center gap-3">
              <HazardLabel classId="8" size={100} />
              <p className="text-center text-xs text-mist-400">
                The strongest way to learn DG: see the label, name the class, get the explanation, repeat.
              </p>
              <Link
                href="/dg-training/quiz/play?mode=visual&count=15"
                className="rounded-full bg-hazard-orange/15 px-4 py-2 text-xs font-semibold text-hazard-orange hover:bg-hazard-orange/25"
              >
                Start Visual Recognition
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
