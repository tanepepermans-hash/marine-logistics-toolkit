// ---------------------------------------------------------------------------
// Auto-fill: the buyer enters a shipment's details once, and every
// [Placeholder] in the templates and AI prompts that maps to one of these
// fields is filled in — on screen and in what "Copy" puts on the clipboard.
// Placeholders without a matching field stay highlighted for manual filling.
// ---------------------------------------------------------------------------

export type FieldType = "text" | "date" | "time";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  group: "You" | "Shipment" | "Parties" | "Cargo" | "Timing";
  // Placeholder names (the text inside [...]) this field fills. Matching is
  // case-insensitive.
  aliases: string[];
  hint?: string;
  // Profile fields survive "Clear shipment" — they're about the operator,
  // not the shipment.
  profile?: boolean;
};

export const FIELDS: Field[] = [
  { key: "yourName", label: "Your name", type: "text", group: "You", aliases: ["Your Name"], profile: true },
  { key: "yourCompany", label: "Your company", type: "text", group: "You", aliases: [], profile: true },

  { key: "ref", label: "Shipment reference", type: "text", group: "Shipment", aliases: ["Shipment Ref"], hint: "e.g. SM-24-01873" },
  { key: "bookingRef", label: "Booking reference", type: "text", group: "Shipment", aliases: ["Booking Ref"] },
  { key: "origin", label: "Origin", type: "text", group: "Shipment", aliases: ["Origin"], hint: "e.g. Antwerp" },
  { key: "destination", label: "Destination", type: "text", group: "Shipment", aliases: ["Destination"], hint: "e.g. Singapore" },
  { key: "vessel", label: "Vessel / flight", type: "text", group: "Shipment", aliases: ["Vessel Name", "Vessel or flight name"] },
  { key: "port", label: "Port", type: "text", group: "Shipment", aliases: ["Port Name"] },
  { key: "carrier", label: "Carrier", type: "text", group: "Shipment", aliases: ["Carrier Name"] },

  { key: "customer", label: "Customer name", type: "text", group: "Parties", aliases: ["Customer Name"] },
  { key: "contact", label: "Contact person", type: "text", group: "Parties", aliases: ["Contact Name"], hint: "Who you're writing to" },
  { key: "shipper", label: "Shipper", type: "text", group: "Parties", aliases: ["Shipper Name"] },
  { key: "consignee", label: "Consignee", type: "text", group: "Parties", aliases: ["Consignee", "Consignee Name"] },
  { key: "agent", label: "Agent contact", type: "text", group: "Parties", aliases: ["Agent Contact"] },
  { key: "pickupAddress", label: "Pickup address", type: "text", group: "Parties", aliases: ["Full Pickup Address"] },
  { key: "deliveryAddress", label: "Delivery address", type: "text", group: "Parties", aliases: ["Full Delivery Address"] },

  { key: "pieces", label: "Pieces", type: "text", group: "Cargo", aliases: ["Pieces"], hint: "e.g. 3" },
  { key: "weight", label: "Weight (kg)", type: "text", group: "Cargo", aliases: ["Weight"], hint: "Number only — templates add “kg”" },
  { key: "dims", label: "Dimensions", type: "text", group: "Cargo", aliases: ["L x W x H cm", "Dimensions"], hint: "e.g. 120 x 80 x 100 cm" },
  { key: "commodity", label: "Commodity", type: "text", group: "Cargo", aliases: ["Commodity"] },

  { key: "date", label: "Date", type: "date", group: "Timing", aliases: ["Date"], hint: "Ready / pickup / key date" },
  { key: "time", label: "Time", type: "time", group: "Timing", aliases: ["Time"] },
  { key: "cutoff", label: "Cut-off time", type: "time", group: "Timing", aliases: ["Cut-off Time"] },
];

export type Values = Record<string, string>;

export const GROUPS = ["You", "Shipment", "Parties", "Cargo", "Timing"] as const;

// Turns an ISO date (yyyy-mm-dd) into the format operators actually write in
// emails: "Wed 14 Oct 2026".
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export function isoInDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const norm = (s: string) => s.trim().toLowerCase();

// placeholder name (normalised) → filled value, for the values entered.
export function buildLookup(values: Values): Map<string, string> {
  const map = new Map<string, string>();
  const v = (k: string) => (values[k] ?? "").trim();
  const display = (f: Field) => (f.type === "date" && v(f.key) ? formatDate(v(f.key)) : v(f.key));

  for (const f of FIELDS) {
    const val = display(f);
    if (!val) continue;
    for (const a of f.aliases) map.set(norm(a), val);
  }

  // Combined placeholders.
  const date = v("date") ? formatDate(v("date")) : "";
  const time = v("time");
  if (date && time) {
    for (const a of ["Date / Time", "Date/Time", "Time/Date", "Date and time"]) map.set(norm(a), `${date}, ${time}`);
  }
  if (v("yourName")) {
    map.set(norm("Your Name / Company"), v("yourCompany") ? `${v("yourName")}, ${v("yourCompany")}` : v("yourName"));
  }
  if (v("pieces") || v("weight") || v("dims")) {
    const parts = [v("pieces") && `${v("pieces")} pcs`, v("weight") && `${v("weight")} kg`, v("dims")].filter(Boolean);
    if (parts.length === 3) map.set(norm("Pieces / weight / dimensions"), parts.join(" / "));
  }
  return map;
}

// "[ ]" (a checkbox in some templates) is not a placeholder.
export const PLACEHOLDER = /\[(?!\s*\])([^\]\n]+)\]/g;

export function fillText(text: string, lookup: Map<string, string>): string {
  if (lookup.size === 0) return text;
  return text.replace(PLACEHOLDER, (m, name: string) => lookup.get(norm(name)) ?? m);
}

// Splits text into plain / filled / open-placeholder segments for display.
export type Segment = { kind: "text" | "filled" | "open"; text: string; field?: string };
export function segments(text: string, lookup: Map<string, string>): Segment[] {
  const out: Segment[] = [];
  let last = 0;
  for (const m of text.matchAll(PLACEHOLDER)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ kind: "text", text: text.slice(last, i) });
    const filled = lookup.get(norm(m[1]));
    out.push(filled ? { kind: "filled", text: filled, field: m[1] } : { kind: "open", text: m[0] });
    last = i + m[0].length;
  }
  if (last < text.length) out.push({ kind: "text", text: text.slice(last) });
  return out;
}

export function filledCount(values: Values, shipmentOnly = false): number {
  return FIELDS.filter((f) => (!shipmentOnly || !f.profile) && (values[f.key] ?? "").trim()).length;
}
