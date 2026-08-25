import { Lightbulb } from "lucide-react";
import type { Question } from "@/dg/types";
import HazardLabel from "@/dg/components/HazardLabel";
import AnswerButton, { type AnswerButtonState } from "@/dg/components/AnswerButton";
import ProgressBar from "@/dg/components/ProgressBar";

const LETTERS = ["A", "B", "C", "D"];

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedIndex: number | null;
  revealed: boolean;
  onSelect: (index: number) => void;
}

export default function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  selectedIndex,
  revealed,
  onSelect,
}: QuizCardProps) {
  const progressPct = (questionNumber / totalQuestions) * 100;

  function buttonState(index: number): AnswerButtonState {
    if (!revealed) return selectedIndex === index ? "selected" : "idle";
    if (index === question.correctIndex) return "correct";
    if (index === selectedIndex) return "incorrect";
    return "faded";
  }

  const isCorrect = revealed && selectedIndex === question.correctIndex;

  return (
    <div className="rounded-3xl border border-white/10 bg-navy-800/70 p-5 shadow-premium sm:p-8">
      <div className="mb-5 flex items-center justify-between text-xs font-medium text-mist-400">
        <span>
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className="uppercase tracking-wide">{question.difficulty}</span>
      </div>
      <ProgressBar value={progressPct} />

      {question.showLabelFor && (
        <div className="mt-6 flex justify-center">
          <HazardLabel classId={question.showLabelFor} size={128} />
        </div>
      )}

      <h2 className="mt-6 text-center text-lg font-semibold text-white sm:text-xl">{question.prompt}</h2>

      <div className="mt-6 space-y-3">
        {question.options.map((opt, i) => (
          <AnswerButton
            key={i}
            letter={LETTERS[i]}
            label={opt}
            state={buttonState(i)}
            disabled={revealed}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>

      {revealed && (
        <div
          className={`mt-6 flex gap-3 rounded-2xl border p-4 text-sm ${
            isCorrect ? "border-hazard-green/40 bg-hazard-green/10" : "border-hazard-red/40 bg-hazard-red/10"
          }`}
        >
          <Lightbulb size={20} className={isCorrect ? "shrink-0 text-hazard-green" : "shrink-0 text-hazard-red"} />
          <div>
            <div className={`mb-1 font-semibold ${isCorrect ? "text-hazard-green" : "text-hazard-red"}`}>
              {isCorrect ? "Correct" : `Incorrect — correct answer: ${question.options[question.correctIndex]}`}
            </div>
            <p className="text-mist-200">{question.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
