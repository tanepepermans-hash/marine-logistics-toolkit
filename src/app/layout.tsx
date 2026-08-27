import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// -----------------------------------------------------------------------
// SEO metadata — edit title/description/OG copy here.
// -----------------------------------------------------------------------
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Marine Logistics Operator Toolkit | Vessel Logistics Templates & Checklists",
  description:
    "Practical marine logistics toolkit with email templates, operational checklists, AI prompts and vessel shipment workflows for trainees and junior operators — plus a standalone Dangerous Goods (DG) Training Academy quiz app.",
  keywords: [
    "marine logistics toolkit",
    "vessel logistics checklist",
    "freight forwarding templates",
    "shipping coordinator resources",
    "logistics operator training",
    "dangerous goods training app",
    "DG training quiz",
    "IATA DGR practice questions",
    "hazard label training",
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Marine Logistics Operator Toolkit | Vessel Logistics Templates & Checklists",
    description:
      "Practical marine logistics toolkit with email templates, operational checklists, AI prompts and vessel shipment workflows for trainees and junior operators.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marine Logistics Operator Toolkit",
    description:
      "Email templates, checklists, AI prompts and workflows for marine logistics operators.",
  },
  robots:
    process.env.NEXT_PUBLIC_DEMO_MODE === "true"
      ? { index: false, follow: false }
      : { index: true, follow: true },
};

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-navy-900 font-sans text-mist-100 antialiased">
        {isDemoMode && (
          <div className="sticky top-0 z-[60] bg-amber-400 px-4 py-1.5 text-center text-xs font-semibold text-navy-950">
            Internal demo — everything is unlocked for preview. Not for sale on this URL.
          </div>
        )}
        {children}
      </body>
    </html>
  );
}
