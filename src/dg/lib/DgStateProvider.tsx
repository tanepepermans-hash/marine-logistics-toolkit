"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useDgState } from "@/dg/lib/useDgState";

type DgContextValue = ReturnType<typeof useDgState>;

const DgContext = createContext<DgContextValue | null>(null);

export function DgStateProvider({ children }: { children: ReactNode }) {
  const value = useDgState();
  return <DgContext.Provider value={value}>{children}</DgContext.Provider>;
}

export function useDg(): DgContextValue {
  const ctx = useContext(DgContext);
  if (!ctx) throw new Error("useDg must be used within a DgStateProvider");
  return ctx;
}
