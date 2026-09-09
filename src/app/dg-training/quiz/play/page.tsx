"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { DgClassId, Question, QuizMode, QuizResultEntry } from "@/dg/types";
import { ALL_CLASS_IDS } from "@/dg/data/classes";
import { useDg } from "@/dg/lib/DgStateProvider";
import { buildQuiz } from "@/dg/lib/quizEngine";
import QuizCard from "@/dg/components/QuizCard";
import ResultScreen from "@/dg/components/ResultScreen";
import PremiumGate from "@/dg/components/PremiumGate";

const MODE_TITLES: Record<QuizMode, string> = {
  symbol: "Identify the Symbol",
  class: "Identify the Class",
  cargo: "Match the Cargo",
  unnumber: "Match the UN Number",
  "packing-group": "Packing Group Quiz",
  iata: "Regulations & Documentation",
  scenario: "Scenario Practice",
  visual: "Visual Recognition",
  mixed: "Mixed Exam",
  daily: "Daily DG Challenge",
  mistakes: "Practice Mistakes",
};

const VALID_MODES: QuizMode[] = [
  "symbol",
  "class",
  "cargo",
  "unnumber",
  "packing-group",
  "iata",
  "scenario",
  "visual",
  "mixed",
  "daily",
  "mistakes",
];

function QuizPlayInner() {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode") as QuizMode | null;
  const mode: QuizMode = modeParam && VALID_MODES.includes(modeParam) ? modeParam : "mixed";
  const countParam = parseInt(searchParams.get("count") ?? "10", 10);
  const count = Number.isFinite(countParam) && countParam > 0 ? countParam : 10;
  const classIdParam = searchParams.get("classId");
  const classId: DgClassId | undefined =
    classIdParam && ALL_CLASS_IDS.includes(classIdParam as DgClassId) ? (classIdParam as DgClassId) : undefined;
  const classIdsParam = searchParams.get("classIds");
  const classIds: DgClassId[] | undefined = classIdsParam
    ? classIdsParam
        .split(",")
        .map((id) => id.trim())
        .filter((id): id is DgClassId => ALL_CLASS_IDS.includes(id as DgClassId))
    : undefined;

  const { state, loaded, answerQuestion, completeQuiz, completeDaily } = useDg();

  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [index, setIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [entries, setEntries] = useState<QuizResultEntry[]>([]);
  const [sessionXp, setSessionXp] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<{ xp: number; streakBonus: boolean; classMastered: boolean } | null>(null);
  const [finished, setFinished] = useState(false);
  const [finalXp, setFinalXp] = useState(0);
  const [perfect, setPerfect] = useState(false);
  const built = useRef(false);

  useEffect(() => {
    if (!loaded || built.current) return;
    built.current = true;
    setQuestions(buildQuiz({ mode, count, classId, classIds, state }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  function regenerate() {
    setQuestions(buildQuiz({ mode, count, classId, classIds, state }));
    setIndex(0);
    setSelectedIndex(null);
    setRevealed(false);
    setEntries([]);
    setSessionXp(0);
    setLastFeedback(null);
    setFinished(false);
    setFinalXp(0);
    setPerfect(false);
  }

  function handleSelect(i: number) {
    if (revealed || !questions) return;
    const question = questions[index];
    const feedback = answerQuestion(question, i);
    setSelectedIndex(i);
    setRevealed(true);
    setLastFeedback({ xp: feedback.xpGained, streakBonus: feedback.streakBonus, classMastered: feedback.classMastered });
    setSessionXp((x) => x + feedback.xpGained);
    setEntries((prev) => [...prev, { question, selectedIndex: i, correct: feedback.correct }]);
  }

  function handleContinue() {
    if (!questions) return;
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      setSelectedIndex(null);
      setRevealed(false);
      setLastFeedback(null);
      return;
    }

    const score = entries.filter((e) => e.correct).length;
    const total = entries.length;
    const classIds = Array.from(new Set(entries.map((e) => e.question.classId).filter((c): c is DgClassId => Boolean(c))));

    const { bonus, perfect: isPerfect } = completeQuiz(mode, score, total, classIds);
    if (mode === "daily") completeDaily(score, total);

    setFinalXp(sessionXp + bonus);
    setPerfect(isPerfect);
    setFinished(true);
  }

  if (!loaded || questions === null) {
    return <div className="py-20 text-center text-mist-400">Loading quiz…</div>;
  }

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-navy-800/70 p-8 text-center">
        <p className="text-mist-200">
          {mode === "mistakes"
            ? "No mistakes saved yet — great job! Take a quiz and anything you miss will show up here for practice."
            : "No questions available for this selection."}
        </p>
        <Link href="/dg-training/quiz" className="mt-4 inline-block rounded-full bg-hazard-orange px-5 py-2.5 text-sm font-semibold text-white">
          Back to Quiz Hub
        </Link>
      </div>
    );
  }

  if (finished) {
    const score = entries.filter((e) => e.correct).length;
    return (
      <div className="mx-auto max-w-2xl">
        <ResultScreen score={score} total={entries.length} entries={entries} xpEarned={finalXp} perfect={perfect} onRetry={regenerate} />
      </div>
    );
  }

  const question = questions[index];

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/dg-training/quiz" className="flex items-center gap-1.5 text-sm text-mist-400 hover:text-white">
          <ArrowLeft size={15} /> Exit
        </Link>
        <span className="text-sm font-semibold text-white">{MODE_TITLES[mode]}</span>
      </div>

      <QuizCard
        question={question}
        questionNumber={index + 1}
        totalQuestions={questions.length}
        selectedIndex={selectedIndex}
        revealed={revealed}
        onSelect={handleSelect}
      />

      {revealed && (
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {lastFeedback && lastFeedback.xp > 0 && (
              <span className="flex items-center gap-1.5 rounded-full bg-hazard-amber/15 px-3 py-1 font-semibold text-hazard-amber">
                <Sparkles size={13} /> +{lastFeedback.xp} XP
              </span>
            )}
            {lastFeedback?.streakBonus && (
              <span className="rounded-full bg-hazard-orange/15 px-3 py-1 font-semibold text-hazard-orange">
                🔥 5 in a row bonus!
              </span>
            )}
            {lastFeedback?.classMastered && (
              <span className="rounded-full bg-hazard-green/15 px-3 py-1 font-semibold text-hazard-green">
                Class mastered! +100 XP
              </span>
            )}
          </div>
          <button
            onClick={handleContinue}
            className="w-full rounded-full bg-hazard-orange px-6 py-3 text-sm font-semibold text-white hover:bg-hazard-reddeep sm:w-auto"
          >
            {index + 1 < questions.length ? "Continue" : "See Results"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function QuizPlayPage() {
  return (
    <PremiumGate title="Quiz practice">
      <Suspense fallback={<div className="py-20 text-center text-mist-400">Loading quiz…</div>}>
        <QuizPlayInner />
      </Suspense>
    </PremiumGate>
  );
}
