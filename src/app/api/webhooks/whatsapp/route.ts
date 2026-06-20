import { type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { isDbConfigured, requireDb } from "@/db";
import { whatsappThreads, whatsappMessages, webhookEvents, leads } from "@/db/schema";
import { comms } from "@/config/comms";
import {
  verifyWhatsAppSignature,
  parseInboundMessages,
} from "@/lib/comms/whatsapp";
import { normalizePhone } from "@/lib/leads/schema";
import { recordCriticalEvent, enqueueConversion } from "@/db/repo/conversions";

// Webhook verification handshake (Meta).
export function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const mode = sp.get("hub.mode");
  const token = sp.get("hub.verify_token");
  const challenge = sp.get("hub.challenge");
  if (mode === "subscribe" && token && token === comms.whatsapp.verifyToken) {
    return new Response(challenge ?? "", { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get("x-hub-signature-256");
  if (!verifyWhatsAppSignature(raw, signature)) {
    return new Response("Invalid signature", { status: 401 });
  }
  // Always 200 so Meta doesn't retry; skip processing if no DB.
  if (!isDbConfigured) return new Response("ok", { status: 200 });

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return new Response("ok", { status: 200 });
  }

  const db = requireDb();
  const messages = parseInboundMessages(payload);

  for (const m of messages) {
    if (!m.waMessageId) continue;
    // Idempotency.
    const [logged] = await db
      .insert(webhookEvents)
      .values({ provider: "whatsapp", eventId: m.waMessageId, signatureValid: true, status: "received" })
      .onConflictDoNothing({ target: [webhookEvents.provider, webhookEvents.eventId] })
      .returning({ id: webhookEvents.id });
    if (!logged) continue; // already processed

    // Upsert thread.
    let [thread] = await db.select().from(whatsappThreads).where(eq(whatsappThreads.waId, m.waId)).limit(1);
    const isNewThread = !thread;
    if (!thread) {
      [thread] = await db.insert(whatsappThreads).values({ waId: m.waId }).returning();
    }

    // Associate lead by phone if not linked.
    if (!thread.leadId) {
      const phone = normalizePhone(m.waId);
      const [lead] = await db.select({ id: leads.id }).from(leads).where(eq(leads.phoneNormalized, phone)).limit(1);
      if (lead) {
        await db.update(whatsappThreads).set({ leadId: lead.id }).where(eq(whatsappThreads.id, thread.id));
        thread.leadId = lead.id;
      }
    }

    // Store message (deduped).
    await db
      .insert(whatsappMessages)
      .values({
        threadId: thread.id,
        direction: "inbound",
        waMessageId: m.waMessageId,
        type: m.type,
        body: m.body ?? null,
        status: "received",
      })
      .onConflictDoNothing({ target: whatsappMessages.waMessageId });

    await db
      .update(whatsappThreads)
      .set({ lastMessageAt: new Date(), lastMessagePreview: (m.body ?? m.type).slice(0, 120) })
      .where(eq(whatsappThreads.id, thread.id));

    // First inbound message = a real conversation started (primary conversion).
    if (isNewThread) {
      await recordCriticalEvent("whatsapp_conversation_started", {
        leadId: thread.leadId,
        dedupeId: `wa_conv_${thread.id}`,
        source: { channel: "whatsapp" },
      });
      await enqueueConversion({
        platform: "google_ads",
        conversionAction: "whatsapp_conversation_started",
        leadId: thread.leadId,
        dedupeKey: `wa_conv_${thread.id}`,
      });
    }
  }

  return new Response("ok", { status: 200 });
}
