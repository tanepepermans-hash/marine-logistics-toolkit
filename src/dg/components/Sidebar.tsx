"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, ShieldAlert, Sparkles } from "lucide-react";
import { NAV_ITEMS } from "@/dg/components/nav";
import XPIndicator from "@/dg/components/XPIndicator";
import { useDg } from "@/dg/lib/DgStateProvider";

interface SidebarProps {
  xp: number;
  streak: number;
}

export default function Sidebar({ xp, streak }: SidebarProps) {
  const pathname = usePathname();
  const { premium } = useDg();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-navy-900/95 p-4 print:hidden lg:flex">
      <Link href="/dg-training" className="flex items-center gap-2 px-2 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-hazard-orange/15 text-hazard-orange">
          <ShieldAlert size={20} />
        </span>
        <div>
          <div className="text-sm font-bold leading-tight text-white">DG Training</div>
          <div className="text-[11px] leading-tight text-mist-400">Dangerous Goods Academy</div>
        </div>
      </Link>

      <nav className="mt-4 flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/dg-training" ? pathname === item.href : pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-hazard-orange/15 text-hazard-orange" : "text-mist-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span className="flex-1">{item.label}</span>
              {item.premium && !premium && <Lock size={13} className="text-mist-500" />}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 pt-3">
        {streak > 0 && (
          <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm">
            <span className="text-mist-300">Daily streak</span>
            <span className="font-semibold text-hazard-orange">🔥 {streak}</span>
          </div>
        )}
        <XPIndicator xp={xp} compact />
        {premium ? (
          <div className="flex items-center justify-center gap-1.5 rounded-xl bg-hazard-green/10 px-3 py-2 text-xs font-semibold text-hazard-green">
            <Sparkles size={13} /> Premium unlocked
          </div>
        ) : (
          <Link
            href="/dg-training/quiz"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-hazard-amber/30 bg-hazard-amber/10 px-3 py-2 text-xs font-semibold text-hazard-amber hover:bg-hazard-amber/15"
          >
            <Lock size={13} /> Unlock Premium
          </Link>
        )}
      </div>
    </aside>
  );
}
