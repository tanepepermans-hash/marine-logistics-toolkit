import type { DgClassId, Question, QuizMode } from "@/dg/types";
import { QUESTIONS, QUESTIONS_BY_ID } from "@/dg/data/questions";
import type { CourseModule } from "@/dg/data/curriculum";
import { CERTIFICATE_MIN_QUESTIONS, CERTIFICATE_PASS_RATIO } from "@/dg/data/curriculum";
import {
  type DgState,
  type MistakeEntry,
  todayKey,
} from "@/dg/lib/storage";
import {
  XP_CLASS_COMPLETE,
  XP_CORRECT_ANSWER,
  XP_PERFECT_QUIZ,
  XP_STREAK_BONUS,
} from "@/dg/lib/xp";

export function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const MASTERY_MIN_ATTEMPTS = 3;
const MASTERY_MIN_ACCURACY = 0.8;

export function getClassAccuracy(state: DgState, classId: DgClassId) {
  const stat = state.classStats[classId];
  if (!stat || stat.total === 0) return { correct: 0, total: 0, pct: 0 };
  return { correct: stat.correct, total: stat.total, pct: Math.round((stat.correct / stat.total) * 100) };
}

export function isClassMastered(state: DgState, classId: DgClassId): boolean {
  const stat = state.classStats[classId];
  if (!stat || stat.total < MASTERY_MIN_ATTEMPTS) return false;
  return stat.correct / stat.total >= MASTERY_MIN_ACCURACY;
}

export function getOverallAccuracy(state: DgState): number {
  if (state.questionsAnswered === 0) return 0;
  return Math.round((state.correctAnswered / state.questionsAnswered) * 100);
}

function selectMistakeQuestions(state: DgState, count: number): Question[] {
  const entries = Object.values(state.mistakes) as MistakeEntry[];
  if (!entries.length) return [];
  const weighted = entries.map((e) => ({
    entry: e,
    weight: Math.max(0.2, e.wrongCount - e.correctStreak * 0.5),
  }));
  const pool = [...weighted];
  const picked: Question[] = [];
  while (picked.length < count && pool.length > 0) {
    const totalWeight = pool.reduce((sum, w) => sum + w.weight, 0);
    let r = Math.random() * totalWeight;
    let idx = pool.length - 1;
    for (let i = 0; i < pool.length; i++) {
      r -= pool[i].weight;
      if (r <= 0) {
        idx = i;
        break;
      }
    }
    const [chosen] = pool.splice(idx, 1);
    const q = QUESTIONS_BY_ID[chosen.entry.questionId];
    if (q) picked.push(q);
  }
  return picked;
}

export interface BuildQuizParams {
  mode: QuizMode;
  count: number;
  classId?: DgClassId;
  /** Filter to any of several classes at once — used by Course Path modules that span more than one class. */
  classIds?: DgClassId[];
  state: DgState;
}

export function buildQuiz({ mode, count, classId, classIds, state }: BuildQuizParams): Question[] {
  if (mode === "mistakes") {
    return selectMistakeQuestions(state, count);
  }

  let pool: Question[] = QUESTIONS;

  if (mode === "visual" || mode === "symbol") {
    pool = pool.filter((q) => q.category === "symbol");
  } else if (
    mode === "class" ||
    mode === "cargo" ||
    mode === "unnumber" ||
    mode === "packing-group" ||
    mode === "iata" ||
    mode === "scenario"
  ) {
    pool = pool.filter((q) => q.category === mode);
  }
  // "mixed" and "daily" use the full pool across all categories.

  if (classId) {
    pool = pool.filter((q) => q.classId === classId || q.showLabelFor === classId);
  } else if (classIds && classIds.length > 0) {
    const set = new Set(classIds);
    pool = pool.filter(
      (q) => (q.classId && set.has(q.classId)) || (q.showLabelFor && set.has(q.showLabelFor))
    );
  }

  return shuffle(pool).slice(0, count);
}

export interface AnswerOutcome {
  state: DgState;
  xpGained: number;
  streakBonus: boolean;
  classMastered: boolean;
}

