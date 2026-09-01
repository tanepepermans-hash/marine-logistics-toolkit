import { Anchor, CheckCircle2, Mail, Ship, Sparkles } from "lucide-react";

// CSS-built "laptop + floating documents" product mockup for the hero.
// No external image assets required.
export default function ProductMockup() {
  return (
    <div className="relative mx-auto aspect-[6/5] w-full max-w-lg">
      <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-radial-fade blur-2xl" />

      {/* Laptop frame */}
      <div className="absolute left-1/2 top-2 w-[92%] -translate-x-1/2 animate-float rounded-2xl border border-white/10 bg-navy-800 p-2.5 shadow-premium-lg sm:w-[85%]">
        <div className="flex items-center gap-1.5 px-2 pb-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="ml-3 flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-[10px] text-mist-300">
            <Ship className="h-3 w-3 text-ocean-300" aria-hidden />
            operator-toolkit.app/vessel-checklist
          </span>
        </div>
        <div className="rounded-xl bg-mist-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-ocean-400 to-ocean-600">
                <Anchor className="h-4 w-4 text-white" aria-hidden />
              </div>
              <p className="text-xs font-semibold text-navy-900">Vessel Delivery Checklist</p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-700">
              On Track
            </span>
          </div>
          <ul className="space-y-2">
            {[
              "Confirm vessel ETD & cut-off",
              "Verify cargo dimensions & weight",
              "Check DG status before booking",
              "Send onboard delivery instructions",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 rounded-lg bg-white px-3 py-2 shadow-sm">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-ocean-500" aria-hidden />
                <span className="text-[11px] font-medium text-navy-700 sm:text-xs">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Floating email template card */}
      <div className="absolute -left-2 bottom-16 w-40 -rotate-6 rounded-xl border border-white/10 bg-white p-3 shadow-premium sm:-left-6 sm:w-48">
        <div className="mb-2 flex items-center gap-1.5">
          <Mail className="h-3.5 w-3.5 text-ocean-600" aria-hidden />
          <span className="text-[10px] font-semibold text-navy-900">Pickup Request</span>
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-navy-900/10" />
          <div className="h-1.5 w-4/5 rounded-full bg-navy-900/10" />
          <div className="h-1.5 w-full rounded-full bg-navy-900/10" />
          <div className="h-1.5 w-3/5 rounded-full bg-navy-900/10" />
        </div>
      </div>

      {/* Floating AI prompt card */}
      <div className="absolute -right-2 bottom-2 w-44 rotate-6 rounded-xl border border-ocean-400/30 bg-navy-900 p-3 shadow-premium sm:-right-6 sm:w-52">
        <div className="mb-2 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-ocean-300" aria-hidden />
          <span className="text-[10px] font-semibold text-white">AI Operator Prompt</span>
        </div>
        <p className="text-[10px] leading-relaxed text-mist-300">
          &ldquo;Given this shipment data, generate a risk assessment and backup plan…&rdquo;
        </p>
      </div>
    </div>
  );
}
