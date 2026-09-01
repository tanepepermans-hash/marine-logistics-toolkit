import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import Features from "@/components/Features";
import ScenarioExample from "@/components/ScenarioExample";
import HowItWorks from "@/components/HowItWorks";
import Audience from "@/components/Audience";
import ProductPreview from "@/components/ProductPreview";
import Bonus from "@/components/Bonus";
import DgTraining from "@/components/DgTraining";
import Pricing from "@/components/Pricing";
import TrustSection from "@/components/TrustSection";
import FounderNote from "@/components/FounderNote";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/site";

// Product/Offer structured data — lets search engines show price and
// availability directly in results instead of just a plain blue link.
function ProductJsonLd() {
  const products = Object.values(siteConfig.tiers).map((tier) => ({
    "@type": "Product",
    name: `${siteConfig.name} — ${tier.name}`,
    description: siteConfig.tagline,
    offers: {
      "@type": "Offer",
      price: tier.price,
      priceCurrency: siteConfig.currency,
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/#pricing`,
    },
  }));

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(products) }}
    />
  );
}

export default function Home() {
  return (
    <>
      <ProductJsonLd />
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <Features />
        <ScenarioExample />
        <HowItWorks />
        <Audience />
        <ProductPreview />
        <Bonus />
        <DgTraining />
        <Pricing />
        <TrustSection />
        <FounderNote />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
