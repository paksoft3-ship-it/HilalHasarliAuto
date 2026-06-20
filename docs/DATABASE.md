# Database

PostgreSQL (Neon) + Drizzle ORM. The app is **credential-ready**: with no
`DATABASE_URL`, the client (`src/db/index.ts`) exposes `db = null` /
`isDbConfigured = false` and the public forms degrade gracefully (validate +
PII-masked log, still return a reference — no fake persistence). As soon as
`DATABASE_URL` is set, the forms persist real leads.

## Setup
1. Create a Neon project → copy the connection string.
2. Add to `.env.local`:
   ```
   DATABASE_URL="postgresql://...neon.tech/db?sslmode=require"
   SEED_ADMIN_EMAIL="you@example.com"
   SEED_ADMIN_PASSWORD="a-strong-password"
   ```
3. Apply schema + seed:
   ```
   pnpm db:migrate   # apply migrations in /drizzle
   pnpm db:seed      # roles, permissions, super-admin, settings, tags
   ```

## Scripts
- `pnpm db:generate` — generate a migration from schema changes (offline).
- `pnpm db:migrate` — apply migrations to the database.
- `pnpm db:push` — push schema directly (dev only).
- `pnpm db:studio` — Drizzle Studio.
- `pnpm db:seed` — idempotent seed.

## Schema (`src/db/schema/`)
- **shared / enums** — `pk()`, UTC `timestamps`, pgEnums (lead stages, deal
  types, sources, etc.). Stages use stable internal codes.
- **identity** — `users`, `roles`, `permissions`, `role_permissions`,
  `user_roles`, `sessions`, `user_preferences`. Soft-delete on users; lockout
  fields; MFA-ready (`mfa_secret`).
- **settings** — `site_settings` (key/value JSONB), `integration_settings`
  (per-provider config + test mode), `feature_flags`.
- **crm** — `leads` (human `lead_number` + immutable id, indexed filters),
  `vehicles`, `form_submissions`, `attribution_touches`, `consent_records`,
  `lead_stage_history`, `lead_assignments`, `lead_notes`, `tasks`, `tags`,
  `lead_tags`.
- **audit** — `audit_logs` (append-only, PII-redacted), `background_jobs`
  (outbox with retry/backoff states), `webhook_events` (idempotent, unique
  provider+event).

## Conventions
- UTC storage (timestamptz); display in Europe/Istanbul.
- Immutable UUID ids; human-readable reference numbers separate.
- Indexes on common filters (stage, assignee, source, city, phone, createdAt).
- Lead writes are transactional (`src/db/repo/leads.ts`).
- RBAC roles/permissions defined in `src/lib/auth/rbac.ts` and seeded.

## Not yet modelled (later phases)
buyers/offers/deals/finance/ad-spend, calls/whatsapp threads, content/CMS, SEO
keywords/GSC, conversion exports — added in their respective phases.
