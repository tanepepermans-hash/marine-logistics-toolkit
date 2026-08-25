import Link from "next/link";
import { Eye, Hash, Layers, Package, Scale, Zap, GraduationCap, RotateCcw } from "lucide-react";
import PremiumGate from "@/dg/components/PremiumGate";

const MODES = [
  {
    mode: "symbol",
    title: "Identify the Symbol",
    desc: "See a hazard label. Choose the DG class it represents.",
    count: 10,
    icon: Eye,
  },
  {
    mode: "class",
    title: "Identify the Class",
    desc: "Match a hazard concept to the correct DG class.",
    count: 10,
    icon: Layers,
  },
  {
    mode: "cargo",
    title: "Match the Cargo",
    desc: "Real-world goods — which DG class normally applies?",
    count: 10,
    icon: Package,
  },
  {
    mode: "unnumber",
    title: "Match the UN Number",
    desc: "Learn verified UN number examples like UN3480 and UN1845.",
    count: 8,
    icon: Hash,
  },
  {
    mode: "packing-group",
    title: "Packing Group Quiz",
    desc: "Practice Packing Group I / II / III scenarios.",
    count: 8,
    icon: Scale,
  },
  {
    mode: "visual",
    title: "Visual Recognition",
    desc: "Fast flashcard-style label memorization drill.",
    count: 15,
    icon: Zap,
  },
] as const;

export default function QuizHubPage() {
  return (
    <PremiumGate title="Quiz practice">
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-hazard-orange/15 text-hazard-orange">
          <GraduationCap size={22} />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Quiz Modes</h1>
          <p className="text-sm text-mist-400">Pick a mode to practice until it's memorized.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODES.map(({ mode, title, desc, count, icon: Icon }) => (
          <Link
            key={mode}
            href={`/dg-training/quiz/play?mode=${mode}&count=${count}`}
            className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-navy-800/70 p-5 transition-all hover:-translate-y-1 hover:border-hazard-orange/50 hover:shadow-premium"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-hazard-orange">
              <Icon size={20} />
            </span>
            <div>
              <h2 className="font-semibold text-white">{title}</h2>
              <p className="mt-1 text-sm text-mist-400">{desc}</p>
            </div>
            <span className="mt-auto text-xs font-semibold text-hazard-orange">Start · {count} questions</span>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/70 p-6">
        <h2 className="font-semibold text-white">Mixed Exam</h2>
        <p className="mt-1 text-sm text-mist-400">
          A simulated DG exam covering every category. Choose a length and get a full pass/fail result at the end.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {[10, 20, 50].map((n) => (
            <Link
              key={n}
              href={`/dg-training/quiz/play?mode=mixed&count=${n}`}
              className="rounded-full bg-hazard-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-hazard-reddeep"
            >
              {n} Questions
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/dg-training/daily"
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-navy-800/70 p-5 hover:border-hazard-orange/50"
        >
          <div>
            <h2 className="font-semibold text-white">Daily DG Challenge</h2>
            <p className="mt-1 text-sm text-mist-400">5 fresh questions a day. Keep your streak alive.</p>
          </div>
          <Zap size={20} className="text-hazard-orange" />
        </Link>
        <Link
          href="/dg-training/quiz/play?mode=mistakes&count=10"
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-navy-800/70 p-5 hover:border-hazard-orange/50"
        >
          <div>
            <h2 className="font-semibold text-white">Practice Mistakes</h2>
            <p className="mt-1 text-sm text-mist-400">Spaced-repetition review of questions you've missed.</p>
          </div>
          <RotateCcw size={20} className="text-hazard-orange" />
        </Link>
      </div>
    </div>
    </PremiumGate>
  );
}
