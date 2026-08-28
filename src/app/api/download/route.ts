import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { tierHasToolkitFile, type TierId } from "@/config/site";
import { verifyCheckoutSession } from "@/lib/stripe";
import { watermarkPdf, watermarkZipPdf } from "@/lib/watermark";

// ---------------------------------------------------------------------------
// Streams the toolkit file for the buyer's tier — but only after
// re-verifying the Stripe Checkout Session server-side. The real files live
// in /private/toolkit (outside /public), so they are never reachable by
// guessing a URL — only through this route, and only for a session Stripe
// confirms as paid.
// ---------------------------------------------------------------------------

const TOOLKIT_DIR = path.join(process.cwd(), "private", "toolkit");

// "dg" has no downloadable file — it unlocks the /dg-training app instead
// (see /api/dg-unlock). "bundle" includes the same Premium toolkit file
// plus DG Training access.
const FILES: Partial<Record<TierId, { path: string; filename: string; contentType: string }>> = {
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
  bundle: {
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
  if (!tierHasToolkitFile(result.tier)) {
    return NextResponse.json(
      { error: "This order doesn't include a downloadable file. Open the DG Training Academy from your order page instead." },
      { status: 400 },
    );
  }

  const { path: filePath, filename, contentType } = FILES[result.tier]!;

  try {
    const file = await fs.readFile(filePath);

    // Stamp the buyer's email into the delivered file so a copy that leaks
    // publicly can be traced back to the order it came from. Falls back to
    // the unwatermarked file if anything goes wrong (a corrupt PDF should
    // never block a paying customer from getting their download).
    let outFile: Uint8Array = new Uint8Array(file);
    if (result.customerEmail) {
      try {
        outFile =
          contentType === "application/zip"
            ? await watermarkZipPdf(file, result.customerEmail)
            : await watermarkPdf(outFile, result.customerEmail);
      } catch {
        outFile = new Uint8Array(file);
      }
    }

    return new NextResponse(outFile, {
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
