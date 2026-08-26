"use client";

import Link from "next/link";
import { CheckCircle2, ClipboardList, Lock, Map, Sparkles, Trophy } from "lucide-react";
import { COURSE_MODULES, CERTIFICATE_MIN_QUESTIONS } from "@/dg/data/curriculum";
import { useDg } from "@/dg/lib/DgStateProvider";
import {
  getClassModuleProgress,
  hasPassedCertificateExam,
  isModuleComplete,
} from "@/dg/lib/quizEngine";
import HazardLabel from "@/dg/components/HazardLabel";
import ProgressBar from "@/dg/components/ProgressBar";

export default function CoursePathPage() {
  const { state, loaded } = useDg();

  if (!loaded) {
    return <div className="py-20 text-center text-mist-400">Loading your course path…</div>;
  }

  const completions = COURSE_MODULES.map((m) => isModuleComplete(state, m));
  const frontierIndex = completions.findIndex((done) => !done);
  const allModulesDone = frontierIndex === -1;
  const certified = hasPassedCertificateExam(state);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-hazard-orange/15 text-hazard-orange">
          <Map size={22} />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Course Path</h1>
          <p className="text-sm text-mist-400">
            The recommended route through DG Training, module by module — finish one to unlock the next.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {COURSE_MODULES.map((module, i) => {
          const unlocked = allModulesDone || i <= frontierIndex;
          const done = completions[i];
          const progress = module.classIds.length > 0 ? getClassModuleProgress(state, module) : null;
          const href =
            module.classIds.length > 0
              ? `/dg-training/quiz/play?mode=mixed&classIds=${module.classIds.join(",")}&count=${module.quizCount}`
              : `/dg-training/quiz/play?mode=scenario&count=${module.quizCount}`;

          return (
            <div
              key={module.id}
              className={`rounded-2xl border p-5 sm:p-6 ${
                done
                  ? "border-hazard-green/30 bg-hazard-green/5"
                  : unlocked
                    ? "border-white/10 bg-navy-800/70"
                    : "border-white/5 bg-navy-800/30 opacity-60"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      done
                        ? "bg-hazard-green/20 text-hazard-green"
                        : unlocked
                          ? "bg-hazard-orange/15 text-hazard-orange"
                          : "bg-white/5 text-mist-500"
                    }`}
                  >
                    {done ? <CheckCircle2 size={18} /> : module.order}
                  </span>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-hazard-orange">
                      Module {module.order} · {module.subtitle}
                    </div>
                    <h2 className="text-lg font-bold text-white">{module.title}</h2>
                    <p className="mt-1 max-w-xl text-sm text-mist-300">{module.description}</p>

                    {module.classIds.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {module.classIds.map((id) => (
                          <div key={id} className="opacity-90">
                            <HazardLabel classId={id} size={36} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-stretch gap-2 sm:w-48">
                  {progress && (
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs text-mist-400">
                        <span>{progress.done} / {progress.total} mastered</span>
                        <span>{progress.pct}%</span>
                      </div>
                      <ProgressBar value={progress.pct} height={6} />
                    </div>
                  )}
                  {unlocked ? (
                    <Link
                      href={href}
                      className="flex items-center justify-center gap-2 rounded-full bg-hazard-orange px-4 py-2.5 text-sm font-semibold text-white hover:bg-hazard-reddeep"
                    >
                      {done ? "Practice Again" : "Start Module"} <Sparkles size={15} />
                    </Link>
                  ) : (
                    <div className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-xs font-medium text-mist-500">
                      <Lock size={13} /> Finish Module {module.order - 1} first
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div
          className={`rounded-2xl border p-5 sm:p-6 ${
            certified ? "border-hazard-green/30 bg-hazard-green/5" : allModulesDone ? "border-hazard-amber/30 bg-hazard-amber/5" : "border-white/5 bg-navy-800/30 opacity-60"
          }`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  certified ? "bg-hazard-green/20 text-hazard-green" : "bg-hazard-amber/15 text-hazard-amber"
                }`}
              >
                <Trophy size={18} />
              </span>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-hazard-amber">
                  Final Step
                </div>
                <h2 className="text-lg font-bold text-white">Certification Exam</h2>
                <p className="mt-1 max-w-xl text-sm text-mist-300">
                  A {CERTIFICATE_MIN_QUESTIONS}-question mixed exam covering every class and category. Score 80% or
                  higher to earn your DG Training completion certificate.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-stretch gap-2 sm:w-48">
              {certified ? (
                <Link
                  href="/dg-training/certificate"
                  className="flex items-center justify-center gap-2 rounded-full bg-hazard-green px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                >
                  <Trophy size={15} /> View Certificate
                </Link>
              ) : allModulesDone ? (
                <Link
                  href={`/dg-training/quiz/play?mode=mixed&count=${CERTIFICATE_MIN_QUESTIONS}`}
                  className="flex items-center justify-center gap-2 rounded-full bg-hazard-orange px-4 py-2.5 text-sm font-semibold text-white hover:bg-hazard-reddeep"
                >
                  <ClipboardList size={15} /> Take the Exam
                </Link>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-xs font-medium text-mist-500">
                  <Lock size={13} /> Finish every module first
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
