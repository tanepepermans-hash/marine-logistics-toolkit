import { Check, X } from "lucide-react";

export type AnswerButtonState = "idle" | "selected" | "correct" | "incorrect" | "faded";

interface AnswerButtonProps {
  letter: string;
  label: string;
  state: AnswerButtonState;
  onClick: () => void;
  disabled?: boolean;
}

const STATE_CLASSES: Record<AnswerButtonState, string> = {
  idle: "border-white/10 bg-navy-800/70 hover:border-hazard-orange/60 hover:bg-navy-800",
  selected: "border-hazard-orange bg-hazard-orange/10",
  correct: "border-hazard-green bg-hazard-green/15",
  incorrect: "border-hazard-red bg-hazard-red/15",
  faded: "border-white/5 bg-navy-800/40 opacity-50",
};

export default function AnswerButton({ letter, label, state, onClick, disabled }: AnswerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all duration-200 disabled:cursor-not-allowed ${STATE_CLASSES[state]}`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          state === "correct"
            ? "bg-hazard-green text-white"
            : state === "incorrect"
              ? "bg-hazard-red text-white"
              : "bg-white/10 text-mist-200"
        }`}
      >
        {state === "correct" ? <Check size={16} /> : state === "incorrect" ? <X size={16} /> : letter}
      </span>
      <span className="text-sm font-medium text-white sm:text-base">{label}</span>
    </button>
  );
}
