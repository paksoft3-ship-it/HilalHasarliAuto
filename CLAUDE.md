@AGENTS.md

# OTO NAKİT — Project guide

Damaged-vehicle lead-generation + CRM/SEO/ads platform for Türkiye. Full spec
lives in `design-source/CLAUDE_CODE_MASTER_PROMPT_DAMAGED_VEHICLE_PLATFORM.md`,
visual system in `design-source/design.md`, page prompts in
`design-source/23-page-prompts.md`. Implementation plan & status:
`docs/IMPLEMENTATION_PLAN.md`.

## Key decisions (locked)
- **Public site language: Turkish** (overrides the master prompt's English-launch
  note — explicit user instruction). Admin will be **bilingual TR + EN**.
  Keep architecture locale-ready.
- **Brand: OTO NAKİT**, but never hardcode brand/contact — read from
  `src/config/site.ts` (env-backed, later DB-backed via `site_settings`).
- Public routes use **Turkish slugs** (e.g. `/teklif-al`, `/arac-alimi/[slug]`).
- Stack: **Next.js 16 (App Router, Turbopack), React 19, TS strict, Tailwind v4,
  pnpm**. Drizzle + Neon to be added in Phase 4 (no DATABASE_URL yet).

## Stack notes
- **Next.js 16 has breaking changes** — see `node_modules/next/dist/docs/` and
  AGENTS.md. `searchParams`/`params` are async (Promises) in pages.
- **Tailwind v4** is CSS-first: design tokens live in `src/app/globals.css`
  under `@theme` (no `tailwind.config`). Use token-named utilities like
  `bg-burgundy-700`, `text-ink`, `border-line`.
- Server Components by default; add `"use client"` only for interaction.

## Design system (from design.md)
- Burgundy `#7A2432` = primary CTA / emphasis. Charcoal `#161B1F` = header,
  footer, authority sections. Cream/white = dominant surfaces. Warm gold
  `#C89A4B` = restrained accent only. **WhatsApp green `#22A447` ONLY for
  WhatsApp.** Font: Manrope.
- Conversion hierarchy: 1) Hemen Teklif Al (burgundy) 2) WhatsApp (green)
  3) Ara (charcoal). Use `<CtaGroup>`.
- Reuse primitives: `components/ui/*` (Button via `buttonClasses`, Section,
  SectionHeading, FaqAccordion), `components/layout/*`, `components/sections/*`.

## Conventions
- Config/seed data in `src/config/*` (services, cities, navigation, faq, site).
- Never invent company/legal facts, reviews, stats, or response times — use
  editable placeholders. Form submit = SECONDARY conversion only.
- Validate every input with Zod; mask PII in logs.

## Commands
- `pnpm dev` · `pnpm build` · `pnpm start` · `pnpm lint` · `npx tsc --noEmit`
- Run `pnpm build` before declaring a phase done.
