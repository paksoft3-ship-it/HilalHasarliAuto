# Hasarlı Araç Alan — Implementation Plan & Status

Living document. Update after every phase. Source spec:
`design-source/CLAUDE_CODE_MASTER_PROMPT_DAMAGED_VEHICLE_PLATFORM.md`.

## Decisions
- Public site **Turkish**; admin **TR+EN** (locale-ready). Build order:
  **public site first**, then CMS/SEO → CRM → comms → finance/ads → security → deploy.
- Brand **Hasarlı Araç Alan**, configurable. Turkish public route slugs.

## Asset inventory
- `1.png` (root, moved to `design-source/`) = approved burgundy homepage mockup → source of truth.
  `2–5.png`, `55.png` = rejected color/brand explorations (ignored).
- `İcons/1–8.png` → `public/images/categories/*.png` (transparent vehicle category PNGs):
  1 hasarli · 2 kazali · 3 agir-hasarli(/pert) · 4 hurda · 5 cekme-belgeli ·
  6 motor-arizali(/arizali/calismayan) · 7 yanmis · 8 sel-hasarli.
- `carimages/*` → `public/images/photos/*`; `photos/3.png` → `hero-tow-truck.png`,
  `photos/1.png` → `about-feature.png`.

## Route map (Turkish)
`/` · `/teklif-al` · `/hangi-araclari-aliyoruz` · `/arac-alimi/[slug]` ·
`/nasil-calisir` · `/hakkimizda` · `/sss` · `/iletisim` · `/hizmet-bolgeleri` ·
`/hizmet-bolgeleri/[city]` · `/hizmet-bolgeleri/[city]/[district]` · `/blog` ·
`/blog/[slug]` · `/rehberler` · `/rehberler/[slug]` · `/tesekkurler` · `/arama` ·
legal: `/gizlilik-politikasi` `/kvkk-aydinlatma-metni` `/cerez-politikasi`
`/kullanim-kosullari` `/yasal-uyari` · 404 · (+ robots/sitemap/llms/rss, admin `/admin/*`).

---

## Phase status

### Phase 0 — Audit ✅
Files inspected, assets inventoried & mapped, route map confirmed, plan written.

### Phase 1 — Foundation 🟡 (in progress)
- [x] Next.js 16 + TS strict + Tailwind v4 + pnpm scaffold
- [x] Design tokens (burgundy/charcoal/cream/gold) in `globals.css` `@theme`
- [x] Manrope font, `lang="tr"`, base metadata
- [x] Central config: `site`, `navigation`, `services`, `cities`, `faq`
- [x] UI primitives: Button, Section/SectionHeading, FaqAccordion
- [x] Layout: Header (sticky, scroll-aware, mobile drawer), Footer,
      FloatingWhatsApp, MobileCtaBar, Logo
- [x] Lead domain: Zod schema, reference generator, `submitQuickOffer` server
      action (honeypot, PII-masked logs, DB persistence TODO)
- [x] `.env.example`, docs, CLAUDE.md
- [ ] Database (Drizzle + Neon) — deferred to Phase 4 (needs DATABASE_URL)
- [ ] Auth, RBAC, admin shell — deferred (admin built after public site)
- [ ] Storage abstraction (Vercel Blob), job/outbox, audit log — deferred

### Phase 2 — Public website ✅ (core complete; polish pending)
- [x] Homepage (hero + quick-offer form, trust strip, categories, how-it-works,
      why-us, testimonials[sample], service areas, FAQ, final CTA)
- [x] Thank-you page (`/tesekkurler`, noindex, reads ref) + custom 404
- [x] Teklif Al multi-step form (5 steps, stepper, photo preview, review)
- [x] Hangi Araçları Alıyoruz overview (all 11 services)
- [x] Service page template + 11 service pages (unique content, Service+FAQ JSON-LD)
- [x] Nasıl Çalışır, Hakkımızda, SSS (categorized + search), İletişim (form)
- [x] Service areas hub + city template (12 cities) + district template (16 districts)
- [x] Blog listing/detail (3 sample posts) + Guides listing/detail (2 sample guides)
- [x] Site search (`/arama`, noindex, client-filtered index)
- [x] Legal pages (5): privacy, KVKK, cookies, terms, legal notice (TOC + print)
- [x] robots.txt, sitemap.xml, llms.txt, rss.xml, manifest, JSON-LD
      (Organization/WebSite/Breadcrumb/Service/FAQ/BlogPosting/HowTo)
