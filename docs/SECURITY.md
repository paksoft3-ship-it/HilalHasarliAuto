# Security

## Headers (next.config.ts)
Applied to every route:
- **Content-Security-Policy** — `default-src 'self'`; allows GTM/GA4/PostHog,
  Cloudflare Turnstile, WhatsApp Graph; `img-src` allows https/data/blob (CMS
  media + next/image); `frame-ancestors 'none'`, `object-src 'none'`,
  `base-uri 'self'`, `form-action 'self'`, `upgrade-insecure-requests`.
  (Script `'unsafe-inline'` is allowed for GTM — tighten with nonces later.)
- **HSTS** (2y, includeSubDomains, preload), **X-Content-Type-Options** nosniff,
  **X-Frame-Options** DENY, **Referrer-Policy** strict-origin-when-cross-origin,
  **Permissions-Policy** (camera/mic/geo/topics disabled). `poweredByHeader` off.

## Authentication & authorization
- Session cookie httpOnly + SameSite=Lax + Secure (prod); DB-backed sessions
  with rotation on login; account **lockout** (5 fails / 15 min).
- **RBAC** enforced server-side (`requirePermission`) on every admin page/action
  — never UI-only. PII (phone/email/VIN/caller number) masked unless permitted;
  call recordings gated by `calls.recording.access` + consent.

## Bot / abuse protection (forms)
- **Honeypot** field + **Cloudflare Turnstile** (optional; enforced when
  `TURNSTILE_SECRET` set) on quick-offer and contact forms.
- **Duplicate-submit guard** (same phone within 10 min reuses the lead).
- Webhooks: signature verification (WhatsApp `X-Hub-Signature-256`; call shared
  secret), **idempotency** via `webhook_events`, replay-safe.
- Recommended at the edge: Vercel BotID/WAF + Cloudflare WAF/rate-limits (see
  DEPLOYMENT.md).

## Data & privacy
- Append-only `audit_logs` (login, stage change, assignment, exports, content
  publish, recording access, …). PII redacted in app logs (phones masked).
- Consent: cookie banner + Google **Consent Mode v2** (default denied);
  attribution stored first-party.
- Secrets only in env (never `NEXT_PUBLIC_*` for tokens); `.env.local` git-ignored.

## Still to do before launch
Nonce-based CSP, Vercel BotID wiring, per-IP rate limiting, dependency audit in
CI, error-monitoring provider, data export/anonymization workflows.
