import type { Metadata } from "next";
import DgShell from "@/dg/components/DgShell";

export const metadata: Metadata = {
  title: "DG Training | Dangerous Goods Learning App",
  description:
    "Learn Dangerous Goods classes, hazard labels and transport rules through interactive lessons, flashcards and quizzes.",
  robots: { index: false, follow: false },
};

export default function DgTrainingLayout({ children }: { children: React.ReactNode }) {
  return <DgShell>{children}</DgShell>;
}
