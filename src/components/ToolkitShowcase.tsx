import { ClipboardCheck, PenLine, Search, Smartphone, Star } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionBadge from "@/components/ui/SectionBadge";

// Real screenshots of the online toolkit (public/images/toolkit/), taken
// with demo shipment data. Regenerate them whenever the toolkit UI changes.

const features = [
  {
    icon: PenLine,
    title: "Fill in once, every template is done",
    text: "Enter reference, parties, cargo, dates and times one time — all 57 emails and AI prompts fill themselves in.",
  },
  { icon: Search, title: "Find anything in seconds", text: "One search across templates, checklists, workflows, Incoterms and IATA codes." },
  { icon: Star, title: "Your daily set, one tap away", text: "Star the templates and checklists you use most and keep them together." },
  { icon: ClipboardCheck, title: "Checklists that tick", text: "Track progress per shipment, then reset for the next one." },
];

function BrowserFrame({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy-800 shadow-premium-lg">
      <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" className="block h-auto w-full" />
    </div>
  );
}

export default function ToolkitShowcase() {
  return (
    <section id="online-toolkit" className="overflow-hidden bg-navy-900 py-24 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionBadge tone="dark">Inside the Toolkit</SectionBadge>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Not a PDF You Scroll Through. A Toolkit That Works With You.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-mist-400">
            Real screenshots of the online toolkit you get right after purchase — on your work PC, laptop and phone.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-14 max-w-6xl">
          <BrowserFrame
            src="/images/toolkit/autofill.webp"
            alt="Email templates in the online toolkit, automatically filled in with the shipment's reference, shipper, cargo and date"
            width={1800}
            height={1125}
          />
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={0.05 * i}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <f.icon className="h-5 w-5 text-ocean-300" aria-hidden />
                <h3 className="mt-3 text-sm font-semibold text-white">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-mist-400">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl items-start gap-6 lg:grid-cols-[1fr_1fr_0.42fr]">
          <Reveal>
            <BrowserFrame
              src="/images/toolkit/shipment-panel.webp"
              alt="The shipment details panel: reference, origin, destination, vessel, cargo, date and time"
              width={1800}
              height={1125}
            />
            <p className="mt-3 text-center text-xs text-mist-400">Shipment details — with quick date and time buttons</p>
          </Reveal>
          <Reveal delay={0.08}>
            <BrowserFrame
              src="/images/toolkit/checklists.webp"
              alt="Operational checklists with ticked items and a progress bar"
              width={1800}
              height={1125}
            />
            <p className="mt-3 text-center text-xs text-mist-400">Checklists that remember your progress</p>
          </Reveal>
          <Reveal delay={0.16} className="mx-auto w-full max-w-[260px] lg:max-w-none">
            <div className="overflow-hidden rounded-[2rem] border-4 border-navy-700 bg-navy-800 shadow-premium-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/toolkit/mobile.webp"
                alt="The online toolkit on a phone, with a filled-in pickup request email"
                width={780}
                height={1688}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
            </div>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-mist-400">
              <Smartphone className="h-3.5 w-3.5" aria-hidden />
              Works on your phone too
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
