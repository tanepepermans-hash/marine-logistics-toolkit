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
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
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
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
