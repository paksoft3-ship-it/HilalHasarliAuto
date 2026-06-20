import { createHmac, timingSafeEqual } from "node:crypto";
import { comms, whatsappEnabled } from "@/config/comms";

export interface SendResult {
  ok: boolean;
  messageId?: string;
  mock?: boolean;
  error?: string;
}

/** Send a WhatsApp text message via the Cloud API. Mock (logged) when not configured. */
export async function sendWhatsAppText(to: string, body: string): Promise<SendResult> {
  const digits = to.replace(/[^\d]/g, "");
  if (!whatsappEnabled) {
    console.info("[whatsapp] (mock) send", { to: maskNumber(digits), preview: body.slice(0, 40) });
    return { ok: true, mock: true };
  }
  try {
    const res = await fetch(
      `https://graph.facebook.com/${comms.whatsapp.apiVersion}/${comms.whatsapp.phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${comms.whatsapp.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: digits,
          type: "text",
          text: { body },
        }),
      },
    );
    const json = (await res.json()) as { messages?: { id: string }[]; error?: { message: string } };
    if (!res.ok) return { ok: false, error: json.error?.message ?? `HTTP ${res.status}` };
    return { ok: true, messageId: json.messages?.[0]?.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

/** Verify the X-Hub-Signature-256 header against the raw body. */
export function verifyWhatsAppSignature(rawBody: string, signature: string | null): boolean {
  if (!comms.whatsapp.appSecret) return true; // no secret configured → skip (dev)
  if (!signature) return false;
  const expected = "sha256=" + createHmac("sha256", comms.whatsapp.appSecret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

export interface InboundMessage {
  waId: string;
  waMessageId: string;
  type: string;
  body?: string;
  timestamp?: string;
}

/** Extract inbound messages from a WhatsApp webhook payload. */
export function parseInboundMessages(payload: unknown): InboundMessage[] {
  const out: InboundMessage[] = [];
  try {
    const entries = (payload as { entry?: unknown[] }).entry ?? [];
    for (const entry of entries) {
      const changes = (entry as { changes?: unknown[] }).changes ?? [];
      for (const change of changes) {
        const value = (change as { value?: { messages?: unknown[] } }).value;
        for (const m of value?.messages ?? []) {
          const msg = m as { from: string; id: string; type: string; text?: { body: string }; timestamp?: string };
          out.push({
            waId: msg.from,
            waMessageId: msg.id,
            type: msg.type,
            body: msg.text?.body,
            timestamp: msg.timestamp,
          });
        }
      }
    }
  } catch {
    // malformed payload → no messages
  }
  return out;
}

function maskNumber(d: string): string {
  return d.length < 6 ? "***" : `${d.slice(0, 3)}***${d.slice(-2)}`;
}
