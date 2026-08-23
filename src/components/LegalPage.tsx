import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";

export default function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="bg-mist-50 py-20">
        <Container className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">{title}</h1>
          <div className="prose-legal mt-8 space-y-5 text-sm leading-relaxed text-navy-700">
            {children}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
