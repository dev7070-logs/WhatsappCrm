import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Baseline security headers applied to every response.
 *
 * The Content-Security-Policy is ENFORCED (it used to ship as
 * Report-Only). It is built from the environment so it allows exactly
 * the origins this deployment uses and nothing more:
 *   - your Supabase project (NEXT_PUBLIC_SUPABASE_URL) for REST,
 *     realtime websockets, storage images and media;
 *   - Cloudflare Turnstile only when NEXT_PUBLIC_TURNSTILE_SITE_KEY
 *     is set (the optional CAPTCHA on the auth forms).
 * 'unsafe-eval' is added in development only (React dev tooling and
 * HMR need it); production builds don't.
 *
 * The rest of the headers are straight blocks:
 *   - HSTS: only meaningful on HTTPS (no-op on http://localhost).
 *   - X-Content-Type-Options / X-Frame-Options / Referrer-Policy:
 *     baseline OWASP hardening, no behavioural cost.
 *   - Cross-Origin-Opener-Policy: isolates our window from pages it
 *     opens or that open it (Google sign-in is a full redirect, so
 *     no popup relationship is needed).
 *   - Permissions-Policy: we don't use camera / geolocation / etc, so
 *     deny them. A supply-chain compromise or a forgotten plugin
 *     can't silently opt back in.
 */
const IS_DEV = process.env.NODE_ENV !== "production";

function originOf(url: string | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

const SUPABASE_ORIGIN = originOf(process.env.NEXT_PUBLIC_SUPABASE_URL);
const SUPABASE_WS = SUPABASE_ORIGIN?.replace(/^http/, "ws") ?? null;
const TURNSTILE = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  ? "https://challenges.cloudflare.com"
  : null;

const sources = (...list: (string | null | false)[]) =>
  list.filter(Boolean).join(" ");

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  // Next.js needs 'unsafe-inline' for its inline hydration script.
  // Nonce-based CSP is a later project.
  `script-src ${sources("'self'", "'unsafe-inline'", IS_DEV && "'unsafe-eval'", TURNSTILE)}`,
  // Tailwind + inline style attributes on lots of components.
  "style-src 'self' 'unsafe-inline'",
  // Supabase public-bucket avatars, contact avatars (arbitrary https
  // URLs paste-able from the UI), data URLs for tiny inline assets.
  "img-src 'self' data: blob: https:",
  `media-src ${sources("'self'", "blob:", "https://*.supabase.co", SUPABASE_ORIGIN)}`,
  "font-src 'self' data:",
  // Supabase REST + realtime (WSS). All Meta / AI provider calls
  // happen server-side, so they don't belong here.
  `connect-src ${sources(
    "'self'",
    "https://*.supabase.co",
    "wss://*.supabase.co",
    SUPABASE_ORIGIN,
    SUPABASE_WS,
    IS_DEV && "ws:",
  )}`,
  `frame-src ${sources(TURNSTILE) || "'none'"}`,
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const SECURITY_HEADERS = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    // Microphone is allowed for same-origin (`self`) so the inbox
    // composer can record voice notes via MediaRecorder. Everything
    // else stays denied — a compromised dependency can't silently grab
    // the camera / geolocation / etc.
    key: "Permissions-Policy",
    value: "camera=(), microphone=(self), geolocation=(), payment=(), usb=()",
  },
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
] as const;

const APP_LOCALE = ["en", "pt", "es", "ko"].includes(process.env.NEXT_PUBLIC_APP_LOCALE ?? "")
  ? (process.env.NEXT_PUBLIC_APP_LOCALE as string)
  : "en";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "@app-messages": `./messages/${APP_LOCALE}.json`,
    },
  },
  // Emit a self-contained server bundle (.next/standalone) so the
  // Docker image can run without node_modules or the Next CLI.
  // Harmless outside Docker: `next start` keeps working as before.
  output: "standalone",
  // Don't advertise the framework in an `X-Powered-By` response header.
  poweredByHeader: false,
  experimental: {
    turbopackPluginRuntimeStrategy: "workerThreads",
  },
  // Stop `next dev` from overwriting the repo's hand-written AGENTS.md.
  agentRules: false,

  /**
   * Cross-origin dev access (Next.js 16).
   *
   * Next 16 blocks requests to dev-only resources (`/_next/*` internals,
   * the HMR websocket, the dev overlay) unless the browser's Origin is
   * the host the dev server booted on — `localhost` by default. Tunnels
   * like ngrok serve the app from a public HTTPS host, so without
   * allow-listing that host those dev requests come back 403: HMR stops
   * working and the dev session degrades over the tunnel (issue #365).
   *
   * Wildcards match subdomains only (Next's CSRF matcher), so the
   * randomised tunnel subdomain is covered. Add any other host via
   * `ALLOWED_DEV_ORIGINS` (comma-separated). This key is dev-only and
   * has no effect on a production build.
   */
  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok.app",
    "*.ngrok.io",
    "*.trycloudflare.com",
    "*.loca.lt",
    ...(process.env.ALLOWED_DEV_ORIGINS
      ? process.env.ALLOWED_DEV_ORIGINS.split(",")
          .map((origin) => origin.trim())
          .filter(Boolean)
      : []),
  ],

  /**
   * Cache-Control policy.
   *
   * Why this exists:
   *   Hostinger's CDN was applying `s-maxage=31536000` (1 year) to
   *   prerendered HTML pages by default. When a new deploy shipped
   *   fresh Turbopack chunk hashes, the edge kept serving year-old
   *   HTML referencing chunk filenames that no longer existed on
   *   disk — result: HTML 200, every /_next/static/*.js and .css
   *   came back 404, the page rendered unstyled. Private/incognito
   *   did nothing because the cache is server-side.
   *
   * Strategy:
   *   - /_next/static/* — leave to Next. Turbopack dev chunks can go
   *     stale if we force immutable caching here; Next already emits
   *     the correct production headers for hashed assets.
   *   - /api/*          — no-store. API responses are per-user and
   *     must never be shared across requests at the edge.
   *
   * Security headers are appended via a separate catch-all rule
   * below — Next.js merges headers from every matching rule, so
   * they apply to every response regardless of which cache rule
   * matched.
   */
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
      {
        source: "/:path((?!_next/static|_next/image|api).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store",
          },
        ],
      },
      {
        // Security headers on every response, including /_next/static
        // assets (nosniff matters there) and /api/* (HSTS + referrer-
        // policy don't hurt).
        source: "/:path*",
        headers: [...SECURITY_HEADERS],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
