"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { requireDb } from "@/db";
import { whatsappThreads, whatsappMessages, calls, auditLogs } from "@/db/schema";
import { requirePermission } from "@/lib/auth/guard";
import { sendWhatsAppText } from "@/lib/comms/whatsapp";
import { recordCriticalEvent, enqueueConversion } from "@/db/repo/conversions";

export async function sendWhatsAppReply(formData: FormData): Promise<void> {
  const user = await requirePermission("whatsapp.read");
  const threadId = String(formData.get("threadId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!threadId || !body) return;

  const db = requireDb();
  const [thread] = await db.select().from(whatsappThreads).where(eq(whatsappThreads.id, threadId)).limit(1);
  if (!thread) return;

  const res = await sendWhatsAppText(thread.waId, body);
  await db.insert(whatsappMessages).values({
    threadId,
    direction: "outbound",
    waMessageId: res.messageId ?? null,
    body,
    status: res.ok ? (res.mock ? "mock" : "sent") : "failed",
    sentByUserId: user.id,
  });
  await db
    .update(whatsappThreads)
    .set({ lastMessageAt: new Date(), lastMessagePreview: body.slice(0, 120) })
    .where(eq(whatsappThreads.id, threadId));
  await db.insert(auditLogs).values({
    actorUserId: user.id, action: "whatsapp.reply", entityType: "whatsapp_thread", entityId: threadId,
  });
  revalidatePath(`/admin/whatsapp`);
}

export async function qualifyCallManually(formData: FormData): Promise<void> {
  const user = await requirePermission("calls.read");
  const callId = String(formData.get("callId") ?? "");
  if (!callId) return;

  const db = requireDb();
  const [call] = await db.select().from(calls).where(eq(calls.id, callId)).limit(1);
  if (!call || call.qualified) return;

  await db
    .update(calls)
    .set({ qualified: true, qualifiedReason: "manual", salesRepUserId: user.id, updatedAt: new Date() })
    .where(eq(calls.id, callId));
  await recordCriticalEvent("qualified_call", {
    leadId: call.leadId,
    dedupeId: `call_${call.id}`,
    source: { channel: "call", manual: true },
  });
  await enqueueConversion({
    platform: "google_ads",
    conversionAction: "qualified_call",
    leadId: call.leadId,
    dedupeKey: `call_${call.id}`,
  });
  await db.insert(auditLogs).values({
    actorUserId: user.id, action: "call.qualify_manual", entityType: "call", entityId: callId,
  });
  revalidatePath(`/admin/calls/${callId}`);
  revalidatePath("/admin/calls");
}
