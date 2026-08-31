// Some environment-variable UIs (bulk .env pastes especially) can leave a
// stray trailing newline or space on a value — invisible in the UI, but
// enough to break an Authorization header or an HMAC comparison outright.
// Read secrets and IDs through this instead of `process.env` directly.
export function cleanEnv(name: string): string | undefined {
  const value = process.env[name];
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
