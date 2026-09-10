import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { siteConfig } from "@/config/site";
import { clientIp, isRateLimited } from "@/lib/rateLimit";

// ---------------------------------------------------------------------------
// On-site AI support chat. Answers from the site's own FAQ/Terms/Refund
// content only — it's explicitly told not to invent order details or
// regulatory advice. There is no human-escalation flow: when it can't help,
// it says so and points to siteConfig.contactEmail as plain information,
// not a form or ticket.
//
// Uses Claude Haiku 4.5 rather than a larger model — this is high-volume,
// low-latency FAQ answering with a small, fixed knowledge base, exactly the
// workload shape that doesn't benefit from a bigger model, and it keeps
// per-conversation cost low for a small storefront.
// ---------------------------------------------------------------------------

const MODEL = "claude-haiku-4-5";
const MAX_HISTORY_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 2000;

const SYSTEM_PROMPT = `You are the on-site support assistant for ${siteConfig.name} (${siteConfig.url}), a website selling a digital toolkit for marine logistics operators, plus a separate DG Training Academy quiz app.

PRODUCT
${siteConfig.name} is a digital, instantly-downloaded reference product: ready-to-use email templates, operational checklists, AI prompts and shipment workflows for junior/trainee marine logistics operators. It is not a course — it's used during daily operations, not studied upfront. It's also useful for experienced operators.

PRICING TIERS (one-time purchase, no subscription, prices in EUR)
- Standard (€${siteConfig.tiers.standard.price}): the toolkit as a single PDF.
- Premium (€${siteConfig.tiers.premium.price}): adds an editable Word doc and an Excel shipment tracker, plus extra advanced templates, delivered as a .zip.
- DG Training Academy (€${siteConfig.tiers.dg.price}): a standalone gamified quiz app covering the 9 UN Dangerous Goods classes, sold on its own.
- Everything Bundle (€${siteConfig.tiers.bundle.price}): Premium + DG Training Academy together, at a discount vs. buying separately.
Delivery is instant after payment via Stripe — a download page appears immediately after checkout, no account or app install needed.

DG TRAINING ACADEMY
A gamified web app (XP, streaks, quizzes) to help operators learn DG hazard classes. It is explicitly a study aid, not an official or regulatory Dangerous Goods certification — it does not replace IATA DGR, ADR or IMDG Code training, or a company's own DG procedures. The toolkit also includes a DG pre-check reference, same disclaimer applies.

REFUND POLICY
As an EU digital product delivered instantly, the 14-day right of withdrawal is waived once the buyer confirms this at checkout (a required checkbox) and downloads/accesses the materials. That said, the seller has a goodwill policy: a buyer who emails within 14 days of purchase explaining why the product wasn't what they expected gets every request reviewed individually, and a refund if reasonable. Checkout/technical problems (charged but never got access, broken download link, a failed payment that still charged the card) are always fixed or refunded in full, no waiting period, no exception.

LICENSE
Personal, non-transferable use. No redistribution or resale. Team licensing is available on request via email.

WHAT YOU MUST NOT DO
- Never invent or guess the status of a specific order, payment, or download link — you have no access to order data. If someone asks about a specific purchase problem, say you can't look up individual orders, and give them the contact email below to reach a person, along with any generic troubleshooting that's actually documented (e.g. "check your spam folder for the receipt", "the download link expires 30 days after purchase").
- Never give dangerous goods, customs, legal or regulatory advice as if it were authoritative — always frame DG/customs answers as general and point to qualified professionals / official regulations (IATA DGR / ADR / IMDG Code) for real decisions.
- Never promise a refund yourself — say refunds are reviewed individually via email, per the policy above.
- Don't make up features, prices, or policies not stated above.

CONTACT
If you genuinely can't help (order-specific issues, anything outside what's described above), tell the visitor to email ${siteConfig.contactEmail} — mention this plainly as information, don't frame it as filling out a form or opening a ticket.

STYLE
Be concise, friendly and direct — 2-4 sentences for most answers. This is a chat widget, not an email.`;

export async function POST(request: Request) {
  // Every message here is a real, billed Claude API call — rate limit more
  // tightly than the free-to-run routes elsewhere in this app.
  if (isRateLimited(`support-chat:${clientIp(request)}`, 15, 10 * 60_000)) {
    return NextResponse.json(
      { error: "Too many messages. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "The support chat isn't configured yet. Set ANTHROPIC_API_KEY in your environment." },
      { status: 501 },
    );
  }

  let history: Anthropic.MessageParam[];
  try {
    const body = await request.json();
    if (!Array.isArray(body?.messages)) throw new Error("invalid");
    history = body.messages
      .filter((m: unknown): m is Anthropic.MessageParam => {
        if (typeof m !== "object" || m === null) return false;
        const { role, content } = m as { role?: unknown; content?: unknown };
        return (role === "user" || role === "assistant") && typeof content === "string";
      })
      .slice(-MAX_HISTORY_MESSAGES)
      .map((m: Anthropic.MessageParam) => ({
        role: m.role,
        content: String(m.content).slice(0, MAX_MESSAGE_LENGTH),
      }));
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (history.length === 0 || history[history.length - 1].role !== "user") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: history,
    });

    const text = response.content.find((block) => block.type === "text")?.text ?? "";
    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error("Support chat error:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Couldn't reach the assistant right now. Please try again in a moment." },
      { status: 502 },
    );
  }
}
