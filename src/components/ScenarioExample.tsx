"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Anchor, Box, Calendar, MapPin, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionBadge from "@/components/ui/SectionBadge";

const shipmentData = [
  { icon: Anchor, label: "Vessel", value: "Antwerp" },
  { icon: Calendar, label: "ETD", value: "Tomorrow 12:00" },
  { icon: MapPin, label: "Cargo Location", value: "Amsterdam" },
  { icon: Box, label: "Cargo Details", value: "3 boxes / 78 kg" },
  { icon: ShieldCheck, label: "DG Status", value: "Non-DG" },
];

const actionPlan = [
  "Confirm actual vessel ETD",
  "Confirm cargo availability",
  "Check customs status",
  "Contact vessel agent",
  "Compare direct truck vs air/courier",
  "Confirm onboard delivery deadline",
  "Prepare backup next-port option",
];

export default function ScenarioExample() {
  const [revealed, setRevealed] = useState(false);

  return (
    <section className="bg-mist-50 py-24 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionBadge>See It In Action</SectionBadge>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            From Shipment Problem to Action Plan
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-12 max-w-4xl">
          <div className="overflow-hidden rounded-3xl border border-navy-900/10 bg-white shadow-premium-lg">
            <div className="grid gap-0 lg:grid-cols-2">
              <div className="border-b border-navy-900/10 bg-navy-900 p-7 sm:p-9 lg:border-b-0 lg:border-r">
                <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ocean-300">
                  Shipment Snapshot
                </p>
                <dl className="space-y-4">
                  {shipmentData.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between gap-4 border-b border-white/[0.06] pb-4 last:border-0 last:pb-0">
                      <dt className="flex items-center gap-2.5 text-sm text-mist-400">
                        <Icon className="h-4 w-4 text-ocean-400" aria-hidden />
                        {label}
                      </dt>
                      <dd className="text-sm font-semibold text-white">{value}</dd>
                    </div>
                  ))}
                </dl>

                <button
                  type="button"
                  onClick={() => setRevealed((v) => !v)}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-ocean-400 to-ocean-600 px-5 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.99]"
                >
                  <Wand2 className="h-4 w-4" aria-hidden />
                  {revealed ? "Hide Action Plan" : "Generate Action Plan"}
                </button>
              </div>

              <div className="p-7 sm:p-9">
                <p className="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ocean-600">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  Operational Response
                </p>

                <motion.ol className="space-y-3">
                  {actionPlan.map((step, i) => (
                    <motion.li
                      key={step}
                      initial={{ opacity: 0, x: -8 }}
                      animate={
                        revealed || i < 2
                          ? { opacity: 1, x: 0 }
                          : { opacity: 0.35, x: 0 }
                      }
                      transition={{ duration: 0.35, delay: revealed ? i * 0.08 : 0 }}
                      className="flex items-start gap-3 rounded-xl bg-navy-900/[0.03] px-4 py-3"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ocean-500/15 text-xs font-bold text-ocean-700">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium leading-snug text-navy-800">{step}</span>
                    </motion.li>
                  ))}
                </motion.ol>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mx-auto mt-8 max-w-2xl text-center">
          <p className="text-base text-navy-600">
            This is the type of practical decision support included throughout the toolkit.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
