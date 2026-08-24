import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import Container from "@/components/ui/Container";
import { verifyCheckoutSession } from "@/lib/stripe";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Your Download | ${siteConfig.name}`,
  robots: { index: false, follow: false },
};

// Stripe redirects buyers here after checkout (success_url in
// src/app/api/checkout/route.ts). The session is re-verified server-side
// before showing a download link — this page is never publicly linked.
export default async function DownloadPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id ?? "";
  const result = await verifyCheckoutSession(sessionId);

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-900 px-6 py-20">
      <Container className="max-w-lg">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center shadow-premium-lg">
          {result.ok ? (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="h-7 w-7" aria-hidden />
              </div>
              <h1 className="mt-6 text-2xl font-bold text-white">
                Thanks — your order is confirmed
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-mist-300">
                {result.customerEmail ? `A receipt was sent to ${result.customerEmail}. ` : ""}
                Your{" "}
                {result.tier === "premium"
                  ? "Marine Logistics Operator Toolkit — Premium (PDF + editable Word templates + Excel shipment tracker)"
                  : "Marine Logistics Operator Toolkit"}{" "}
                is ready to download below.
              </p>
              <a
                href={`/api/download?session_id=${encodeURIComponent(sessionId)}`}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-ocean-400 to-ocean-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]"
              >
                {result.tier === "premium" ? "Download Premium Bundle (.zip)" : "Download Toolkit (PDF)"}
              </a>
              <p className="mt-4 text-xs text-mist-500">
                Trouble downloading? Contact{" "}
                <a className="underline" href={`mailto:${siteConfig.contactEmail}`}>
                  {siteConfig.contactEmail}
                </a>
                .
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                <AlertTriangle className="h-7 w-7" aria-hidden />
              </div>
              <h1 className="mt-6 text-2xl font-bold text-white">
                We couldn&apos;t confirm this order
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-mist-300">{result.reason}</p>
              <Link
                href="/#pricing"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
              >
                Back to pricing
              </Link>
              <p className="mt-4 text-xs text-mist-500">
                Already paid? Contact{" "}
                <a className="underline" href={`mailto:${siteConfig.contactEmail}`}>
                  {siteConfig.contactEmail}
                </a>{" "}
                and we&apos;ll sort it out.
              </p>
            </>
          )}
        </div>
      </Container>
    </main>
  );
}
