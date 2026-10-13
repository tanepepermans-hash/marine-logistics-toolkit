import { NextResponse } from "next/server";
import { clientIp, isRateLimited } from "@/lib/rateLimit";
import {
  COOKIE_MAX_AGE,
  DEVICE_COOKIE,
  TOOLKIT_COOKIE,
  claimToolkit,
  isPlausibleDeviceId,
  newDeviceId,
} from "@/lib/toolkitAccess";

// The buyer's personal link: /toolkit/access?key=<order id>.
// Verifies the order, registers this browser against the order's device
// limit, remembers both in httpOnly cookies, and sends the buyer on to the
// toolkit — so the key doesn't linger in the address bar.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key") ?? "";

  if (isRateLimited(`toolkit-access:${clientIp(request)}`, 20, 10 * 60 * 1000)) {
    return NextResponse.redirect(new URL("/toolkit?error=rate", url), 303);
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  const existing = /(?:^|;\s*)toolkit_device=([^;]+)/.exec(cookieHeader)?.[1] ?? "";
  const deviceId = isPlausibleDeviceId(existing) ? existing : newDeviceId();
  // Vercel sets this from the visitor's IP; "??" locally or elsewhere.
  const country = (request.headers.get("x-vercel-ip-country") ?? "??").replace(/[^A-Z?]/g, "").slice(0, 2) || "??";

  const access = await claimToolkit(key, deviceId, country);

  const cookieOpts = {
    httpOnly: true,
    secure: url.protocol === "https:",
    sameSite: "lax" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };

  const response = NextResponse.redirect(
    new URL(access.ok ? "/toolkit" : `/toolkit?error=${access.reason}`, url),
    303,
  );
  // Keep the device id even on refusal, so retrying from the same browser
  // doesn't count as yet another new device.
  response.cookies.set(DEVICE_COOKIE, deviceId, cookieOpts);
  if (access.ok) response.cookies.set(TOOLKIT_COOKIE, key, cookieOpts);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
