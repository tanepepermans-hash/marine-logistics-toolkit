import type { DgClassId, QuizMode } from "@/dg/types";

// -----------------------------------------------------------------------
// localStorage-backed persistence for the DG Training app.
// Everything (XP, streak, mistakes, per-class stats, quiz history) lives
// under a single namespaced key so the whole app works immediately after
// install with no backend required.
// -----------------------------------------------------------------------

const STORAGE_KEY = "dg-training:v1";

export interface ClassStat {
  correct: number;
  total: number;
}

export interface MistakeEntry {
  questionId: string;
  classId?: DgClassId;
  wrongCount: number;
  correctStreak: number; // consecutive correct reviews since the last miss
  lastSeenAt: number; // epoch ms
}

export interface QuizHistoryEntry {
  id: string;
  mode: QuizMode;
  date: number; // epoch ms
  score: number;
  total: number;
  classIds: DgClassId[];
}

export interface DailyChallengeState {
  lastCompletedDate: string | null; // YYYY-MM-DD
  lastScore: number | null;
  lastTotal: number | null;
}

export interface DgState {
  xp: number;
  streak: number;
  lastActiveDate: string | null; // YYYY-MM-DD
  questionsAnswered: number;
  correctAnswered: number;
  runningCorrectStreak: number; // used for the "5 in a row" bonus
  classStats: Record<string, ClassStat>;
  masteredBonusAwarded: string[]; // classIds that already earned the "complete a class" bonus
  mistakes: Record<string, MistakeEntry>;
  quizHistory: QuizHistoryEntry[];
  dailyChallenge: DailyChallengeState;
}

export function todayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function defaultDgState(): DgState {
  return {
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    questionsAnswered: 0,
    correctAnswered: 0,
    runningCorrectStreak: 0,
    classStats: {},
    masteredBonusAwarded: [],
    mistakes: {},
    quizHistory: [],
    dailyChallenge: { lastCompletedDate: null, lastScore: null, lastTotal: null },
  };
}

export function loadDgState(): DgState {
  if (typeof window === "undefined") return defaultDgState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultDgState();
    const parsed = JSON.parse(raw);
    // Merge with defaults so new fields introduced later never crash old saves.
    return { ...defaultDgState(), ...parsed };
  } catch {
    return defaultDgState();
  }
}

export function saveDgState(state: DgState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — fail silently.
  }
}

export function resetDgState(): DgState {
  const fresh = defaultDgState();
  saveDgState(fresh);
  return fresh;
}
