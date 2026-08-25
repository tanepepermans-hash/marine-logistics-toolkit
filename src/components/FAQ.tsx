"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionBadge from "@/components/ui/SectionBadge";
import { siteConfig } from "@/config/site";

const faqs = [
  {
    question: "Is this a logistics course?",
    answer: "No. It is a practical reference toolkit designed to be used during daily operations.",
  },
  {
    question: "Is it suitable for beginners?",
    answer: "Yes. It is primarily designed for trainees and junior operators.",
  },
  {
    question: "What format will I receive?",
    answer: "Digital downloadable resources.",
  },
  {
    question: "Does this replace dangerous goods training?",
    answer:
      "No. The toolkit's DG pre-check, and the separate DG Training Academy quiz app, are both operational/educational aids — neither replaces formal, accredited DG certification or your company's DG procedures.",
  },
  {
    question: "Can I get DG Training Academy without the rest of the toolkit?",
    answer:
      "Yes — it's sold on its own for operators who just want the DG quiz app, or bundled with Toolkit Premium at a discount if you want both.",
  },
  {
    question: "Can experienced operators use it?",
    answer:
      "Yes. The email templates, workflows, checklists and AI prompts can still be useful for experienced operators.",
  },
  {
    question: "Is this a subscription?",
    answer: "No. It is a one-time purchase.",
  },
  {
    question: "Can companies purchase it for their teams?",
    answer: `Yes. Team licensing can be requested separately — contact ${siteConfig.contactEmail}.`,
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-mist-50 py-24 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionBadge>FAQ</SectionBadge>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-12 max-w-2xl divide-y divide-navy-900/10 rounded-2xl border border-navy-900/10 bg-white shadow-sm">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-sm font-semibold text-navy-900 sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-ocean-600 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>
                <div
                  className={`grid overflow-hidden transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-navy-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
