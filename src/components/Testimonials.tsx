import { Quote } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionBadge from "@/components/ui/SectionBadge";

const testimonials = [
  {
    quote:
      "In freight forwarding, you regularly need to check information while coordinating shipments and answering customers. I found the Marine Logistics Toolkit useful for those quick checks. The layout is straightforward, and having a central reference helps me spend less time searching and more time dealing with the shipment itself.",
    name: "Thomas De Smet",
    role: "Freight Forwarder",
  },
  {
    quote:
      "I've used the toolkit while working on daily freight forwarding tasks, and I found it easy to navigate. When you're handling several orders at once, being able to quickly find the information you need is helpful. It's a practical resource that I would recommend to colleagues working in operations.",
    name: "Emma Nielsen",
    role: "Logistics Operator",
  },
  {
    quote:
      "What I appreciated most was how accessible the toolkit is. You don't need a long introduction to understand how to use it. I found it helpful as a reference during my working day, especially when I wanted to double-check something before replying to a customer or discussing a shipment with an agent.",
    name: "James Carter",
    role: "Air Freight Coordinator",
  },
  {
    quote:
      "I would have appreciated a resource like this when I first started in freight forwarding. It gives you a convenient place to look things up, and I still found it useful with experience in the industry. I'd be happy to share it with colleagues, particularly those learning the day-to-day side of logistics operations.",
    name: "Oliver Jensen",
    role: "Freight Operations Specialist",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .filter((part) => part.length > 2 || part === part.toUpperCase())
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-white py-24 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionBadge>From Operators</SectionBadge>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            What People in Operations Say
          </h2>
          <p className="mt-4 text-base leading-relaxed text-navy-600">
            Feedback from freight forwarders and operators who used the toolkit in their daily work.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.06}>
              <figure className="flex h-full flex-col rounded-3xl border border-navy-900/10 bg-mist-50 p-7 shadow-premium">
                <Quote className="h-6 w-6 text-ocean-500" aria-hidden />
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-navy-700">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-navy-900/10 pt-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ocean-500/10 text-sm font-bold text-ocean-700">
                    {initials(t.name)}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-navy-900">{t.name}</div>
                    <div className="text-xs text-navy-500">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
