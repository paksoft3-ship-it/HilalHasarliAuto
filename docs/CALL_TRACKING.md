# Call Tracking

Provider-agnostic (master prompt §13). The 0850 provider is not yet selected;
a **mock provider** is the default so the full flow works in development. Add the
chosen Turkish 0850 provider later by pointing it at the webhook and mapping its
payload.

## Setup
```
CALL_PROVIDER="mock"               # or the chosen provider name
CALL_WEBHOOK_SECRET="a-secret"     # required header x-call-secret when set
CALL_QUALIFIED_THRESHOLD_SEC="60"  # qualified_call duration threshold
```

## Webhook
**POST** `/api/webhooks/calls` — shared-secret verified (`x-call-secret`),
idempotent via `webhook_events` (per call+status). Expected normalized JSON:
```json
{ "externalId": "abc", "status": "completed", "durationSec": 120,
  "trackingNumber": "0850...", "callerNumber": "5xx...", "campaign": "...",
  "keyword": "...", "recordingUrl": "...", "recordingConsent": true }
```
Statuses: initiated · ringing · answered · missed · completed · failed.

## Behavior
- Upserts a `calls` row + appends `call_events`; auto-links the lead by caller
  number.
- **Qualified-call rule**: `completed` AND `durationSec ≥ threshold` →
  `qualified = true`, fires the **`qualified_call`** primary conversion
  (`critical_events` + `conversion_exports`). Manual qualification is available
  in the admin call detail (`phone_click` stays a secondary event).
- **Recordings**: shown only to roles with `calls.recording.access` and only
  when `recordingConsent` is true; never placed in public storage. Caller numbers
  are masked unless `leads.pii.view`.

## Admin
`/admin/calls` (list) and `/admin/calls/[id]` (detail, manual qualify, recording
access). Configure the duration threshold via `CALL_QUALIFIED_THRESHOLD_SEC`.
