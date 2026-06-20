# OTO NAKİT — Damaged-Vehicle Lead Platform

Production-grade lead-generation + CRM/SEO/ads platform for a Turkish
damaged-vehicle acquisition & broker business. Turkish public site, bilingual
(TR/EN) admin.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind v4
· Drizzle ORM + Neon Postgres · pnpm. Deploy: Vercel + Cloudflare.

## Quick start
```bash
pnpm install
cp .env.example .env.local      # fill what you have; everything is optional
pnpm dev                        # http://localhost:3000
```
With a database:
```bash
# set DATABASE_URL + SEED_ADMIN_* in .env.local
pnpm db:migrate && pnpm db:seed
# log in at /admin/login
```

## Commands
`pnpm dev` · `pnpm build` · `pnpm start` · `pnpm lint` · `pnpm typecheck` ·
`pnpm test` · `pnpm db:generate|migrate|push|studio|seed`

## What's built
- **Public site (Turkish):** all 23 page types — homepage, get-an-offer
  (multi-step), 11 service pages, vehicles-we-buy, how-it-works, about, FAQ,
  contact, service areas + city/district, blog, guides, search, thank-you, 404,
  5 legal pages. SEO: metadata, JSON-LD, sitemap, robots, llms.txt, RSS, ISR.
  Cookie consent + Consent Mode v2, first-party attribution.
- **Admin (TR/EN, RBAC):** dashboard, leads + funnel, calls, WhatsApp inbox,
  buyers, deals + finance, ad spend, analytics, content (CMS) + media.
- **Backend:** Drizzle schema (identity/RBAC, CRM, finance, comms, analytics,
  CMS, audit; migrations 0000–0004), session auth w/ lockout, audit logs.
- **Integrations (credential-ready, no fake success):** GTM/GA4/Ads + offline
  conversion queue, WhatsApp Cloud API + call-tracking webhooks (primary
  conversions), staff notifications, Vercel Blob, Cloudflare Turnstile.

## Docs (`/docs`)
Status & plan: `IMPLEMENTATION_PLAN.md`. Also: DATABASE · CONTENT_WORKFLOW ·
WHATSAPP · CALL_TRACKING · SECURITY · DEPLOYMENT · ENVIRONMENT_VARIABLES ·
QA_CHECKLIST · LAUNCH_CHECKLIST.

Design source: `design-source/` (design.md, 23-page prompts, master prompt, imagery).
