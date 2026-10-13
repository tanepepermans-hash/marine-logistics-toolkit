"use client";

import { useEffect, useRef } from "react";
import { CalendarDays, Eraser, X } from "lucide-react";
import { FIELDS, GROUPS, formatDate, isoInDays, type Field, type Values } from "./shipment";

type Props = {
  open: boolean;
  onClose: () => void;
  values: Values;
  onChange: (key: string, value: string) => void;
  onClearShipment: () => void;
};

function DateInput({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  const quick = [
    { label: "Today", days: 0 },
    { label: "Tomorrow", days: 1 },
    { label: "+2 days", days: 2 },
  ];
  return (
    <div>
      <input
        id={`f-${field.key}`}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-navy-900/15 bg-white px-3 py-2 text-sm text-navy-900 focus:border-ocean-500 focus:outline-none"
      />
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        {quick.map((q) => (
          <button
            key={q.label}
            type="button"
            onClick={() => onChange(isoInDays(q.days))}
            className="rounded-full border border-navy-900/10 px-2.5 py-0.5 text-[11px] font-semibold text-navy-600 hover:border-ocean-500 hover:text-ocean-700"
          >
            {q.label}
          </button>
        ))}
        {value && <span className="text-[11px] text-navy-400">Shows as “{formatDate(value)}”</span>}
      </div>
    </div>
  );
}

function TimeInput({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input
        id={`f-${field.key}`}
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-36 rounded-lg border border-navy-900/15 bg-white px-3 py-2 text-sm text-navy-900 focus:border-ocean-500 focus:outline-none"
      />
      {["09:00", "12:00", "17:00"].map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className="rounded-full border border-navy-900/10 px-2.5 py-0.5 text-[11px] font-semibold text-navy-600 hover:border-ocean-500 hover:text-ocean-700"
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export default function ShipmentPanel({ open, onClose, values, onChange, onClearShipment }: Props) {
  const firstInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const frame = window.requestAnimationFrame(() => firstInput.current?.focus());
    return () => {
      window.removeEventListener("keydown", onKey);
      window.cancelAnimationFrame(frame);
    };
  }, [open, onClose]);

  if (!open) return null;

  const firstKey = FIELDS.find((f) => f.type === "text")?.key;
  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-label="Shipment details">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-navy-950/40" />
      <div className="relative flex h-full w-full max-w-md flex-col bg-mist-50 shadow-premium-lg">
        <div className="flex items-start justify-between gap-3 border-b border-navy-900/10 bg-white px-5 py-4">
          <div>
            <h2 className="flex items-center gap-2 text-base font-bold text-navy-900">
              <CalendarDays className="h-4 w-4 text-ocean-600" aria-hidden />
              Shipment details
            </h2>
            <p className="mt-0.5 text-xs text-navy-500">
              Fill in once — every template and AI prompt fills itself in. Saved in this browser only.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1 text-navy-400 hover:bg-mist-100 hover:text-navy-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          {GROUPS.map((g) => (
            <fieldset key={g}>
              <legend className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-navy-500">
                {g === "You" ? "You (kept between shipments)" : g}
              </legend>
              <div className="space-y-3">
                {FIELDS.filter((f) => f.group === g).map((f) => {
                  const value = values[f.key] ?? "";
                  const set = (v: string) => onChange(f.key, v);
                  const isFirst = f.key === firstKey;
                  return (
                    <div key={f.key}>
                      <label htmlFor={`f-${f.key}`} className="mb-1 block text-xs font-semibold text-navy-700">
                        {f.label}
                      </label>
                      {f.type === "date" ? (
                        <DateInput field={f} value={value} onChange={set} />
                      ) : f.type === "time" ? (
                        <TimeInput field={f} value={value} onChange={set} />
                      ) : (
                        <input
                          ref={isFirst ? firstInput : undefined}
                          id={`f-${f.key}`}
                          type="text"
                          value={value}
                          placeholder={f.hint}
                          onChange={(e) => set(e.target.value)}
                          className="w-full rounded-lg border border-navy-900/15 bg-white px-3 py-2 text-sm text-navy-900 placeholder:text-navy-300 focus:border-ocean-500 focus:outline-none"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-navy-900/10 bg-white px-5 py-3.5">
          <button
            type="button"
            onClick={onClearShipment}
            className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/15 px-3.5 py-2 text-xs font-semibold text-navy-700 hover:border-ocean-500 hover:text-ocean-700"
          >
            <Eraser className="h-3.5 w-3.5" aria-hidden />
            New shipment
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-ocean-600 px-5 py-2 text-xs font-semibold text-white hover:bg-ocean-500"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
