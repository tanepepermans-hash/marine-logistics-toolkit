"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DgClassId, Question, QuizMode } from "@/dg/types";
import {
  defaultDgState,
  isPremiumUnlocked,
  loadDgState,
  resetDgState,
  saveDgState,
  setPremiumUnlocked,
  type DgState,
} from "@/dg/lib/storage";
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
  const [premium, setPremium] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const hasLoaded = useRef(false);
  const hasClaimed = useRef(false);

  useEffect(() => {
    setState(loadDgState());
    setPremium(isPremiumUnlocked());
    setLoaded(true);
    hasLoaded.current = true;
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    saveDgState(state);
  }, [state]);

  // A buyer of the "dg" or "bundle" tier lands here from /download with
  // ?claim=<stripe session id>. Verify it once, unlock premium, then strip
  // the param from the URL so refreshing/sharing the link can't re-trigger it.
  useEffect(() => {
    if (!loaded || hasClaimed.current) return;
    const url = new URL(window.location.href);
    const claimId = url.searchParams.get("claim");
    if (!claimId) return;
    hasClaimed.current = true;
    setClaiming(true);
    setClaimError(null);
    fetch(`/api/dg-unlock?session_id=${encodeURIComponent(claimId)}`)
      .then((res) => res.json())
      .then((data: { unlocked?: boolean; error?: string }) => {
        if (data.unlocked) {
          setPremiumUnlocked();
          setPremium(true);
        } else {
          setClaimError(data.error ?? "This link couldn't be verified.");
        }
      })
      .catch(() => setClaimError("Could not reach the server to verify this link. Please try again."))
      .finally(() => {
        setClaiming(false);
        url.searchParams.delete("claim");
        window.history.replaceState({}, "", url.pathname + url.search + url.hash);
      });
  }, [loaded]);

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

  return { state, loaded, premium, claiming, claimError, answerQuestion, completeQuiz, completeDaily, resetProgress };
}
