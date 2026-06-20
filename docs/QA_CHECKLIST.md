# QA Checklist

## Automated gates (CI / pre-deploy)
- [x] `pnpm typecheck` — TypeScript strict, clean.
- [x] `pnpm lint` — ESLint clean.
- [x] `pnpm test` — Vitest unit tests (deal P&L, blocks parser, phone/schema/ref).
- [x] `pnpm build` — production build succeeds.
- [ ] Lighthouse (mobile) on `/`, a service page, a city page — perf/SEO/a11y.
- [ ] axe accessibility scan on key templates.
- [ ] Broken-link crawl; sitemap & robots validation; JSON-LD validation.

## Manual smoke (with DATABASE_URL set)
- [ ] Submit each form → thank-you with reference → lead appears in `/admin/leads`.
- [ ] Lead: assign, change stage (loss reason required on Lost), add note/task.
- [ ] Buyer → refer lead → buyer offer → select → create deal → financials/expenses → close.
- [ ] Finance & Analytics dashboards populate; CSV export downloads.
- [ ] Content: draft → submit → approve → publish → appears on `/blog`.
- [ ] WhatsApp webhook (verify + inbound) → thread + conversation event.
- [ ] Call webhook → call + `qualified_call` on duration threshold.
- [ ] Cookie consent: accept/reject updates Consent Mode; GTM loads only with ID.
- [ ] Login lockout after 5 fails; RBAC blocks unauthorized modules; PII masked.

## e2e (Playwright — to add)
Homepage→form→thank-you, admin login→lead workflow, content publish, 404,
mobile sticky CTA, cookie consent. Not yet wired (needs browser install in CI).

## Pre-launch
- [ ] All public pages responsive (390 / 768 / 1440); no horizontal overflow.
- [ ] Real company/legal data replaces placeholders.
- [ ] Security headers present (curl -I); admin/api not indexed.
