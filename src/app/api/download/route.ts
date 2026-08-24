import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import type { TierId } from "@/config/site";
import { verifyCheckoutSession } from "@/lib/stripe";

// ---------------------------------------------------------------------------
// Streams the toolkit file for the buyer's tier — but only after
// re-verifying the Stripe Checkout Session server-side. The real files live
// in /private/toolkit (outside /public), so they are never reachable by
// guessing a URL — only through this route, and only for a session Stripe
// confirms as paid.
// ---------------------------------------------------------------------------

const TOOLKIT_DIR = path.join(process.cwd(), "private", "toolkit");

const FILES: Record<TierId, { path: string; filename: string; contentType: string }> = {
  standard: {
    path: path.join(TOOLKIT_DIR, "marine-logistics-operator-toolkit.pdf"),
    filename: "Marine-Logistics-Operator-Toolkit.pdf",
    contentType: "application/pdf",
  },
  premium: {
    path: path.join(TOOLKIT_DIR, "marine-logistics-operator-toolkit-premium.zip"),
    filename: "Marine-Logistics-Operator-Toolkit-Premium.zip",
    contentType: "application/zip",
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id") ?? "";

  const result = await verifyCheckoutSession(sessionId);
  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 403 });
  }

  const { path: filePath, filename, contentType } = FILES[result.tier];

  try {
    const file = await fs.readFile(filePath);
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "The toolkit file isn't available yet. Contact support and we'll send it directly." },
      { status: 500 },
    );
  }
}
