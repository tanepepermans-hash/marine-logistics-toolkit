import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";
import SectionBadge from "@/components/ui/SectionBadge";
import QuoteComparisonTool from "@/components/tools/QuoteComparisonTool";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Freight Quote Comparison Tool | ${siteConfig.name}`,
  description:
    "Compare multiple freight quotes side by side and see the real landed cost per unit — not just the headline freight rate.",
};

export default function QuoteComparisonPage() {
  return (
    <>
      <Navbar />
      <main className="bg-navy-900 py-16 sm:py-20">
        <Container className="max-w-8xl">
          <SectionBadge>Free tool</SectionBadge>
          <h1 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
            Freight quote comparison
          </h1>
          <p className="mt-4 max-w-2xl text-mist-300">
            Enter every cost component separately, even if a forwarder quoted them together —
            that&apos;s how you catch what&apos;s missing from a competing quote. This tool ranks
            quotes by landed cost per unit, the same logic as the spreadsheet in the toolkit.
          </p>

          <div className="mt-10">
            <QuoteComparisonTool />
          </div>

          <p className="mt-10 max-w-2xl text-sm text-mist-400">
            Don&apos;t have quotes yet?{" "}
            <Link href="/tools/landed-cost" className="text-ocean-300 underline hover:text-ocean-200">
              Get a rough import cost estimate first
            </Link>
            .
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}