- [x] Cookie consent UI (categories, accept/reject/save, reopenable; Consent Mode
      v2 wiring TODO Phase 6)
- [x] Vercel Blob photo upload — full quote form uploads vehicle photos
      browser→Blob via `/api/upload` (client-upload token handler, image-only,
      15 MB cap, `leads/` prefix); URLs persisted to `vehicles.photos` (jsonb,
      migration 0008) + shown as thumbnails on the admin lead detail.
- [ ] Forms: real DB persistence (Phase 4), Turnstile
- [ ] OG image endpoints, a11y (axe) pass, Lighthouse/perf pass, e2e tests

Build: 69 static pages + dynamic (llms/rss/tesekkurler). `pnpm lint`, `tsc`,
`pnpm build` all green; all routes smoke-tested 200.

**Hero & imagery system (per user, design-source/Heroimages):**
- 7 full-bleed hero images (`/images/heroes/1-7.png`): damaged cars on the
  right, cream blur on the left for content. Reusable `<PageHero>` renders them
  with a cream gradient overlay + left-aligned content; used on home, hangi,
  nasıl-çalışır, hakkımızda, sss, iletişim, teklif-al, service-areas, service,
  city, blog, guides.
- Quote form is a **standalone `<QuoteSection>`** (intro+trust left, form right),
  NOT embedded/overlapping the hero. Homepage places it directly under the
  category section; service/city pages place it lower in the page.
- Category icons: the icons-source cut-out cars are made genuinely transparent
  by `scripts/remove_checkerboard.py` (border flood + tight checkerboard-colour
  removal → real alpha; windows transparent, bodies intact) → overwrites
  `/images/categories/*.png`. Cards show them on a cream→white gradient tile so
  they read as designed cards (resolves the "floating on white" look).

**Earlier design refinement (5.png):**
- Homepage hero rebuilt to 5.png: real photo on top, compact quote form
  overlapping below it (image behind form, `compact` form variant).
- The İcons category PNGs had a checkerboard **baked into pixels** (`hasAlpha:no`)
  — deleted. Category cards now use burgundy **lucide line icons**
  (`ServiceIcon`), matching 5.png. All hero/feature/card imagery uses the real
  `carimages` scene photos (`/images/photos/*`, mapped per service in
  `services.ts`). `hero-home.png`=photos/11, `about-feature.png`=photos/44.
- WhatsApp buttons use the **official WhatsApp brand glyph** (`WhatsAppIcon`),
  not lucide MessageCircle (kept only as a generic "communication" feature icon
  in why-us).

### Data layer (Drizzle + Neon) ✅ — credential-ready
- [x] Drizzle ORM + Neon serverless client (`src/db/index.ts`); graceful when no
      DATABASE_URL (`isDbConfigured`).
- [x] Schema (`src/db/schema/`): identity+RBAC, settings, full CRM core, audit/
      jobs/webhooks; pgEnums for stable stage/source codes; indexes on filters.
- [x] Initial migration generated (`drizzle/0000_*.sql`, 23 tables).
- [x] Lead persistence repo (`src/db/repo/leads.ts`) — transactional; the 3
      public forms (quick offer, full quote, contact) now persist when DB is set
      (no fake success otherwise).
- [x] RBAC defs (`src/lib/auth/rbac.ts`), scrypt password util, idempotent seed
      (`pnpm db:seed`: roles, permissions, super-admin, settings, tags).
- [x] Scripts: db:generate/migrate/push/studio/seed. Docs: `docs/DATABASE.md`.
- [ ] User action (later): set DATABASE_URL → `pnpm db:migrate` → `pnpm db:seed`.

### Misc
- [x] "Geliştiren · PakSoft" credit badge (`components/layout/dev-credit.tsx`) in
      footer; reuse on admin login.

### Admin auth + shell + CRM 🟡 (core done; credential-ready)
- [x] Session auth: DB sessions + rotating httpOnly cookie (`lib/auth/session.ts`),
      scrypt passwords, login/logout actions with **account lockout** (5 tries /
      15 min) + audit logging (`lib/auth/actions.ts`).
