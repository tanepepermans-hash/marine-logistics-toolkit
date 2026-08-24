"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DgClassId, Question, QuizMode } from "@/dg/types";
import { defaultDgState, loadDgState, resetDgState, saveDgState, type DgState } from "@/dg/lib/storage";
import { applyAnswer, applyQuizCompletion, completeDailyChallenge } from "@/dg/lib/quizEngine";

export interface AnswerFeedback {
  correct: boolean;
  xpGained: number;
  streakBonus: boolean;
  classMastered: boolean;
}

export function useDgState() {
  const [state, setState] = useState<DgState>(() => defaultDgState());
  const [loaded, setLoaded] = useState(false);
  const hasLoaded = useRef(false);

  useEffect(() => {
    setState(loadDgState());
    setLoaded(true);
    hasLoaded.current = true;
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    saveDgState(state);
  }, [state]);

  const answerQuestion = useCallback((question: Question, selectedIndex: number): AnswerFeedback => {
    const correct = selectedIndex === question.correctIndex;
    let feedback: AnswerFeedback = { correct, xpGained: 0, streakBonus: false, classMastered: false };
    setState((prev) => {
      const outcome = applyAnswer(prev, question, correct);
      feedback = {
        correct,
        xpGained: outcome.xpGained,
        streakBonus: outcome.streakBonus,
        classMastered: outcome.classMastered,
      };
      return outcome.state;
    });
    return feedback;
  }, []);

  const completeQuiz = useCallback(
    (mode: QuizMode, score: number, total: number, classIds: DgClassId[]) => {
      let bonus = 0;
      let perfect = false;
      setState((prev) => {
        const result = applyQuizCompletion(prev, { mode, score, total, classIds });
        bonus = result.bonusXp;
        perfect = result.perfect;
        return result.state;
      });
      return { bonus, perfect };
    },
    []
  );

  const completeDaily = useCallback((score: number, total: number) => {
    setState((prev) => completeDailyChallenge(prev, score, total));
  }, []);

  const resetProgress = useCallback(() => {
    setState(resetDgState());
  }, []);

  return { state, loaded, answerQuestion, completeQuiz, completeDaily, resetProgress };
}
