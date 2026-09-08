import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";
import SectionBadge from "@/components/ui/SectionBadge";
import LandedCostEstimator from "@/components/tools/LandedCostEstimator";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Import Cost Calculator — Landed Cost Estimator | ${siteConfig.name}`,
  description:
    "Estimate your total import cost in 30 seconds — product value, freight, import duty and VAT in one landed cost estimate.",
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "Is this exact?",
    a: "No — it's a fast estimate using an average duty rate for your product category, not your exact HS code. For the real number, compare actual quotes or check the HS-code-specific rate with a customs broker.",
  },
  {
    q: "What's an HS code, and why don't you ask for it?",
    a: "It's the code that sets your exact duty rate. We skip it on purpose to keep this to 30 seconds — most duty-rate errors actually come from a wrong HS code, so a rough category average is often just as informative for a first estimate.",
  },
  {
    q: "Does this work for EU-origin shipments too?",
    a: "Yes — select \"Within the EU\" and duty and import VAT both drop out, since intra-EU trade isn't subject to customs declarations.",
  },
  {
    q: "What happens to what I enter?",
    a: "Nothing — the calculation runs entirely in your browser. Nothing you type here is sent anywhere.",
  },
];

export default function LandedCostPage() {
  return (
    <>
      <Navbar />
      <main className="bg-navy-900 py-16 sm:py-20">
        <Container className="max-w-5xl">
          <SectionBadge>Free tool</SectionBadge>
          <h1 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
            What does importing actually cost?
          </h1>
          <p className="mt-4 max-w-2xl text-mist-300">
            Estimate your total import cost in 30 seconds — product value, freight, import duty
            and VAT in one landed cost estimate.
          </p>

          <div className="mt-10">
            <LandedCostEstimator />
          </div>

          <div className="mt-14 max-w-2xl">
            <h2 className="text-lg font-bold text-white">Questions</h2>
            <div className="mt-4 divide-y divide-white/10 border-y border-white/10">
              {FAQ.map((item) => (
                <div key={item.q} className="py-4">
                  <p className="font-semibold text-white">{item.q}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-mist-300">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-10 max-w-2xl text-sm text-mist-400">
            Already have quotes from a forwarder?{" "}
            <Link href="/tools/quote-comparison" className="text-ocean-300 underline hover:text-ocean-200">
              Compare them and see the real landed cost per unit
            </Link>
            .
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}
