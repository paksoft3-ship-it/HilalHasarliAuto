# Deployment (Vercel + Neon + Cloudflare)

## Prerequisites
- Vercel project, Neon PostgreSQL (Vercel Marketplace), domain.
- Node 20+, pnpm.

## 1. Database
1. Create a Neon project; copy the pooled connection string.
2. Set `DATABASE_URL` (+ `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD`) in the Vercel
   project env (Production + Preview separately).
3. Run migrations & seed (locally against the prod branch or via a one-off):
   ```
   pnpm db:migrate && pnpm db:seed
   ```

## 2. Environment variables
See `.env.example` / `docs/ENVIRONMENT_VARIABLES.md`. Set per-environment:
brand/contact, `DATABASE_URL`, tracking IDs (GTM/GA4/Ads/PostHog), WhatsApp
Cloud API, call tracking, Turnstile, Vercel Blob.

## 3. Deploy
- Connect the repo to Vercel. Build command `pnpm build`, install `pnpm install`.
- Preview deploys per PR; promote to Production when green.

## 4. Cloudflare (in front of the domain)
- DNS proxied; WAF managed rules + bot fight mode; rate-limit `/api/*` and
  `/admin/*`; cache static assets, bypass cache for `/admin` and `/api`.
- Keep `Strict-Transport-Security` (set by the app).

## 5. Integrations (post-deploy)
- WhatsApp webhook → `https://DOMAIN/api/webhooks/whatsapp` (verify token).
- Call provider webhook → `https://DOMAIN/api/webhooks/calls` (shared secret).
- GTM/GA4/Google Ads IDs; Google Search Console property.

## 6. Quality gates (run before promoting)
`pnpm typecheck` · `pnpm lint` · `pnpm test` · `pnpm build`. Then Lighthouse +
axe on key pages (see QA_CHECKLIST.md).

## Rollback
Vercel → Deployments → promote the previous successful build. DB: Neon PITR /
branch restore. Never run destructive migrations without a backup.