export function applyAnswer(state: DgState, question: Question, correct: boolean): AnswerOutcome {
  const now = Date.now();
  let xpGained = 0;
  let streakBonus = false;
  let classMastered = false;

  const classStats = { ...state.classStats };
  if (question.classId) {
    const prev = classStats[question.classId] ?? { correct: 0, total: 0 };
    classStats[question.classId] = {
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    };
  }

  const mistakes = { ...state.mistakes };
  if (!correct) {
    const existing = mistakes[question.id];
    mistakes[question.id] = {
      questionId: question.id,
      classId: question.classId,
      wrongCount: (existing?.wrongCount ?? 0) + 1,
      correctStreak: 0,
      lastSeenAt: now,
    };
  } else if (mistakes[question.id]) {
    const existing = mistakes[question.id];
    const nextCorrectStreak = existing.correctStreak + 1;
    if (nextCorrectStreak >= 2) {
      delete mistakes[question.id];
    } else {
      mistakes[question.id] = { ...existing, correctStreak: nextCorrectStreak, lastSeenAt: now };
    }
  }

  let runningCorrectStreak = state.runningCorrectStreak;
  if (correct) {
    xpGained += XP_CORRECT_ANSWER;
    runningCorrectStreak += 1;
    if (runningCorrectStreak % 5 === 0) {
      xpGained += XP_STREAK_BONUS;
      streakBonus = true;
    }
  } else {
    runningCorrectStreak = 0;
  }

  const masteredBonusAwarded = [...state.masteredBonusAwarded];
  if (
    question.classId &&
    !masteredBonusAwarded.includes(question.classId) &&
    isClassMastered({ ...state, classStats }, question.classId)
  ) {
    masteredBonusAwarded.push(question.classId);
    xpGained += XP_CLASS_COMPLETE;
    classMastered = true;
  }

  const next: DgState = {
    ...state,
    xp: state.xp + xpGained,
    questionsAnswered: state.questionsAnswered + 1,
    correctAnswered: state.correctAnswered + (correct ? 1 : 0),
    runningCorrectStreak,
    classStats,
    mistakes,
    masteredBonusAwarded,
    lastActiveDate: todayKey(),
  };

  return { state: next, xpGained, streakBonus, classMastered };
}

export interface QuizCompletionResult {
  state: DgState;
  bonusXp: number;
  perfect: boolean;
}

export function applyQuizCompletion(
  state: DgState,
  params: { mode: QuizMode; score: number; total: number; classIds: DgClassId[] }
): QuizCompletionResult {
  const { mode, score, total, classIds } = params;
  const perfect = total >= 5 && score === total;
  const bonusXp = perfect ? XP_PERFECT_QUIZ : 0;

  const historyEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    mode,
    date: Date.now(),
    score,
    total,
    classIds,
  };

  const quizHistory = [historyEntry, ...state.quizHistory].slice(0, 50);

  return {
    state: { ...state, xp: state.xp + bonusXp, quizHistory },
    bonusXp,
    perfect,
  };
}

export function completeDailyChallenge(state: DgState, score: number, total: number): DgState {
  const today = todayKey();
  const yesterday = todayKey(new Date(Date.now() - 86400000));

  let streak = state.streak;
  if (state.dailyChallenge.lastCompletedDate === today) {
    // already completed today — no streak change
  } else if (state.dailyChallenge.lastCompletedDate === yesterday) {
    streak += 1;
  } else {
    streak = 1;
  }

  return {
    ...state,
    streak,
    lastActiveDate: today,
    dailyChallenge: { lastCompletedDate: today, lastScore: score, lastTotal: total },
  };
}

export function hasDoneDailyChallengeToday(state: DgState): boolean {
  return state.dailyChallenge.lastCompletedDate === todayKey();
}

// -----------------------------------------------------------------------
// Course Path progress — derived entirely from existing state (classStats
// and quizHistory), so it needs no new storage fields and works instantly
// for anyone who already has progress from Learn/Quiz.
// -----------------------------------------------------------------------

/** A module made of specific classes is done once every one of them is mastered. */
export function isClassModuleComplete(state: DgState, module: CourseModule): boolean {
  if (module.classIds.length === 0) return false;
  return module.classIds.every((id) => isClassMastered(state, id));
}

export function getClassModuleProgress(state: DgState, module: CourseModule): { done: number; total: number; pct: number } {
  const total = module.classIds.length;
  const done = module.classIds.filter((id) => isClassMastered(state, id)).length;
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}

/** The scenario module is done once the best "scenario" mode attempt clears the pass ratio. */
export function isScenarioModuleComplete(state: DgState): boolean {
  return state.quizHistory.some(
    (h) => h.mode === "scenario" && h.total > 0 && h.score / h.total >= CERTIFICATE_PASS_RATIO
  );
}

export function isModuleComplete(state: DgState, module: CourseModule): boolean {
  return module.classIds.length > 0 ? isClassModuleComplete(state, module) : isScenarioModuleComplete(state);
}

/** Has the operator passed a full-length mixed exam at the certificate threshold? */
export function hasPassedCertificateExam(state: DgState): boolean {
  return state.quizHistory.some(
    (h) => h.mode === "mixed" && h.total >= CERTIFICATE_MIN_QUESTIONS && h.score / h.total >= CERTIFICATE_PASS_RATIO
  );
}

export function bestCertificateAttempt(state: DgState): { score: number; total: number; date: number } | null {
  const attempts = state.quizHistory.filter((h) => h.mode === "mixed" && h.total >= CERTIFICATE_MIN_QUESTIONS);
  if (attempts.length === 0) return null;
  return attempts.reduce((best, h) => (h.score / h.total > best.score / best.total ? h : best));
}
