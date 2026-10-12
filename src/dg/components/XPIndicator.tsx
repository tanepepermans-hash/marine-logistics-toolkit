import { Zap } from "lucide-react";
import { getLevelProgress } from "@/dg/lib/xp";
import ProgressBar from "@/dg/components/ProgressBar";

interface XPIndicatorProps {
  xp: number;
  compact?: boolean;
}

export default function XPIndicator({ xp, compact = false }: XPIndicatorProps) {
  const { level, next, progressPct, xpToNext } = getLevelProgress(xp);

  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-sm">
        <Zap size={14} className="text-hazard-amber" fill="currentColor" />
        <span className="font-semibold text-white">{xp.toLocaleString()} XP</span>
        <span className="text-mist-400">· Lv.{level.level}</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-navy-800/60 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-hazard-amber/15 text-hazard-amber">
            <Zap size={18} fill="currentColor" />
          </span>
          <div>
            <div className="text-sm font-semibold text-white">Level {level.level} · {level.title}</div>
            <div className="text-xs text-mist-400">{xp.toLocaleString()} XP total</div>
          </div>
        </div>
        {next && <div className="text-xs text-mist-400">{xpToNext} XP to Lv.{next.level}</div>}
      </div>
      <div className="mt-3">
        <ProgressBar
          value={progressPct}
          label={next ? `Level ${level.level} progress, ${xpToNext} XP to level ${next.level}` : `Level ${level.level} progress, max level reached`}
          colorClass="bg-gradient-to-r from-hazard-amber to-hazard-orange"
        />
      </div>
    </div>
  );
}
