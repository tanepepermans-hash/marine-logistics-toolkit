import { Mail } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionBadge from "@/components/ui/SectionBadge";
import CheckoutButton from "@/components/CheckoutButton";

// One full, real template shown in the clear — not a locked preview. Proves
// the writing quality (real fields, ready to send) before anyone pays,
// instead of asking for trust on a titles-only preview grid.
const SAMPLE_SUBJECT = "Pickup Request – [Shipper Name] – Ref [Shipment Ref]";
const SAMPLE_BODY = `Hi [Contact Name],

Could you please arrange pickup for the shipment below?

Shipper: [Shipper Name]
Pickup address: [Full Pickup Address]
Delivery address: [Full Delivery Address]
Ready date: [Date]
Pieces / Weight / Dimensions: [Pieces] / [Weight] kg / [L x W x H cm]
Reference: [Shipment Ref]

Please confirm the pickup date and driver ETA once scheduled.

Thanks,
[Your Name]`;

export default function FreeTemplateSample() {
  return (
    <section className="bg-mist-50 py-24 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionBadge>Try Before You Buy</SectionBadge>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            See a Real Template, in Full
          </h2>
          <p className="mt-4 text-base leading-relaxed text-navy-600">
            No signup, no locked preview — this is one complete template exactly as it appears in the toolkit. The
            other 48 follow the same standard.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-12 max-w-xl">
          <div className="overflow-hidden rounded-3xl border border-navy-900/10 bg-white shadow-premium">
            <div className="flex items-center gap-3 border-b border-navy-900/10 bg-navy-900 px-6 py-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ocean-500/20 text-ocean-300">
                <Mail size={16} />
              </span>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-ocean-300">
                  Pickup Requests — Standard Pickup Request
                </div>
                <div className="text-xs text-mist-400">Subject: {SAMPLE_SUBJECT}</div>
              </div>
            </div>
            <pre className="whitespace-pre-wrap px-6 py-6 font-sans text-[13.5px] leading-relaxed text-navy-700">
              {SAMPLE_BODY}
            </pre>
          </div>

          <div className="mt-6 flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-navy-500">
              Real fields like <code className="rounded bg-navy-900/5 px-1.5 py-0.5 text-navy-700">[Cut-off Time]</code> and{" "}
              <code className="rounded bg-navy-900/5 px-1.5 py-0.5 text-navy-700">[Vessel ETD]</code> — copy, fill in,
              send. Every other template in the toolkit follows this same standard.
            </p>
            <CheckoutButton
              label="Get All 49 Templates — €29"
              tier="standard"
              variant="primary"
              size="md"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
