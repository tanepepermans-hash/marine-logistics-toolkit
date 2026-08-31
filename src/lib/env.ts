// Some environment-variable UIs (bulk .env pastes especially) can leave a
// stray non-ASCII character on a value — a "smart quote", non-breaking
// space, or zero-width character copied in from elsewhere — invisible in
// the dashboard, but enough to make `fetch` throw a hard-to-diagnose
// "Cannot convert argument to a ByteString" error when it's used in a
// header, or to break an HMAC comparison outright. Stripe keys and price
// IDs are always plain ASCII, so strip anything outside printable ASCII
// rather than just trimming whitespace at the edges. Read secrets and IDs
// through this instead of `process.env` directly.
export function cleanEnv(name: string): string | undefined {
  const value = process.env[name];
  if (!value) return undefined;
  const cleaned = value.replace(/[^\x20-\x7E]/g, "").trim();
  return cleaned.length > 0 ? cleaned : undefined;
}
