/** Communications config (server-only secrets; no NEXT_PUBLIC). */
function csv(v: string | undefined): string[] {
  return (v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
}

export const comms = {
  whatsapp: {
    token: process.env.WHATSAPP_TOKEN ?? "",
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID ?? "",
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN ?? "",
    appSecret: process.env.WHATSAPP_APP_SECRET ?? "",
    apiVersion: process.env.WHATSAPP_API_VERSION ?? "v21.0",
    staffRecipients: csv(process.env.WHATSAPP_STAFF_RECIPIENTS),
  },
  call: {
    provider: process.env.CALL_PROVIDER ?? "mock",
    webhookSecret: process.env.CALL_WEBHOOK_SECRET ?? "",
    qualifiedThresholdSec: parseInt(process.env.CALL_QUALIFIED_THRESHOLD_SEC ?? "60", 10),
  },
} as const;

/** WhatsApp Cloud API is live only when token + phone number id are set. */
export const whatsappEnabled = Boolean(comms.whatsapp.token && comms.whatsapp.phoneNumberId);
