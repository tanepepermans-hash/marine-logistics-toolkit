/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Prevents the site being loaded in an <iframe> on another
          // domain — the classic building block of a clickjacking attack
          // (e.g. an invisible iframe over the real checkout button).
          { key: "X-Frame-Options", value: "DENY" },
          // Stops the browser guessing a file's content type from its
          // content instead of the declared Content-Type header.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Don't leak the full URL (which can include query params) to
          // third-party sites linked from this one.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Checkout is a redirect to Stripe's own hosted page (no
          // embedded Stripe.js), so script/style/connect can stay
          // scoped to this origin — nothing here needs to load or
          // execute third-party JS.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data:",
              "font-src 'self' data:",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          // Explicitly deny browser features this site never uses.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
