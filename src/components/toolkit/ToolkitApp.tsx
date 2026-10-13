"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
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
  RotateCcw,
  Rocket,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import type { Checklist, CodeRegion, EmailTemplate, Term, ToolkitContent } from "@/content/types";

type SectionId = "start" | "emails" | "checklists" | "workflows" | "prompts" | "reference";

const SECTIONS: { id: SectionId; label: string; icon: typeof Mail }[] = [
  { id: "start", label: "Start here", icon: Rocket },
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

// Highlights [Placeholder] fields so they're easy to spot and fill in.
function WithPlaceholders({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]\n]+\])/g);
  return (
    <>
      {parts.map((part, i) =>
        /^\[[^\]\n]+\]$/.test(part) ? (
          <mark key={i} className="rounded bg-ocean-500/10 px-0.5 font-semibold text-ocean-700">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
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
  return (
    <Card id={slug(t.title)}>
      <h4 className="font-semibold text-navy-900">{t.title}</h4>
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
        <CopyButton primary text={t.body} label="Copy email" />
        <CopyButton text={t.subject} label="Copy subject" />
      </div>
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

function TickList({ id, title, items, extra }: { id: string; title: string; items: string[]; extra?: ReactNode }) {
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
        <span className="shrink-0 text-xs font-semibold text-navy-500">
          {count}/{items.length}
        </span>
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
        .map((r) => ({ ...r, codes: r.codes.filter((c) => !q || matches(q, c.code, c.name)) }))
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
  };

  const searching = q.length > 0;
  const show = (id: SectionId) => (searching ? id !== "start" : section === id);
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

  return (
    <div className="min-h-screen bg-mist-50">
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
                  Everything is here and searchable. Open a template, fill in the highlighted{" "}
                  <span className="rounded bg-white/10 px-1 font-semibold text-ocean-200">[fields]</span>, copy, send.
                  Checklists remember what you ticked in this browser — reset them for the next shipment.
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

              <Card>
                <div className="flex items-start gap-3">
                  <Link2 className="mt-0.5 h-5 w-5 shrink-0 text-ocean-600" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-navy-900">Bookmark your personal access link</h3>
                    <p className="mt-1 text-sm text-navy-600">
                      Use this link to open your toolkit on your other devices within 30 days of purchase — after
                      that, this browser stays signed in and support can send you a fresh link. It&apos;s tied to
                      your order, so please keep it to yourself.
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

          {/* EMAILS */}
          {show("emails") && filtered.emails.length > 0 && (
            <section>
              <SectionHeader
                title="Email templates"
                desc="Ready-to-send messages for daily operations. Highlighted fields are the ones to fill in."
              />
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
                  <Card key={w.trigger} id={slug(w.trigger)}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">When this happens</p>
                    <h4 className="mt-1 font-semibold text-navy-900">{w.trigger}</h4>
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
                ))}
              </div>
            </section>
          )}

          {/* PROMPTS */}
          {show("prompts") && filtered.prompts.length > 0 && (
            <section>
              <SectionHeader
                title="AI operator prompts"
                desc="Paste into any AI assistant together with your shipment details."
              />
              <div className="grid gap-4 xl:grid-cols-2">
                {filtered.prompts.map((p) => (
                  <Card key={p.title} id={slug(p.title)}>
                    <h4 className="font-semibold text-navy-900">{p.title}</h4>
                    <pre className="mt-3 whitespace-pre-wrap break-words rounded-xl bg-mist-50 p-4 font-sans text-sm leading-relaxed text-navy-700">
                      <WithPlaceholders text={p.prompt} />
                    </pre>
                    <div className="mt-4">
                      <CopyButton primary text={p.prompt} label="Copy prompt" />
                    </div>
                  </Card>
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
                  <CodeTable title="Air carrier codes (IATA)" regions={filtered.carriers} />
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
            {email ? <>Licensed to {email} for personal use. </> : <>Licensed for personal use. </>}
            Please don&apos;t share your access link or redistribute the content. Questions?{" "}
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
  );
}
