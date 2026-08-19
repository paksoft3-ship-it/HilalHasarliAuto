import type { NextConfig } from "next";

// Content Security Policy — allows GTM/GA4, Microsoft Clarity, Cloudflare Turnstile,
// WhatsApp Graph, Vercel Blob client uploads, and remote/data images (next/image
// + CMS media). Pragmatic (script 'unsafe-inline' for GTM); tighten with nonces
// later if needed.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googletagmanager.com https://*.google-analytics.com https://*.clarity.ms https://challenges.cloudflare.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://googleads.g.doubleclick.net https://www.google.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.google-analytics.com https://*.googletagmanager.com https://*.clarity.ms https://c.bing.com https://graph.facebook.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://googleads.g.doubleclick.net https://www.google.com https://vercel.com https://blob.vercel-storage.com https://*.public.blob.vercel-storage.com",
  "frame-src 'self' https://www.googletagmanager.com https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Vercel's Image Optimization quota for this account is exhausted, and the
    // optimizer answers /_next/image with HTTP 402, which blanks every image on
    // the site including the logo. Serving the files directly keeps the site
    // visually intact and costs no quota.
    //
    // Trade-off: no automatic resizing or format conversion, so the source
    // files are shipped as-is. Re-enable optimization (drop `unoptimized` and
    // restore `formats`) once the plan is upgraded or the quota resets — and
    // prefer webp alone over avif+webp, since each extra format multiplies the
    // number of billable transformations.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
