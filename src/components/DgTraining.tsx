import { Brain, Flame, RotateCcw, ShieldAlert, TrendingUp, Zap } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import CheckoutButton from "@/components/CheckoutButton";
import HazardLabel from "@/dg/components/HazardLabel";
import { siteConfig } from "@/config/site";

const highlights = [
  { icon: Brain, label: "All 9 UN hazard classes, every division" },
  { icon: ShieldAlert, label: "162 practice questions, 7 quiz modes + a guided Course Path" },
  { icon: RotateCcw, label: "Missed questions come back more often (spaced repetition)" },
  { icon: TrendingUp, label: "XP, levels, streaks & per-class accuracy tracking" },
];

const previewClasses = ["3", "8", "9", "2.1", "6.1", "5.1"] as const;

export default function DgTraining() {
  return (
    <section id="dg-training-academy" className="bg-navy-950 py-24 sm:py-28">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-amber-300">
              <ShieldAlert className="h-3.5 w-3.5" aria-hidden />
              New: DG Training Academy
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Learn to Recognize Dangerous Goods Labels — Until It&apos;s Automatic
            </h2>
            <p className="mt-5 text-base leading-relaxed text-mist-400">
              A gamified training app for the operators who actually handle DG shipments: see a
              hazard label, name the class, get the explanation, repeat. Built alongside the
              toolkit for the same warehouse and freight-forwarding teams — and available on its
              own or bundled in.
            </p>

            <ul className="mt-7 space-y-3">
              {highlights.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm text-mist-200">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-300">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CheckoutButton
                label={`Get DG Training — ${siteConfig.currencySymbol}${siteConfig.tiers.dg.price}`}
                tier="dg"
                variant="primary"
                size="md"
                className="!bg-gradient-to-b !from-amber-300 !to-amber-500 !text-amber-950 !shadow-none hover:!from-amber-200 hover:!to-amber-400"
              />
              <a
                href="#pricing"
                className="text-sm font-semibold text-mist-300 underline decoration-mist-500 underline-offset-4 hover:text-white"
              >
                Or get it in the Everything Bundle
              </a>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-mist-500">
              An educational study aid — not a substitute for official IATA DGR, ADR or IMDG Code
              certification.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-navy-900 p-6 shadow-premium-lg sm:p-8">
              <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm font-bold text-white">DG Training Academy</p>
                  <p className="text-xs text-mist-500">Visual Recognition mode</p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold text-amber-300">
                  <Zap className="h-3 w-3" aria-hidden fill="currentColor" />
                  +10 XP
                </span>
              </div>

              <p className="mb-4 text-center text-xs font-medium text-mist-400">
                Which Dangerous Goods class is this?
              </p>
              <div className="grid grid-cols-3 gap-3">
                {previewClasses.map((id) => (
                  <div
                    key={id}
                    className="flex items-center justify-center rounded-xl border border-white/10 bg-navy-950/60 p-2.5"
                  >
                    <HazardLabel classId={id} size={64} />
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl bg-white/5 px-4 py-2.5 text-xs">
                <span className="flex items-center gap-1.5 text-mist-300">
                  <Flame className="h-3.5 w-3.5 text-amber-400" aria-hidden />
                  7 day streak
                </span>
                <span className="font-semibold text-white">Level 3 · DG Operator</span>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
