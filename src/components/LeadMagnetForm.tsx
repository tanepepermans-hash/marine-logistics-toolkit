"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Mail } from "lucide-react";

const CHECKLIST_URL = "/downloads/emergency-vessel-shipment-checklist.pdf";

type Status = "idle" | "loading" | "success" | "error";

export default function LeadMagnetForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
      window.open(CHECKLIST_URL, "_blank", "noopener");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="mt-5 flex items-center gap-2.5 rounded-lg bg-emerald-500/10 px-3.5 py-3 text-sm font-medium text-emerald-700">
        <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
        <span>
          Sent! Your download should have opened in a new tab —{" "}
          <a href={CHECKLIST_URL} target="_blank" rel="noopener" className="underline">
            click here
          </a>{" "}
          if not.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5">
      <label htmlFor="lead-email" className="text-xs font-semibold uppercase tracking-wide text-ocean-700">
        Get this checklist free
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-400" aria-hidden />
          <input
            id="lead-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full rounded-lg border border-navy-900/15 bg-white py-2.5 pl-10 pr-3 text-sm text-navy-900 placeholder:text-mist-400 focus:border-ocean-500 focus:outline-none focus:ring-2 focus:ring-ocean-500/20"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:cursor-wait disabled:opacity-70"
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            "Send it to me"
          )}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}
      <p className="mt-2 text-[11px] text-mist-400">
        One checklist, no spam. Unsubscribe anytime.
      </p>
    </form>
  );
}
