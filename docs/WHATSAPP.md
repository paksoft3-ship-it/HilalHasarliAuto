# WhatsApp

Two modes (master prompt §14):
1. **wa.me fallback** — live on the public site (floating button, CTAs, mobile
   bar) with prefilled context messages. No credentials needed.
2. **Cloud API** — inbound inbox, staff notifications, replies. Activates when
   `WHATSAPP_TOKEN` + `WHATSAPP_PHONE_NUMBER_ID` are set; otherwise sends run in
   **mock/test mode** (logged, recorded as `mock`).

## Setup
Set in `.env.local`:
```
WHATSAPP_TOKEN="..."
WHATSAPP_PHONE_NUMBER_ID="..."
WHATSAPP_VERIFY_TOKEN="a-random-string"
WHATSAPP_APP_SECRET="..."            # enables X-Hub-Signature-256 verification
WHATSAPP_STAFF_RECIPIENTS="9055...,9055..."  # new-lead alerts
```
Configure the Meta webhook callback URL to `/(domain)/api/webhooks/whatsapp`
with the same verify token.

## Behavior
- **GET** `/api/webhooks/whatsapp` — verification handshake.
- **POST** — signature-verified (when `WHATSAPP_APP_SECRET` set), idempotent via
  `webhook_events` (per message id). Inbound messages upsert a `whatsapp_threads`
  row, store `whatsapp_messages`, auto-link the lead by phone, and on the first
  inbound fire the **`whatsapp_conversation_started`** primary conversion
  (`critical_events` + `conversion_exports`).
- Admin **WhatsApp inbox** (`/admin/whatsapp`): thread list + messages + reply
  (real send when configured, mock otherwise).
- **Staff notifications**: new leads alert configured staff numbers; recorded in
  `notifications` with delivery status.

## Notes
- Business-initiated messages outside the 24h window require an **approved
  template** — plain text sends may fail (recorded as failed). Add template
  support before relying on outbound alerts.
- Never hardcode a personal staff number — use `WHATSAPP_STAFF_RECIPIENTS`.
