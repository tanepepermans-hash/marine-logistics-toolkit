"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Linkedin, Lock, Printer, ShieldCheck, Trophy } from "lucide-react";
import { useDg } from "@/dg/lib/DgStateProvider";
import { bestCertificateAttempt, hasPassedCertificateExam } from "@/dg/lib/quizEngine";
import { getCertificateName, setCertificateName } from "@/dg/lib/storage";
import { getLevelProgress } from "@/dg/lib/xp";
import { siteConfig } from "@/config/site";

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function CertificatePage() {
  const { state, loaded } = useDg();
  const [name, setName] = useState("");

  useEffect(() => {
    setName(getCertificateName());
  }, []);

  function handleNameChange(value: string) {
    setName(value);
    setCertificateName(value);
  }

  if (!loaded) {
    return <div className="py-20 text-center text-mist-400">Loading…</div>;
  }

  if (!hasPassedCertificateExam(state)) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-navy-800/70 p-8 text-center sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-hazard-amber/15 text-hazard-amber">
          <Lock size={24} />
        </span>
        <h1 className="mt-4 text-xl font-bold text-white">No certificate earned yet</h1>
        <p className="mt-2 text-sm leading-relaxed text-mist-300">
          Finish every module on the Course Path, then pass the 50-question certification exam with a score of 80%
          or higher to unlock your completion certificate.
        </p>
        <Link
          href="/dg-training/course"
          className="mt-6 inline-block rounded-full bg-hazard-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-hazard-reddeep"
        >
          Go to Course Path
        </Link>
      </div>
    );
  }

  const attempt = bestCertificateAttempt(state);
  const pct = attempt ? Math.round((attempt.score / attempt.total) * 100) : 0;
  const dateLabel = attempt ? formatDate(attempt.date) : "";
  const { level } = getLevelProgress(state.xp);
  const shareUrl = `${siteConfig.url}/dg-training`;
  const displayName = name.trim() || "DG Training Operator";

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-hazard-green/15 text-hazard-green">
            <Trophy size={22} />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Your Certificate</h1>
            <p className="text-sm text-mist-400">Enter your name as you&apos;d like it printed, then save or share it.</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Your full name"
            maxLength={60}
            className="w-full max-w-sm rounded-xl border border-white/15 bg-navy-900/60 px-4 py-2.5 text-sm text-white placeholder:text-mist-500 focus:border-hazard-orange focus:outline-none sm:w-72"
          />
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 rounded-full bg-hazard-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-hazard-reddeep"
          >
            <Printer size={15} /> Print / Save as PDF
          </button>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-mist-200 hover:bg-white/10"
          >
            <Linkedin size={15} /> Share on LinkedIn
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-3xl rounded-[28px] border-[3px] border-hazard-orange/40 bg-gradient-to-b from-navy-800 to-navy-900 p-10 text-center shadow-premium-lg print:border-2 print:border-hazard-orange print:bg-white print:text-navy-900 print:shadow-none sm:p-14">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-hazard-orange/15 text-hazard-orange print:bg-transparent">
          <ShieldCheck size={32} />
        </div>
        <div className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-hazard-orange">
          DG Training Academy
        </div>
        <h2 className="mt-2 text-3xl font-extrabold text-white print:text-navy-900 sm:text-4xl">
          Certificate of Completion
        </h2>
        <p className="mt-6 text-sm text-mist-400 print:text-navy-700">This certifies that</p>
        <p className="mt-2 border-b border-white/15 pb-3 font-serif text-3xl font-semibold text-white print:border-navy-300 print:text-navy-900 sm:text-4xl">
          {displayName}
        </p>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-mist-300 print:text-navy-700">
          has completed the full DG Training Academy course path — all nine UN Dangerous Goods classes, packing
          groups and operational scenarios — and passed the {attempt?.total}-question certification exam with a
          score of <span className="font-semibold text-white print:text-navy-900">{pct}%</span>, reaching{" "}
          <span className="font-semibold text-white print:text-navy-900">Level {level.level} · {level.title}</span>.
        </p>
        <p className="mt-6 text-sm text-mist-400 print:text-navy-700">{dateLabel}</p>

        <div className="mx-auto mt-8 max-w-lg rounded-xl border border-white/10 bg-navy-950/40 px-4 py-3 text-[11px] leading-relaxed text-mist-500 print:border-navy-300 print:bg-transparent print:text-navy-600">
          This is an informal study-aid certificate, not an official or regulatory Dangerous Goods certification.
          It does not replace or count toward IATA DGR, ADR or IMDG Code training requirements.
        </div>
      </div>
    </div>
  );
}
