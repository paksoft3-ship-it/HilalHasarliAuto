# Launch Checklist

## Content & brand
- [ ] Replace `[BRAND_NAME]` / placeholders with confirmed brand & contact.
- [ ] Real legal data in privacy/KVKK/cookie/terms/legal-notice (+ retention,
      MERSIS, KEP, company title) after legal review.
- [ ] Replace sample testimonials & blog/guide seeds with approved content.
- [ ] Publish only city/district pages that have unique approved content.

## Infrastructure
- [ ] Neon DB provisioned; `pnpm db:migrate && pnpm db:seed` run; admin password changed.
- [ ] Vercel Blob token set (media uploads).
- [ ] Production + Preview env vars set separately; secrets not in git.
- [ ] Cloudflare WAF/rate-limits/DNS configured (DEPLOYMENT.md).

## Integrations
- [ ] GTM container + GA4 + Google Ads conversions; Consent Mode verified.
- [ ] Google Search Console property + sitemap submitted.
- [ ] WhatsApp Cloud API webhook verified; staff recipients set.
- [ ] Call-tracking provider webhook + secret; qualified-call threshold confirmed.
- [ ] Turnstile keys (if enforcing).

## Quality
- [ ] QA_CHECKLIST.md gates pass; Lighthouse/axe acceptable.
- [ ] Security headers verified; `/admin` + `/api` noindex; robots correct.
- [ ] Backups/PITR confirmed; restore test documented.

## Conversions (post-credentials)
- [ ] Google Ads offline-conversion upload adapter draining `conversion_exports`.
- [ ] Enhanced conversions (hashed first-party) where consented.

## Go / no-go
- [ ] Missing credentials list reviewed — no fake "connected" status anywhere.
