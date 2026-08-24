import { AlertTriangle } from "lucide-react";
import type { Question } from "@/dg/types";
import type { MistakeEntry } from "@/dg/lib/storage";
import HazardLabel from "@/dg/components/HazardLabel";

interface MistakeReviewProps {
  question: Question;
  mistake: MistakeEntry;
}

export default function MistakeReview({ question, mistake }: MistakeReviewProps) {
  return (
    <div className="rounded-2xl border border-hazard-red/25 bg-navy-800/70 p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-hazard-red">
          <AlertTriangle size={13} /> Missed {mistake.wrongCount}×
        </span>
        <span className="text-xs uppercase tracking-wide text-mist-400">{question.category.replace("-", " ")}</span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {question.showLabelFor && (
          <div className="flex justify-center sm:shrink-0">
            <HazardLabel classId={question.showLabelFor} size={80} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white">{question.prompt}</p>
          <p className="mt-2 text-sm text-hazard-green">
            Correct answer: <span className="font-semibold">{question.options[question.correctIndex]}</span>
          </p>
          <p className="mt-2 text-sm text-mist-300">{question.explanation}</p>
        </div>
      </div>
    </div>
  );
}
