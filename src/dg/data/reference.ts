import type { ReferenceEntry } from "@/dg/types";
import { DG_CLASSES } from "@/dg/data/classes";

// -----------------------------------------------------------------------
// Searchable reference entries. Includes one entry per DG class/division
// plus a handful of cross-cutting topics (UN numbers, packing groups, IATA
// basics) so the reference/search page has useful results out of the box.
// -----------------------------------------------------------------------

const CLASS_ENTRIES: ReferenceEntry[] = DG_CLASSES.map((c) => ({
  id: `class-${c.id}`,
  title: `Class ${c.id} – ${c.name}`,
  keywords: [
    `class ${c.id}`,
    `class ${c.classNumber}`,
    c.name.toLowerCase(),
    c.shortLabel.toLowerCase(),
    ...c.examples.map((e) => e.toLowerCase()),
  ],
  summary: c.meaning,
  classId: c.id,
}));

const TOPIC_ENTRIES: ReferenceEntry[] = [
  {
    id: "topic-un3480",
    title: "UN 3480 – Lithium Ion Batteries",
    keywords: ["un3480", "un 3480", "lithium ion batteries", "lithium batteries", "power bank"],
    summary: "UN3480 is the UN number for lithium-ion batteries shipped by themselves (not packed with or installed in equipment). Classified as Class 9, these batteries carry a fire risk from thermal runaway if damaged, overcharged or short-circuited, and are subject to state-of-charge, packaging and quantity limits under IATA DGR.",
    classId: "9",
  },
  {
    id: "topic-un3481",
    title: "UN 3481 – Lithium Ion Batteries Packed With / In Equipment",
    keywords: ["un3481", "un 3481", "lithium ion batteries with equipment", "laptop battery", "device battery"],
    summary: "UN3481 covers lithium-ion batteries either packed alongside the equipment they power (e.g. a spare battery boxed with a laptop) or already installed inside it. Classified as Class 9.",
    classId: "9",
  },
  {
    id: "topic-un3090",
    title: "UN 3090 – Lithium Metal Batteries",
    keywords: ["un3090", "un 3090", "lithium metal batteries", "non-rechargeable lithium battery"],
    summary: "UN3090 covers lithium metal (typically non-rechargeable) batteries shipped by themselves. Classified as Class 9, with stricter air transport restrictions than lithium-ion due to higher fire risk.",
    classId: "9",
  },
  {
    id: "topic-un3091",
    title: "UN 3091 – Lithium Metal Batteries With / In Equipment",
    keywords: ["un3091", "un 3091", "lithium metal batteries with equipment"],
    summary: "UN3091 covers lithium metal batteries packed with, or installed inside, the equipment they power. Classified as Class 9.",
    classId: "9",
  },
  {
    id: "topic-un1845",
    title: "UN 1845 – Dry Ice (Carbon Dioxide, Solid)",
    keywords: ["un1845", "un 1845", "dry ice", "solid carbon dioxide", "co2"],
    summary: "UN1845 is dry ice — solid carbon dioxide used as a coolant. It is classified as Class 9 for air transport because it sublimates into CO2 gas, which can build up and displace oxygen in an enclosed cargo hold or room.",
    classId: "9",
  },
  {
    id: "topic-un1203",
    title: "UN 1203 – Gasoline / Petrol",
    keywords: ["un1203", "un 1203", "gasoline", "petrol", "motor spirit"],
    summary: "UN1203 is the UN number for gasoline (petrol / motor spirit), a Class 3 Flammable Liquid, typically assigned Packing Group II.",
    classId: "3",
  },
  {
    id: "topic-packing-groups",
    title: "Packing Groups (I, II, III)",
    keywords: ["packing group", "packing groups", "pg i", "pg ii", "pg iii", "danger level"],
    summary: "Packing Group indicates the degree of danger within a hazard class: Packing Group I = high danger, Packing Group II = medium danger, Packing Group III = low danger. Not every class uses Packing Groups — explosives, gases, radioactive material, infectious substances, organic peroxides and some Class 9 items (like lithium batteries) use their own systems instead.",
  },
  {
    id: "topic-iata-dgr",
    title: "IATA DGR (Dangerous Goods Regulations)",
    keywords: ["iata", "dgr", "dangerous goods regulations", "air transport rules"],
    summary: "The IATA Dangerous Goods Regulations (DGR) is the air cargo industry's manual for classifying, packaging, marking, labeling and documenting dangerous goods shipped by air. It builds on the ICAO Technical Instructions and adds State and Operator Variations.",
  },
  {
    id: "topic-imdg",
    title: "IMDG Code (Sea Transport)",
    keywords: ["imdg", "imdg code", "sea transport", "maritime dangerous goods", "imo"],
    summary: "The International Maritime Dangerous Goods (IMDG) Code, published by the IMO, is the equivalent of IATA DGR for shipping dangerous goods by sea.",
  },
  {
    id: "topic-adr",
    title: "ADR (Road Transport)",
    keywords: ["adr", "road transport", "european agreement"],
    summary: "ADR is the European Agreement concerning the International Carriage of Dangerous Goods by Road, governing how DG must be classified, packaged, marked and documented for road transport in Europe.",
  },
  {
    id: "topic-segregation",
    title: "Segregation of Dangerous Goods",
    keywords: ["segregation", "incompatible", "separation"],
    summary: "Segregation rules keep incompatible classes of dangerous goods apart during transport and storage — for example, oxidizers must be kept away from flammable materials — to prevent dangerous reactions if packaging is damaged.",
  },
  {
    id: "topic-shippers-declaration",
    title: "Shipper's Declaration for Dangerous Goods",
    keywords: ["shipper's declaration", "shippers declaration", "dgd", "declaration form"],
    summary: "A Shipper's Declaration for Dangerous Goods is the standard document a shipper completes to declare a DG shipment to the carrier, listing the UN number, proper shipping name, class, packing group, quantity and packaging details.",
  },
];

export const REFERENCE_ENTRIES: ReferenceEntry[] = [...CLASS_ENTRIES, ...TOPIC_ENTRIES];

export function searchReference(query: string): ReferenceEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const normalized = q.replace(/\s+/g, " ");
  return REFERENCE_ENTRIES.filter((entry) => {
    if (entry.title.toLowerCase().includes(normalized)) return true;
    return entry.keywords.some((k) => k.includes(normalized) || normalized.includes(k));
  }).slice(0, 20);
}
