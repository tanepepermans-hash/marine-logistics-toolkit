// -----------------------------------------------------------------------
// XP + leveling rules.
// -----------------------------------------------------------------------

export interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  maxXp: number | null; // null = no ceiling (max level)
}

export const LEVELS: LevelInfo[] = [
  { level: 1, title: "DG Beginner", minXp: 0, maxXp: 200 },
  { level: 2, title: "DG Trainee", minXp: 200, maxXp: 500 },
  { level: 3, title: "DG Operator", minXp: 500, maxXp: 1000 },
  { level: 4, title: "DG Specialist", minXp: 1000, maxXp: 2000 },
  { level: 5, title: "DG Expert", minXp: 2000, maxXp: null },
];

export const XP_CORRECT_ANSWER = 10;
export const XP_STREAK_BONUS = 25; // every 5 correct answers in a row
export const XP_CLASS_COMPLETE = 100;
export const XP_PERFECT_QUIZ = 50;

export function getLevelInfo(xp: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getLevelProgress(xp: number): {
  level: LevelInfo;
  next: LevelInfo | null;
  progressPct: number;
  xpIntoLevel: number;
  xpToNext: number | null;
} {
  const level = getLevelInfo(xp);
  const idx = LEVELS.findIndex((l) => l.level === level.level);
  const next = idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
  if (!next || level.maxXp === null) {
    return { level, next: null, progressPct: 100, xpIntoLevel: xp - level.minXp, xpToNext: null };
  }
  const span = level.maxXp - level.minXp;
  const xpIntoLevel = xp - level.minXp;
  const progressPct = Math.min(100, Math.round((xpIntoLevel / span) * 100));
  return { level, next, progressPct, xpIntoLevel, xpToNext: level.maxXp - xp };
}
