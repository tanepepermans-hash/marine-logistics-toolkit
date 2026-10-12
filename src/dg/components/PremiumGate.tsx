"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { useDg } from "@/dg/lib/DgStateProvider";
import CheckoutButton from "@/components/CheckoutButton";
import { siteConfig, formatPrice } from "@/config/site";

interface PremiumGateProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export default function PremiumGate({ children, title, description }: PremiumGateProps) {
  const { premium, loaded, claiming, claimError } = useDg();

  if (!loaded || claiming) {
    return <div className="py-20 text-center text-mist-400">{claiming ? "Confirming your order…" : "Loading…"}</div>;
  }

  if (premium) return <>{children}</>;

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-hazard-amber/25 bg-navy-800/70 p-8 text-center shadow-premium sm:p-10">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-hazard-amber/15 text-hazard-amber">
        <Lock size={24} />
      </span>
      <h1 className="mt-4 text-xl font-bold text-white">{title} is part of DG Training Academy Premium</h1>
      <p className="mt-2 text-sm leading-relaxed text-mist-300">
        {description ??
          "Learning content (DG Classes, Learn mode) stays free. Quizzes, mistake tracking, XP and progress analytics — the tools that make it actually stick — are part of the paid DG Training Academy."}
      </p>

      {claimError && (
        <p className="mt-4 rounded-lg bg-hazard-red/10 px-3 py-2 text-xs text-hazard-red">{claimError}</p>
      )}

      <div className="mt-6 flex flex-col items-center gap-3">
        <CheckoutButton
          label={`Unlock DG Training Academy — ${formatPrice(siteConfig.tiers.dg.price)}`}
          tier="dg"
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
        />
        <Link href="/#pricing" className="text-xs font-medium text-mist-400 underline hover:text-white">
          Or get everything in the Bundle (Toolkit Premium + DG Training)
        </Link>
      </div>

      <p className="mt-5 text-xs text-mist-400">
        Already bought it? Reopen the &ldquo;Open DG Training Academy&rdquo; link from your order confirmation page.
      </p>
    </div>
  );
}
