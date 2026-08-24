"use client";

import type { ReactNode } from "react";
import { DgStateProvider, useDg } from "@/dg/lib/DgStateProvider";
import Sidebar from "@/dg/components/Sidebar";
import BottomNav from "@/dg/components/BottomNav";

function ShellInner({ children }: { children: ReactNode }) {
  const { state } = useDg();
  return (
    <div className="flex min-h-screen bg-navy-900 text-mist-100">
      <Sidebar xp={state.xp} streak={state.streak} />
      <main className="min-w-0 flex-1 pb-20 lg:pb-0">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}

export default function DgShell({ children }: { children: ReactNode }) {
  return (
    <DgStateProvider>
      <ShellInner>{children}</ShellInner>
    </DgStateProvider>
  );
}