- [x] Middleware gate on `/admin/*` (cookie presence) + server-side
      `requireUser` / `requirePermission` (RBAC) in the panel layout.
- [x] Admin shell: charcoal sidebar (perm-filtered nav, mobile drawer), topbar
      with **TR/EN switcher** + logout; distinct from public, brand tokens.
- [x] Dashboard (lead stats + recent), Leads list (filters/search/pagination),
      Lead detail (contact w/ PII-mask by perm, vehicle, notes, stage history,
      submissions; stage-change + add-note actions), Funnel kanban (read).
- [x] Login page with DB-setup screen when no DATABASE_URL; PakSoft badge.
- [x] `force-dynamic` on panel so auth always evaluates at request time.
- [ ] Runtime-verifiable once DATABASE_URL is set (`db:migrate` + `db:seed` →
      login with SEED_ADMIN_*). Build/lint/typecheck green; no-DB paths verified
      (admin→login 307, login setup screen 200).
- [x] Lead assignment (manual, audited), priority/deal-type/next-action editing,
      mark-contacted (auto-advances stage), tasks (add/complete), lost-reason
      required on Lost, quick views (mine/unassigned/high/follow-up/stale/won/
      lost), CSV export (perm-gated + audited).
- [ ] Later: bulk actions, saved custom views, assignment strategies (round-
      robin/city), tasks calendar view, remaining admin modules (calls, whatsapp,
      buyers, offers, deals, finance, ad spend, analytics, SEO, content/CMS,
      media, users, settings, audit).

### Buyers / Referrals / Offers / Deals / Finance 🟡 (core done)
- [x] Schema (`db/schema/finance.ts`, migration 0001): buyers, lead_referrals,
      buyer_offers, customer_offers, deals (essential financials), deal_expenses,
      ad_spend_daily + enums. Amounts whole TRY.
- [x] Deal P&L calculator (`lib/finance/calc.ts`, pure): broker = commission;
      direct = resale−purchase; net = gross − ad cost − expenses (+ manual adj).
- [x] Repos (`db/repo/commerce.ts`) + actions (`lib/admin/commerce-actions.ts`,
      RBAC + audit): buyers CRUD/toggle, refer-to-buyers, buyer/customer offers,
      select best offer, create/update deal, deal expenses, manual ad spend.
- [x] Admin UI: **Buyers** (list + new/edit), **Deals** (list + detail w/
      financial form, expenses, live P&L), **Finance** (revenue/profit/ad-spend/
      ROAS summary), **Ad Spend** (manual entry + list); lead detail gains a
      **Commercial** section (refer, buyer offers + select, customer offer,
      create/open deal). Nav enabled for all four.
- [ ] Later: buyer-offer→deal auto-fill bestBuyerOffer, redacted referral
      send via WhatsApp, Google Ads reporting sync + CSV import, commission
      reconciliation, profit-by-source/service/city breakdowns.

### Tracking, attribution & conversions 🟡 (foundation done)
- [x] Schema (migration 0002): `critical_events` (first-party event log, dedupe),
      `conversion_exports` (offline conversion queue, dedupeKey).
- [x] First-party **attribution** (`lib/tracking/attribution.ts`): captures
      gclid/gbraid/wbraid/fbclid/ttclid/msclkid + UTMs + landing/referrer into a
      cookie (first + last touch, sessionId); injected as a hidden field into all
      3 lead forms; persisted to `attribution_touches` + a `lead_created`
      `critical_events` row (transactional, deduped by reference).
- [x] **Consent Mode v2** wired to the cookie consent (default denied →
      update on choice) via `lib/tracking/events.ts`.
- [x] GTM/GA4 loader (`AnalyticsScripts`, consent-aware, public-only, off until
      `NEXT_PUBLIC_GTM_ID`/`GA4_ID` set) + `TrackingProvider` (attribution +
      `[data-track]` click delegation → dataLayer).
- [x] Event taxonomy fired: `phone_click`, `whatsapp_click`,
      `quote_form_submit`, `contact_form_submit` (data-track on all CTAs/links).
- [x] Admin **Analytics** page: tracking config status, event counts, leads by
      source. Config in `config/tracking.ts` + `.env.example`.
- [ ] Later: Google Ads offline-conversion upload adapter (drains
      conversion_exports), enhanced conversions (hashed first-party), GSC/GA4
      reporting sync, PostHog EU load + masking, qualified_call/whatsapp
      _conversation_started primary conversions (need comms phase).

