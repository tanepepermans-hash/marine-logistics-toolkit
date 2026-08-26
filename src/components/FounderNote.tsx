import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionBadge from "@/components/ui/SectionBadge";

export default function FounderNote() {
  return (
    <section className="bg-mist-50 py-24 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionBadge>Why I Built This</SectionBadge>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            The Toolkit I Wish I&apos;d Had on Day One
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-10 max-w-2xl">
          <div className="rounded-3xl border border-navy-900/10 bg-white p-8 shadow-premium sm:p-10">
            <div className="space-y-4 text-base leading-relaxed text-navy-600">
              <p>
                Most junior marine logistics operators get a booking system login and a &quot;good
                luck&quot; on day one. Nobody hands you the email templates, the checklists, or the
                judgment calls that actually come with the job — you&apos;re expected to pick it up by
                making mistakes on real shipments.
              </p>
              <p>
                I built this toolkit to close that gap: the templates, checklists and AI prompts I
                think every junior operator deserves on their first day, instead of learning them
                the hard way over months.
              </p>
              <p>
                It&apos;s not a theory course, and it doesn&apos;t replace real experience or official
                DG training — it&apos;s the practical starting point I wish existed when I needed it.
              </p>
            </div>
            <div className="mt-7 flex items-center gap-3 border-t border-navy-900/10 pt-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ocean-500/10 text-sm font-bold text-ocean-700">
                TP
              </span>
              <div>
                <div className="text-sm font-semibold text-navy-900">Tane</div>
                <div className="text-xs text-navy-500">Founder, Marine Logistics Operator Toolkit</div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
