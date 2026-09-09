// Shared type definitions for the Dangerous Goods learning app.

export type DgClassId =
  | "1.1"
  | "1.2"
  | "1.3"
  | "1.4"
  | "1.5"
  | "1.6"
  | "2.1"
  | "2.2"
  | "2.3"
  | "3"
  | "4.1"
  | "4.2"
  | "4.3"
  | "5.1"
  | "5.2"
  | "6.1"
  | "6.2"
  | "7"
  | "8"
  | "9";

export type PackingGroup = "I" | "II" | "III";

export type SymbolKey =
  | "explosive"
  | "flame"
  | "gas-cylinder"
  | "skull"
  | "flame-stripes"
  | "flame-split"
  | "flame-blue"
  | "oxidizer"
  | "organic-peroxide"
  | "infectious"
  | "radioactive"
  | "corrosive"
  | "misc-stripes";

/** A single learnable DG class or division. */
export interface DgClass {
  id: DgClassId;
  classNumber: string; // "1" .. "9"
  division?: string; // e.g. "1" for 1.1, undefined when the class has no divisions
  name: string;
  shortLabel: string; // text printed on the hazard diamond
  labelNumberText: string; // number printed in the bottom corner of the diamond
  symbol: SymbolKey;
  bg: string; // primary background color for the label diamond
  bg2?: string; // secondary color for split-background labels
  fg: string; // pictogram / text color
  meaning: string;
  mainHazard: string;
  examples: string[];
  transportRisks: string[];
  packingGroups?: PackingGroup[];
  notes?: string;
}

/** Groups every division of a class number together for overview pages. */
export interface DgClassGroup {
  classNumber: string;
  title: string;
  intro: string;
  items: DgClass[];
}

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type QuizCategory =
  | "symbol"
  | "class"
  | "cargo"
  | "unnumber"
  | "packing-group"
  | "iata"
  | "scenario";

export interface Question {
  id: string;
  category: QuizCategory;
  difficulty: Difficulty;
  classId?: DgClassId;
  prompt: string;
  showLabelFor?: DgClassId;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type QuizMode =
  | "symbol"
  | "class"
  | "cargo"
  | "unnumber"
  | "packing-group"
  | "iata"
  | "scenario"
  | "visual"
  | "mixed"
  | "daily"
  | "mistakes";

export interface QuizResultEntry {
  question: Question;
  selectedIndex: number;
  correct: boolean;
}

export interface ReferenceEntry {
  id: string;
  title: string;
  keywords: string[];
  summary: string;
  classId?: DgClassId;
}