### Communications 🟡 (core done; credential-ready)
- [x] Schema (migration 0003): whatsapp_threads, whatsapp_messages, calls,
      call_events, notifications + enums.
- [x] WhatsApp provider (`lib/comms/whatsapp.ts`): Cloud API send + mock,
      X-Hub-Signature-256 verify, inbound parse. Webhook `/api/webhooks/whatsapp`
      (GET verify + POST receive, idempotent) → threads/messages, lead auto-link,
      **whatsapp_conversation_started** primary conversion on first inbound.
- [x] Call tracking webhook `/api/webhooks/calls` (provider-agnostic, secret +
      idempotent) → calls/call_events, lead auto-link, **qualified_call** on
      duration≥threshold; manual qualify in admin. Recording access gated by
      `calls.recording.access` + consent; caller numbers masked.
- [x] Primary conversions fire `critical_events` + enqueue `conversion_exports`
      (deduped) — Google Ads offline upload adapter drains these (next).
- [x] Staff WhatsApp notifications on new lead (`lib/comms/notify.ts`, recorded
      in `notifications`), wired into all 3 lead forms.
- [x] Admin: **WhatsApp inbox** (threads + reply), **Calls** (list + detail +
      manual qualify). Nav enabled. Docs: WHATSAPP.md, CALL_TRACKING.md.
- [ ] Later: WhatsApp message templates + delivery/read status + media; Google
      Ads conversion-upload adapter; notification quiet-hours/escalation; comms
      settings UI; call number pools / dynamic number insertion.

### CMS 🟡 (engine + workflow done)
- [x] Schema (migration 0004): content_items (typed Block[] body, SEO, version),
      content_versions, content_approvals, media_assets, media_usages + enums.
- [x] Markdown-lite ⇄ Block[] converter (`lib/cms/blocks.ts`, no rich-text dep;
      reuses ArticleBody). Version snapshot on every save.
- [x] Workflow: draft→in_review→(approved|changes_requested)→published / archived;
      RBAC (content.write vs content.publish), approval comments, audit trail.
- [x] Admin: Content list (type filter), editor + workflow panel + approvals,
      Media library (direct Vercel Blob upload via `/api/admin/media/upload`
      — perm-gated token handler + `registerUploadedMedia`; register-by-URL
      kept as fallback). Nav enabled.
- [x] Public blog reads published CMS posts merged with config seeds
      (`lib/cms/public-content.ts`); ISR + revalidate on publish.
- [ ] Later: wire guides/pages/services to CMS, scheduled publish job, diff/
      rollback UI, Vercel Blob upload route, FAQ/CTA/nav/redirects as content.

### Security, QA & Deploy 🟡 (core done)
- [x] Security headers in next.config (CSP, HSTS, X-Content-Type-Options,
      X-Frame-Options DENY, Referrer-Policy, Permissions-Policy; poweredBy off).
- [x] Bot protection: honeypot + Cloudflare **Turnstile** (optional, enforced
      when secret set) on quick-offer + contact; duplicate-submit guard;
      webhook signature/secret + idempotency (done earlier).
- [x] **Vitest** unit tests (deal P&L, blocks parser, phone/schema/reference) —
      13 passing; `pnpm test` + `pnpm typecheck` scripts.
- [x] Docs: SECURITY, DEPLOYMENT, ENVIRONMENT_VARIABLES, QA_CHECKLIST,
      LAUNCH_CHECKLIST; README rewritten.
- [ ] Later: nonce-based CSP, Vercel BotID, per-IP rate limiting, Playwright e2e
      + axe + Lighthouse in CI, dependency audit, error monitoring,
      data export/anonymization workflows, backup-health panel.

### Deferred cross-cutting (need external credentials)
Google Ads offline-conversion **upload adapter** (drain `conversion_exports`),
enhanced conversions, GSC + GA4 + Ads reporting sync, PostHog EU load + masking,
WhatsApp templates, guides/pages/services + FAQ/redirects
into the CMS, scheduled-publish job. (Vercel Blob upload — done for both lead
vehicle photos and the admin Media library.)

## Build health
`npx tsc --noEmit` clean · `pnpm build` passes · homepage/thank-you/404 verified via server render.
