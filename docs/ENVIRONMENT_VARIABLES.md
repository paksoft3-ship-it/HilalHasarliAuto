# Environment Variables

Copy `.env.example` → `.env.local` for development. Set per-environment in Vercel.
`NEXT_PUBLIC_*` are exposed to the browser; everything else is server-only.

## Brand & contact (editable later via Admin → Settings)
`NEXT_PUBLIC_BRAND_NAME`, `NEXT_PUBLIC_DOMAIN`, `NEXT_PUBLIC_PHONE_DISPLAY`,
`NEXT_PUBLIC_PHONE_E164`, `NEXT_PUBLIC_WHATSAPP_E164`, `NEXT_PUBLIC_EMAIL`,
`NEXT_PUBLIC_WORKING_HOURS`, plus legal placeholders
(`NEXT_PUBLIC_LEGAL_COMPANY_NAME`, `_COMPANY_ADDRESS`, `_TAX_INFO`, `_MERSIS`, `_KEP`).

## Database & seed
`DATABASE_URL` (Neon), `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`.

## Storage
`BLOB_READ_WRITE_TOKEN` (Vercel Blob — enables direct media upload).

## Tracking / analytics (optional)
`NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID`,
`NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`.

## WhatsApp Cloud API (server-only)
`WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_VERIFY_TOKEN`,
`WHATSAPP_APP_SECRET`, `WHATSAPP_API_VERSION`, `WHATSAPP_STAFF_RECIPIENTS`.

## Call tracking
`CALL_PROVIDER`, `CALL_WEBHOOK_SECRET`, `CALL_QUALIFIED_THRESHOLD_SEC`.

## Bot protection (optional)
`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET`.

## Behaviour when unset
Every integration is **credential-ready**: the app runs without any of these
(DB off → forms log PII-safe + return a reference; tracking off → no GTM; WhatsApp
/calls → mock; Turnstile → not enforced). No fake success is ever reported.
