import { NextResponse } from "next/server";
import { tierUnlocksDg } from "@/config/site";
import { verifyCheckoutSession } from "@/lib/stripe";

// ---------------------------------------------------------------------------
// Confirms a Stripe Checkout Session paid for a tier that includes DG
// Training Academy access ("dg" or "bundle"). Called client-side by the
// /dg-training app when it's opened with a ?claim=<session_id> link (the
// success_url a buyer lands on after paying for the "dg" or "bundle" tier).
// The app then stores the unlock in its own localStorage state — there is
// no user account, so this check only ever runs once, right after payment.
// ---------------------------------------------------------------------------

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id") ?? "";

  const result = await verifyCheckoutSession(sessionId);
  if (!result.ok) {
    return NextResponse.json({ unlocked: false, error: result.reason }, { status: 403 });
  }
  if (!tierUnlocksDg(result.tier)) {
    return NextResponse.json(
      { unlocked: false, error: "This order doesn't include DG Training Academy access." },
      { status: 403 },
    );
  }

  return NextResponse.json({ unlocked: true, tier: result.tier });
}
