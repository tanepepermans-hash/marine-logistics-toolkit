import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { verifyCheckoutSession } from "@/lib/stripe";

// ---------------------------------------------------------------------------
// Streams the toolkit PDF — but only after re-verifying the Stripe Checkout
// Session server-side. The real file lives in /private/toolkit (outside
// /public), so it is never reachable by guessing a URL — only through this
// route, and only for a session Stripe confirms as paid.
// ---------------------------------------------------------------------------

const TOOLKIT_FILE = path.join(
  process.cwd(),
  "private",
  "toolkit",
  "marine-logistics-operator-toolkit.pdf",
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id") ?? "";

  const result = await verifyCheckoutSession(sessionId);
  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 403 });
  }

  try {
    const file = await fs.readFile(TOOLKIT_FILE);
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Marine-Logistics-Operator-Toolkit.pdf"',
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
