import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { KeyRound, Mail } from "lucide-react";
import raw from "@/content/toolkit-content.json";
import type { RawToolkitContent, ToolkitContent } from "@/content/types";
import ToolkitApp from "@/components/toolkit/ToolkitApp";
import { siteConfig } from "@/config/site";
import { MAX_DEVICES, getToolkitAccess } from "@/lib/toolkitAccess";

export const metadata: Metadata = {
  title: `Your Toolkit | ${siteConfig.name}`,
  robots: { index: false, follow: false },
};

// Always rendered per request: the content depends on who is asking.
export const dynamic = "force-dynamic";

function contentFor(premium: boolean): ToolkitContent {
  const { premium: extra, ...base } = raw as RawToolkitContent;
  if (!premium) return { ...base, premiumCategoryName: null, premiumChecklistName: null };
  return {
    ...base,
    emailCategories: [...base.emailCategories, extra.emailCategory],
    checklists: [...base.checklists, extra.checklist],
    premiumCategoryName: extra.emailCategory.name,
    premiumChecklistName: extra.checklist.name,
  };
}

export default async function ToolkitPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const access = await getToolkitAccess();

  if (!access.ok) {
    const { error } = await searchParams;
    return <NoAccess reason={error ?? access.reason} />;
  }

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const proto = h.get("x-forwarded-proto") ?? "https";
  const personalLink = `${proto}://${host}/toolkit/access?key=${encodeURIComponent(access.key)}`;

  return (
    <ToolkitApp
      content={contentFor(access.premium)}
      email={access.email}
      premium={access.premium}
      personalLink={personalLink}
      downloadHref={`/api/download?session_id=${encodeURIComponent(access.key)}`}
      downloadLabel={access.tier === "standard" ? "Download PDF version" : "Download PDF + Word + Excel (.zip)"}
      supportEmail={siteConfig.contactEmail}
    />
  );
}

const MESSAGES: Record<string, string> = {
  rate: "Too many attempts from this connection. Please wait a few minutes and try your link again.",
  invalid: "We couldn't confirm the order behind this link. Check that you used the full link from your order page.",
  "not-toolkit": "This order is for the DG Training Academy only — it doesn't include the operator toolkit.",
  suspended: "Access for this order has been suspended. If you think this is a mistake, please contact support.",
  devices: `This toolkit licence is already in use on ${MAX_DEVICES} devices — the maximum for one person. If you got a new device, contact support and we'll reset it for you. For colleagues, ask us about a team licence.`,
  expired: "This access link can no longer be used on a new device (it's valid for 30 days after purchase). Contact support with your order email and we'll help you out.",
  device: "This browser isn't registered for this toolkit licence. Open your personal access link again on this device.",
};

function NoAccess({ reason }: { reason: string }) {
  const message =
    MESSAGES[reason] ??
    "Open the toolkit with the personal link from your order confirmation page — it unlocks the toolkit in this browser.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-900 px-6 py-20">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center shadow-premium-lg">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ocean-500/10 text-ocean-300">
          <KeyRound className="h-7 w-7" aria-hidden />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-white">Your Operator Toolkit</h1>
        <p className="mt-3 text-sm leading-relaxed text-mist-300">{message}</p>
        <a
          href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent("Toolkit access link")}`}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
        >
          <Mail className="h-4 w-4" aria-hidden />
          Lost your link? Email support
        </a>
        <Link href="/" className="mt-4 inline-block text-xs text-mist-500 underline">
          Back to the website
        </Link>
      </div>
    </main>
  );
}
