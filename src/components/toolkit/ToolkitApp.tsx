"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Anchor,
  BookOpen,
  Check,
  ClipboardCheck,
  Copy,
  Download,
  GitBranch,
  Link2,
  Mail,
  PenLine,
  Send,
  Star,
  RotateCcw,
  Rocket,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import type { Checklist, CodeRegion, EmailTemplate, Prompt, Term, ToolkitContent, Workflow } from "@/content/types";
import ShipmentPanel from "./ShipmentPanel";
import { FIELDS, buildLookup, fillText, filledCount, formatDate, segments, type Values } from "./shipment";

type SectionId = "start" | "favorites" | "emails" | "checklists" | "workflows" | "prompts" | "reference";

const SECTIONS: { id: SectionId; label: string; icon: typeof Mail }[] = [
  { id: "start", label: "Start here", icon: Rocket },
  { id: "favorites", label: "Favourites", icon: Star },
  { id: "emails", label: "Email templates", icon: Mail },
  { id: "checklists", label: "Checklists", icon: ClipboardCheck },
  { id: "workflows", label: "Problem workflows", icon: GitBranch },
  { id: "prompts", label: "AI prompts", icon: Sparkles },
  { id: "reference", label: "Reference", icon: BookOpen },
];

type Props = {
  content: ToolkitContent;
  email: string | null;
  premium: boolean;
  personalLink: string;
  downloadHref: string;
  downloadLabel: string;
  supportEmail: string;
};

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers / non-secure contexts: fall back to a hidden textarea.
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function CopyButton({ text, label, primary = false }: { text: string; label: string; primary?: boolean }) {
  const [state, setState] = useState<"idle" | "done" | "fail">("idle");
  return (
    <button
      type="button"
      onClick={async () => {
        const ok = await copyText(text);
        setState(ok ? "done" : "fail");
        window.setTimeout(() => setState("idle"), 1800);
      }}
      className={
        primary
          ? "inline-flex items-center gap-1.5 rounded-full bg-ocean-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-ocean-500"
          : "inline-flex items-center gap-1.5 rounded-full border border-navy-900/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-navy-700 transition-colors hover:border-ocean-500 hover:text-ocean-700"
      }
    >
      {state === "done" ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
      {state === "done" ? "Copied" : state === "fail" ? "Copy failed" : label}
    </button>
  );
}

// Shared state the cards read: the auto-fill lookup and the favourites.
type Ctx = { lookup: Map<string, string>; favs: string[]; toggleFav: (id: string) => void };
const ToolkitCtx = createContext<Ctx>({ lookup: new Map(), favs: [], toggleFav: () => {} });
const useToolkit = () => useContext(ToolkitCtx);

// Shows text with its [Placeholder] fields: filled-in values in green (from
// the shipment details), still-open fields highlighted in blue.
function WithPlaceholders({ text }: { text: string }) {
  const { lookup } = useToolkit();
  return (
    <>
      {segments(text, lookup).map((seg, i) =>
        seg.kind === "filled" ? (
          <mark key={i} title={`Filled in: ${seg.field}`} className="rounded bg-emerald-500/10 px-0.5 font-semibold text-emerald-800">
            {seg.text}
          </mark>
        ) : seg.kind === "open" ? (
          <mark key={i} className="rounded bg-ocean-500/10 px-0.5 font-semibold text-ocean-700">
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </>
  );
}

function FavButton({ id, label }: { id: string; label: string }) {
  const { favs, toggleFav } = useToolkit();
  const on = favs.includes(id);
  return (
    <button
      type="button"
      onClick={() => toggleFav(id)}
      aria-pressed={on}
      aria-label={on ? `Remove ${label} from favourites` : `Add ${label} to favourites`}
      title={on ? "Remove from favourites" : "Add to favourites"}
      className={`shrink-0 rounded-full p-1.5 transition-colors ${on ? "text-amber-500 hover:bg-amber-50" : "text-navy-300 hover:bg-mist-100 hover:text-amber-500"}`}
    >
      <Star className="h-4 w-4" fill={on ? "currentColor" : "none"} aria-hidden />
    </button>
  );
}

// A faint, repeating "licensed to <email>" pattern laid over the toolkit, so
// any screenshot or photo of it carries the buyer's own name. It sits above
// the content with pointer-events off, so it never blocks clicks or
// selection, and it's light enough not to get in the way of reading.
function watermarkUrl(label: string) {
  const esc = label.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  // Tile sized to the text so long email addresses aren't clipped.
  const w = Math.max(420, Math.round(label.length * 9.5) + 200);
  const h = Math.round(w * 0.6);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><text x="${w / 2}" y="${h / 2}" text-anchor="middle" dominant-baseline="middle" transform="rotate(-24 ${w / 2} ${h / 2})" font-family="Inter, system-ui, sans-serif" font-size="14" font-weight="600" fill="#11253f" fill-opacity="0.085">${esc}</text></svg>`;
  return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;
}

function matches(q: string, ...fields: string[]) {
  return fields.some((f) => f.toLowerCase().includes(q));
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold tracking-tight text-navy-900">{title}</h2>
      <p className="mt-1.5 text-sm text-navy-500">{desc}</p>
    </div>
  );
}

function Card({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <div id={id} className="scroll-mt-24 rounded-2xl border border-navy-900/10 bg-white p-5 shadow-sm sm:p-6">
      {children}
    </div>
  );
}

function PremiumTag() {
  return (
    <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
      Premium
    </span>
  );
}

// ---------------------------------------------------------------------------
// Building blocks per content type
// ---------------------------------------------------------------------------

function EmailCard({ t }: { t: EmailTemplate }) {
  const { lookup } = useToolkit();
  const subject = fillText(t.subject, lookup);
  const body = fillText(t.body, lookup);
  const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return (
    <Card id={slug(t.title)}>
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-navy-900">{t.title}</h4>
        <FavButton id={`email:${t.title}`} label={t.title} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-mist-50 px-3.5 py-2.5 text-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-navy-500">Subject</span>
        <span className="min-w-0 flex-1 break-words text-navy-800">
          <WithPlaceholders text={t.subject} />
        </span>
      </div>
      <pre className="mt-3 whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-navy-700">
        <WithPlaceholders text={t.body} />
      </pre>
      <div className="mt-4 flex flex-wrap gap-2 border-t border-navy-900/5 pt-4">
        <CopyButton primary text={body} label="Copy email" />
        <CopyButton text={subject} label="Copy subject" />
        <a
          href={mailto}
          className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-navy-700 transition-colors hover:border-ocean-500 hover:text-ocean-700"
        >
          <Send className="h-3.5 w-3.5" aria-hidden />
          Open in mail app
        </a>
      </div>
    </Card>
  );
}

function PromptCard({ p }: { p: Prompt }) {
  const { lookup } = useToolkit();
  return (
    <Card id={slug(p.title)}>
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-navy-900">{p.title}</h4>
        <FavButton id={`prompt:${p.title}`} label={p.title} />
      </div>
      <pre className="mt-3 whitespace-pre-wrap break-words rounded-xl bg-mist-50 p-4 font-sans text-sm leading-relaxed text-navy-700">
        <WithPlaceholders text={p.prompt} />
      </pre>
      <div className="mt-4">
        <CopyButton primary text={fillText(p.prompt, lookup)} label="Copy prompt" />
      </div>
    </Card>
  );
}

function WorkflowCard({ w }: { w: Workflow }) {
  return (
    <Card id={slug(w.trigger)}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">When this happens</p>
          <h4 className="mt-1 font-semibold text-navy-900">{w.trigger}</h4>
        </div>
        <FavButton id={`workflow:${w.trigger}`} label={w.trigger} />
      </div>
      <ol className="mt-4 space-y-3">
        {w.steps.map((s, i) => (
          <li key={s} className="flex gap-3 text-sm text-navy-700">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ocean-500/10 text-xs font-bold text-ocean-700">
              {i + 1}
            </span>
            <span className="pt-0.5">{s}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}

function storageGet(key: string): string[] {
  try {
    const v = window.localStorage.getItem(key);
    return v ? (JSON.parse(v) as string[]) : [];
  } catch {
    return [];
  }
}
function storageSet(key: string, value: string[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode etc. — ticking still works for this visit */
  }
}

function TickList({
  id,
  title,
  items,
  extra,
  favId,
}: {
  id: string;
  title: string;
  items: string[];
  extra?: ReactNode;
  favId?: string;
}) {
  const storageKey = `toolkit-check:${id}`;
  const [done, setDone] = useState<string[]>([]);
  // Read saved ticks after hydration (the server can't see localStorage).
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setDone(storageGet(storageKey)));
    return () => window.cancelAnimationFrame(frame);
  }, [storageKey]);

  const toggle = (item: string) => {
    setDone((prev) => {
      const next = prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item];
      storageSet(storageKey, next);
      return next;
    });
  };
  const reset = () => {
    setDone([]);
    storageSet(storageKey, []);
  };
  const count = items.filter((i) => done.includes(i)).length;
  const pct = items.length ? Math.round((count / items.length) * 100) : 0;

  return (
    <Card id={slug(title)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-semibold text-navy-900">{title}</h4>
          {extra}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className="text-xs font-semibold text-navy-500">
            {count}/{items.length}
          </span>
          {favId && <FavButton id={favId} label={title} />}
        </div>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-mist-100">
        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <ul className="mt-4 space-y-1">
        {items.map((item) => {
          const checked = done.includes(item);
          return (
            <li key={item}>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5 hover:bg-mist-50">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(item)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-600"
                />
                <span className={`text-sm leading-snug ${checked ? "text-navy-400 line-through" : "text-navy-700"}`}>
                  {item}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 flex flex-wrap gap-2 border-t border-navy-900/5 pt-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/15 px-3.5 py-1.5 text-xs font-semibold text-navy-700 hover:border-ocean-500 hover:text-ocean-700"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          Reset for next shipment
        </button>
        <CopyButton text={items.map((i) => `☐ ${i}`).join("\n")} label="Copy as list" />
      </div>
    </Card>
  );
}

function TermList({ title, terms }: { title: string; terms: Term[] }) {
  if (!terms.length) return null;
  return (
    <Card>
      <h4 className="font-semibold text-navy-900">{title}</h4>
      <dl className="mt-3 divide-y divide-navy-900/5">
        {terms.map((t) => (
          <div key={t.term} className="grid gap-1 py-2.5 sm:grid-cols-[200px_1fr] sm:gap-4">
            <dt className="text-sm font-semibold text-navy-900">{t.term}</dt>
            <dd className="text-sm text-navy-600">{t.definition}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

function CodeTable({ title, regions }: { title: string; regions: CodeRegion[] }) {
  if (!regions.length) return null;
  return (
    <Card>
      <h4 className="font-semibold text-navy-900">{title}</h4>
      <div className="mt-3 space-y-5">
        {regions.map((r) => (
          <div key={r.region}>
            <div className="text-xs font-semibold uppercase tracking-wider text-navy-500">{r.region}</div>
            <div className="mt-2 grid gap-x-6 gap-y-1 sm:grid-cols-2">
              {r.codes.map((c) => (
                <div key={c.code + c.name} className="flex gap-3 py-1 text-sm">
                  <span className="w-10 shrink-0 font-mono font-semibold text-ocean-700">{c.code}</span>
                  <span className="text-navy-700">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Airline codes with the 3-digit AWB prefix, so a pre-alert's AWB can be
// matched to its airline at a glance. The most-used carriers come first.
function CarrierTable({ regions, mostUsed, showTop }: { regions: CodeRegion[]; mostUsed: string[]; showTop: boolean }) {
  if (!regions.length) return null;
  const all = regions.flatMap((r) => r.codes);
  const top = mostUsed.map((c) => all.find((e) => e.code === c)).filter((e): e is NonNullable<typeof e> => !!e);
  const isTop = (code: string) => mostUsed.includes(code);
  return (
    <Card>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h4 className="font-semibold text-navy-900">Air carrier codes &amp; AWB prefixes</h4>
        <p className="text-xs text-navy-500">
          An AWB number is the prefix + 8 digits, e.g. <span className="font-mono text-navy-700">074-46522965</span> = KLM ·{" "}
          <span className="inline-block h-2 w-2 rounded-full bg-ocean-500 align-middle" aria-hidden="true" /> most used
        </p>
      </div>

      {showTop && top.length > 0 && (
        <div className="mt-4 rounded-xl bg-ocean-500/5 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-ocean-700">Most used</div>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
            {top.map((c) => (
              <li key={c.code} className="rounded-lg border border-navy-900/5 bg-white px-3 py-2">
                <div className="flex items-baseline justify-between gap-2 font-mono">
                  <span className="text-lg font-semibold text-navy-900">{c.code}</span>
                  <span className="text-ocean-700">{c.prefix}</span>
                </div>
                <div className="truncate text-xs text-navy-600">{c.name}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 grid gap-x-8 gap-y-6 md:grid-cols-2">
        {regions.map((r) => (
          <div key={r.region} className="min-w-0">
            <table className="w-full text-sm">
              <caption className="border-b border-navy-900/15 pb-2 text-left text-xs font-semibold uppercase tracking-wider text-navy-500">
                {r.region}
              </caption>
              <thead className="sr-only">
                <tr>
                  <th scope="col">Code</th>
                  <th scope="col">AWB prefix</th>
                  <th scope="col">Airline</th>
                </tr>
              </thead>
              <tbody>
                {r.codes.map((c) => (
                  <tr key={c.code + c.name} className="border-b border-navy-900/5 last:border-0">
                    <td className="w-12 py-1.5 font-mono font-semibold text-navy-900">{c.code}</td>
                    <td className="w-14 py-1.5 font-mono text-ocean-700">{c.prefix ?? "—"}</td>
                    <td className="py-1.5 text-navy-700">
                      {c.name}
                      {isTop(c.code) && (
                        <span className="ml-2 inline-block h-2 w-2 rounded-full bg-ocean-500 align-middle" title="Most used">
                          <span className="sr-only">(most used)</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </Card>
  );
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const v = window.localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode — still works for this visit */
  }
}

// The strip at the top of the email and prompt sections: what's filled in,
// and the way into the shipment details.
function AutofillBar({ values, onOpen }: { values: Values; onOpen: () => void }) {
  const n = filledCount(values, true);
  const v = (k: string) => (values[k] ?? "").trim();
  const summary = [
    v("ref"),
    v("origin") && v("destination") ? `${v("origin")} → ${v("destination")}` : v("origin") || v("destination"),
    v("customer"),
    v("date") && formatDate(v("date")),
  ].filter(Boolean);
  return (
    <div
      className={`mb-6 flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
        n ? "border-emerald-500/25 bg-emerald-50" : "border-ocean-500/25 bg-ocean-500/5"
      }`}
    >
      <div className="flex items-start gap-3">
        <PenLine className={`mt-0.5 h-5 w-5 shrink-0 ${n ? "text-emerald-600" : "text-ocean-600"}`} aria-hidden />
        <div className="text-sm">
          {n ? (
            <>
              <span className="font-semibold text-navy-900">Auto-fill on — {n} shipment field{n === 1 ? "" : "s"} filled in.</span>
              {summary.length > 0 && <span className="block text-navy-600">{summary.join(" · ")}</span>}
            </>
          ) : (
            <>
              <span className="font-semibold text-navy-900">Fill in your shipment once.</span>
              <span className="block text-navy-600">
                Reference, parties, cargo, dates — every template below fills itself in, ready to copy.
              </span>
            </>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onOpen}
        className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold text-white ${n ? "bg-emerald-600 hover:bg-emerald-500" : "bg-ocean-600 hover:bg-ocean-500"}`}
      >
        {n ? "Edit shipment details" : "Fill in shipment details"}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main app
// ---------------------------------------------------------------------------

export default function ToolkitApp({
  content,
  email,
  premium,
  personalLink,
  downloadHref,
  downloadLabel,
  supportEmail,
}: Props) {
  const [section, setSection] = useState<SectionId>("start");
  const [query, setQuery] = useState("");
  const [values, setValues] = useState<Values>({});
  const [favs, setFavs] = useState<string[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);

  // Shipment details and favourites live in this browser's storage. Read
  // after hydration, since the server can't see localStorage.
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setValues(readJson<Values>("toolkit-shipment", {}));
      setFavs(readJson<string[]>("toolkit-favs", []));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const setField = useCallback((key: string, value: string) => {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      writeJson("toolkit-shipment", next);
      return next;
    });
  }, []);
  const clearShipment = useCallback(() => {
    setValues((prev) => {
      const next: Values = {};
      for (const f of FIELDS) if (f.profile && prev[f.key]) next[f.key] = prev[f.key];
      writeJson("toolkit-shipment", next);
      return next;
    });
  }, []);
  const toggleFav = useCallback((id: string) => {
    setFavs((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      writeJson("toolkit-favs", next);
      return next;
    });
  }, []);
  const lookup = useMemo(() => buildLookup(values), [values]);
  const ctx = useMemo(() => ({ lookup, favs, toggleFav }), [lookup, favs, toggleFav]);
  const openPanel = useCallback(() => setPanelOpen(true), []);
  const closePanel = useCallback(() => setPanelOpen(false), []);
  const shipmentFilled = filledCount(values, true);
  const q = query.trim().toLowerCase();

  // Keep the open section in the URL hash, so a refresh or a bookmark
  // lands in the same place.
  useEffect(() => {
    const onHash = () => {
      const fromHash = window.location.hash.slice(1) as SectionId;
      if (SECTIONS.some((s) => s.id === fromHash)) setSection(fromHash);
    };
    // Deferred to a frame so the server-rendered markup hydrates first.
    const frame = window.requestAnimationFrame(onHash);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);
  const go = useCallback((id: SectionId) => {
    setSection(id);
    setQuery("");
    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top: 0 });
  }, []);

  const filtered = useMemo(() => {
    const emails = content.emailCategories
      .map((c) => ({ ...c, templates: c.templates.filter((t) => !q || matches(q, c.name, t.title, t.subject, t.body)) }))
      .filter((c) => c.templates.length);
    const checklists = content.checklists.filter((c) => !q || matches(q, c.name, ...c.items));
    const workflows = content.workflows.filter((w) => !q || matches(q, w.trigger, ...w.steps));
    const prompts = content.prompts.filter((p) => !q || matches(q, p.title, p.prompt));
    const glossary = content.glossary.filter((t) => !q || matches(q, t.term, t.definition));
    const incoterms = content.incoterms.filter((t) => !q || matches(q, t.term, t.definition));
    const codes = (rs: CodeRegion[]) =>
      rs
        .map((r) => ({ ...r, codes: r.codes.filter((c) => !q || matches(q, c.code, c.prefix ?? "", c.name)) }))
        .filter((r) => r.codes.length);
    return {
      emails,
      checklists,
      workflows,
      prompts,
      glossary,
      incoterms,
      carriers: codes(content.airCarrierCodes),
      airports: codes(content.airportCodes),
    };
  }, [content, q]);

  const templateCount = content.emailCategories.reduce((n, c) => n + c.templates.length, 0);
  const counts: Partial<Record<SectionId, number>> = {
    emails: templateCount,
    checklists: content.checklists.length,
    workflows: content.workflows.length,
    prompts: content.prompts.length,
    favorites: favs.length || undefined,
  };

  const favItems = {
    emails: content.emailCategories.flatMap((c) => c.templates).filter((t) => favs.includes(`email:${t.title}`)),
    checklists: content.checklists.filter((c) => favs.includes(`checklist:${c.name}`)),
    workflows: content.workflows.filter((w) => favs.includes(`workflow:${w.trigger}`)),
    prompts: content.prompts.filter((p) => favs.includes(`prompt:${p.title}`)),
  };

  const searching = q.length > 0;
  const show = (id: SectionId) => (searching ? id !== "start" && id !== "favorites" : section === id);
  const resultCount =
    filtered.emails.reduce((n, c) => n + c.templates.length, 0) +
    filtered.checklists.length +
    filtered.workflows.length +
    filtered.prompts.length +
    filtered.glossary.length +
    filtered.incoterms.length +
    filtered.carriers.reduce((n, r) => n + r.codes.length, 0) +
    filtered.airports.reduce((n, r) => n + r.codes.length, 0);

  const isPremiumChecklist = (c: Checklist) => c.name === content.premiumChecklistName;

  const watermark = useMemo(
    () => watermarkUrl(email ? `Licensed to ${email}` : "Licensed copy — personal use only"),
    [email],
  );

  return (
    <ToolkitCtx.Provider value={ctx}>
    <div className="min-h-screen bg-mist-50">
      <ShipmentPanel
        open={panelOpen}
        onClose={closePanel}
        values={values}
        onChange={setField}
        onClearShipment={clearShipment}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-20 select-none print:fixed"
        style={{ backgroundImage: watermark, backgroundRepeat: "repeat" }}
      />
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-navy-900">
        <div className="mx-auto flex max-w-8xl items-center gap-4 px-4 py-3 sm:px-6">
          <button type="button" onClick={() => go("start")} className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-ocean-400 to-ocean-600">
              <Anchor className="h-4 w-4 text-white" aria-hidden />
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-sm font-bold text-white">Operator Toolkit</span>
              <span className="block text-[11px] text-mist-400">{premium ? "Premium" : "Standard"} edition</span>
            </span>
          </button>
          <div className="relative min-w-0 flex-1 sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-400" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates, checklists, codes…"
              aria-label="Search the toolkit"
              className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-9 text-sm text-white placeholder:text-mist-500 focus:border-ocean-400 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-mist-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={openPanel}
            className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
          >
            <PenLine className="h-4 w-4 text-ocean-300" aria-hidden />
            <span className="hidden sm:inline">Shipment details</span>
            {shipmentFilled > 0 && (
              <span className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                {shipmentFilled}
              </span>
            )}
          </button>
        </div>
        {/* Mobile section tabs */}
        <nav className="flex gap-1 overflow-x-auto px-4 pb-2.5 lg:hidden" aria-label="Sections">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => go(s.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                !searching && section === s.id ? "bg-ocean-600 text-white" : "text-mist-300 hover:bg-white/5"
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="mx-auto flex max-w-8xl gap-8 px-4 py-8 sm:px-6">
        {/* Desktop sidebar */}
        <aside className="sticky top-24 hidden h-fit w-60 shrink-0 lg:block">
          <nav className="space-y-1" aria-label="Sections">
            {SECTIONS.map((s) => {
              const active = !searching && section === s.id;
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => go(s.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    active ? "bg-white text-navy-900 shadow-sm" : "text-navy-600 hover:bg-white/60"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-ocean-600" : "text-navy-400"}`} aria-hidden />
                  <span className="flex-1">{s.label}</span>
                  {counts[s.id] !== undefined && <span className="text-xs text-navy-400">{counts[s.id]}</span>}
                </button>
              );
            })}
          </nav>
          <a
            href={downloadHref}
            className="mt-6 flex items-center gap-2 rounded-xl border border-navy-900/10 px-3 py-2.5 text-xs font-medium text-navy-600 hover:bg-white"
          >
            <Download className="h-4 w-4 text-navy-400" aria-hidden />
            {downloadLabel}
          </a>
        </aside>

        <main className="min-w-0 flex-1 space-y-10">
          {searching && (
            <p className="text-sm text-navy-600">
              {resultCount} result{resultCount === 1 ? "" : "s"} for <strong>&ldquo;{query.trim()}&rdquo;</strong>
            </p>
          )}

          {/* START */}
          {show("start") && (
            <section className="space-y-6">
              <div className="rounded-3xl bg-navy-900 p-7 text-white shadow-premium sm:p-9">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ocean-300">Welcome aboard</p>
                <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Your Marine Logistics Operator Toolkit</h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mist-300">
                  Everything is here and searchable. Enter your shipment details once and every template fills itself
                  in — copy, send. Star the ones you use most, and checklists remember what you ticked in this browser.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-4">
                  {[
                    { n: templateCount, l: "Email templates", id: "emails" as const },
                    { n: content.checklists.length, l: "Checklists", id: "checklists" as const },
                    { n: content.workflows.length, l: "Workflows", id: "workflows" as const },
                    { n: content.prompts.length, l: "AI prompts", id: "prompts" as const },
                  ].map((s) => (
                    <button
                      key={s.l}
                      type="button"
                      onClick={() => go(s.id)}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-colors hover:bg-white/10"
                    >
                      <div className="text-2xl font-bold">{s.n}</div>
                      <div className="text-xs text-mist-400">{s.l}</div>
                    </button>
                  ))}
                </div>
              </div>

              <AutofillBar values={values} onOpen={openPanel} />

              <Card>
                <div className="flex items-start gap-3">
                  <Link2 className="mt-0.5 h-5 w-5 shrink-0 text-ocean-600" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-navy-900">Bookmark your personal access link</h3>
                    <p className="mt-1 text-sm text-navy-600">
                      Your licence covers up to 3 of your own devices (for example work PC, laptop and phone).
                      Open this link once on each of them within 30 days of purchase — they then stay signed in.
                      The link is tied to your order: once 3 devices are registered, it won&apos;t open anywhere
                      else. For colleagues, ask about a team licence.
                    </p>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                      <code className="min-w-0 flex-1 truncate rounded-lg bg-mist-50 px-3 py-2 text-xs text-navy-700">
                        {personalLink}
                      </code>
                      <CopyButton primary text={personalLink} label="Copy link" />
                    </div>
                  </div>
                </div>
              </Card>

              <div>
                <h3 className="mb-3 text-lg font-bold text-navy-900">Your first month</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {content.quickStart.map((p) => (
                    <Card key={p.phase}>
                      <h4 className="font-semibold text-navy-900">{p.phase}</h4>
                      <ul className="mt-3 space-y-2">
                        {p.steps.map((s) => (
                          <li key={s} className="flex gap-2 text-sm text-navy-600">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-ocean-500" aria-hidden />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  ))}
                </div>
              </div>

              <TickList
                id="emergency"
                title="Emergency Vessel Shipment Checklist"
                items={content.emergencyChecklist.flatMap((g) => g.items.map((i) => `${g.category}: ${i}`))}
              />

              <a
                href={downloadHref}
                className="flex items-center gap-2 text-sm font-medium text-navy-600 underline-offset-4 hover:text-ocean-700 hover:underline lg:hidden"
              >
                <Download className="h-4 w-4" aria-hidden />
                {downloadLabel}
              </a>
            </section>
          )}

          {/* FAVOURITES */}
          {show("favorites") && (
            <section>
              <SectionHeader
                title="Your favourites"
                desc="Tap the star on any template, checklist, workflow or prompt to keep it here. Saved in this browser."
              />
              {favs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-navy-900/15 p-10 text-center text-sm text-navy-500">
                  <Star className="mx-auto mb-3 h-6 w-6 text-amber-400" aria-hidden />
                  No favourites yet. Star the templates you use every day and they&apos;ll be waiting here.
                </div>
              ) : (
                <div className="space-y-8">
                  {favItems.emails.length > 0 && (
                    <>
                      <AutofillBar values={values} onOpen={openPanel} />
                      <div className="grid gap-4 xl:grid-cols-2">
                        {favItems.emails.map((t) => (
                          <EmailCard key={t.title} t={t} />
                        ))}
                      </div>
                    </>
                  )}
                  {favItems.checklists.length > 0 && (
                    <div className="grid gap-4 xl:grid-cols-2">
                      {favItems.checklists.map((c) => (
                        <TickList key={c.name} id={slug(c.name)} title={c.name} items={c.items} favId={`checklist:${c.name}`} />
                      ))}
                    </div>
                  )}
                  {favItems.workflows.length > 0 && (
                    <div className="grid gap-4 xl:grid-cols-2">
                      {favItems.workflows.map((w) => (
                        <WorkflowCard key={w.trigger} w={w} />
                      ))}
                    </div>
                  )}
                  {favItems.prompts.length > 0 && (
                    <div className="grid gap-4 xl:grid-cols-2">
                      {favItems.prompts.map((p) => (
                        <PromptCard key={p.title} p={p} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* EMAILS */}
          {show("emails") && filtered.emails.length > 0 && (
            <section>
              <SectionHeader
                title="Email templates"
                desc="Ready-to-send messages for daily operations. Green = filled in from your shipment, blue = still to fill in."
              />
              <AutofillBar values={values} onOpen={openPanel} />
              <div className="space-y-8">
                {filtered.emails.map((c) => (
                  <div key={c.name}>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-navy-500">
                      {c.name}
                      {c.name === content.premiumCategoryName && <PremiumTag />}
                    </h3>
                    <div className="grid gap-4 xl:grid-cols-2">
                      {c.templates.map((t) => (
                        <EmailCard key={t.title} t={t} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CHECKLISTS */}
          {show("checklists") && filtered.checklists.length > 0 && (
            <section>
              <SectionHeader
                title="Operational checklists"
                desc="Tick items as you go — your progress is saved in this browser until you reset it."
              />
              <div className="grid gap-4 xl:grid-cols-2">
                {filtered.checklists.map((c) => (
                  <TickList
                    key={c.name}
                    id={slug(c.name)}
                    title={c.name}
                    items={c.items}
                    favId={`checklist:${c.name}`}
                    extra={isPremiumChecklist(c) ? <PremiumTag /> : undefined}
                  />
                ))}
              </div>
            </section>
          )}

          {/* WORKFLOWS */}
          {show("workflows") && filtered.workflows.length > 0 && (
            <section>
              <SectionHeader
                title="Shipment problem workflows"
                desc="Step-by-step decision paths for when a shipment goes off track."
              />
              <div className="grid gap-4 xl:grid-cols-2">
                {filtered.workflows.map((w) => (
                  <WorkflowCard key={w.trigger} w={w} />
                ))}
              </div>
            </section>
          )}

          {/* PROMPTS */}
          {show("prompts") && filtered.prompts.length > 0 && (
            <section>
              <SectionHeader
                title="AI operator prompts"
                desc="Paste into any AI assistant — the fields you've entered are filled in for you."
              />
              <AutofillBar values={values} onOpen={openPanel} />
              <div className="grid gap-4 xl:grid-cols-2">
                {filtered.prompts.map((p) => (
                  <PromptCard key={p.title} p={p} />
                ))}
              </div>
            </section>
          )}

          {/* REFERENCE */}
          {show("reference") &&
            filtered.glossary.length + filtered.incoterms.length + filtered.carriers.length + filtered.airports.length > 0 && (
              <section>
                <SectionHeader
                  title="Reference"
                  desc="Glossary, Incoterms and the carrier and airport codes you look up every day."
                />
                <div className="space-y-4">
                  <TermList title="Glossary" terms={filtered.glossary} />
                  <TermList title="Incoterms® 2020 at a glance" terms={filtered.incoterms} />
                  <CarrierTable regions={filtered.carriers} mostUsed={content.airCarrierMostUsed ?? []} showTop={!searching} />
                  <CodeTable title="Airport codes (IATA)" regions={filtered.airports} />
                </div>
              </section>
            )}

          {searching && resultCount === 0 && (
            <div className="rounded-2xl border border-dashed border-navy-900/15 p-10 text-center text-sm text-navy-500">
              Nothing matches &ldquo;{query.trim()}&rdquo;. Try a shorter word, like &ldquo;delay&rdquo; or &ldquo;DG&rdquo;.
            </div>
          )}

          <footer className="border-t border-navy-900/10 pt-6 text-xs leading-relaxed text-navy-400">
            {email ? <>Licensed to {email} — single-user licence, up to 3 devices. </> : <>Single-user licence, up to 3 devices. </>}
            Sharing your access link or redistributing the content isn&apos;t permitted and can lead to access being
            suspended. Team licences are available on request. Questions?{" "}
            <a className="underline" href={`mailto:${supportEmail}`}>
              {supportEmail}
            </a>
            <br />
            An operational reference — always confirm DG, customs and regulatory requirements with the carrier,
            authorities or a qualified professional.
          </footer>
        </main>
      </div>
    </div>
    </ToolkitCtx.Provider>
  );
}
