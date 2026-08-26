import type { DgClassId } from "@/dg/types";

// -----------------------------------------------------------------------
// Course Path — groups the 20 DG classes/divisions into a fixed, ordered
// sequence of modules, plus a dedicated scenario module and a final
// certification exam. This turns the app from a free-roam reference tool
// into something with a recommended "Day 1 -> Week 1 -> Certificate" route,
// while every class/quiz remains individually reachable from Learn and the
// Quiz Hub for anyone who prefers to jump around.
// -----------------------------------------------------------------------

export interface CourseModule {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  classIds: DgClassId[];
  /** Recommended question count when starting this module's quiz. */
  quizCount: number;
}

export const COURSE_MODULES: CourseModule[] = [
  {
    id: "explosives-gases",
    order: 1,
    title: "Explosives & Gases",
    subtitle: "Classes 1 & 2",
    description:
      "Start with the two classes most often confused by sight: the six divisions of explosives, and the three gas divisions distinguished by color.",
    classIds: ["1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "2.1", "2.2", "2.3"],
    quizCount: 12,
  },
  {
    id: "flammables",
    order: 2,
    title: "Flammable Liquids & Solids",
    subtitle: "Classes 3 & 4",
    description:
      "The everyday hazards: liquids that ignite easily, solids that catch fire, and the two special cases — spontaneous combustion and dangerous-when-wet.",
    classIds: ["3", "4.1", "4.2", "4.3"],
    quizCount: 10,
  },
  {
    id: "oxidizers-toxic",
    order: 3,
    title: "Oxidizers, Toxic & Infectious",
    subtitle: "Classes 5 & 6",
    description:
      "Substances that intensify fire without burning themselves, and materials dangerous to health — from pesticides to clinical specimens.",
    classIds: ["5.1", "5.2", "6.1", "6.2"],
    quizCount: 10,
  },
  {
    id: "radioactive-corrosive-misc",
    order: 4,
    title: "Radioactive, Corrosive & Miscellaneous",
    subtitle: "Classes 7, 8 & 9",
    description:
      "Finish the class-by-class path with radiation, corrosion, and the Class 9 catch-all that covers lithium batteries and dry ice.",
    classIds: ["7", "8", "9"],
    quizCount: 10,
  },
  {
    id: "scenario-practice",
    order: 5,
    title: "Operational Scenarios",
    subtitle: "Apply it",
    description:
      "Real judgment calls a junior operator actually faces — undeclared DG, segregation, packaging, documentation — not just label recall.",
    classIds: [],
    quizCount: 15,
  },
];

export const CERTIFICATE_MIN_QUESTIONS = 50;
export const CERTIFICATE_PASS_RATIO = 0.8;
