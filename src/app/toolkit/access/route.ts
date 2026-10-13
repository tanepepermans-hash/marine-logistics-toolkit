import { NextResponse } from "next/server";
import { clientIp, isRateLimited } from "@/lib/rateLimit";
import { TOOLKIT_COOKIE, TOOLKIT_COOKIE_MAX_AGE, checkToolkitKey } from "@/lib/toolkitAccess";

// The buyer's personal link: /toolkit/access?key=<order id>.
// Verifies the order, remembers it in an httpOnly cookie, and sends the
// buyer on to the toolkit itself — so the key doesn't linger in the address
// bar of the page they're actually reading.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key") ?? "";

  if (isRateLimited(`toolkit-access:${clientIp(request)}`, 20, 10 * 60 * 1000)) {
    return NextResponse.redirect(new URL("/toolkit?error=rate", url), 303);
  }

  const access = await checkToolkitKey(key);
  if (!access.ok) {
    return NextResponse.redirect(new URL("/toolkit?error=invalid", url), 303);
  }

  const response = NextResponse.redirect(new URL("/toolkit", url), 303);
  response.cookies.set(TOOLKIT_COOKIE, key, {
    httpOnly: true,
    secure: url.protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: TOOLKIT_COOKIE_MAX_AGE,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
