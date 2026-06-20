import { desc, eq, sql } from "drizzle-orm";
import { requireDb } from "@/db";
import { whatsappThreads, whatsappMessages, calls, callEvents, leads } from "@/db/schema";

export async function listThreads() {
  const db = requireDb();
  return db
    .select({
      id: whatsappThreads.id,
      waId: whatsappThreads.waId,
      status: whatsappThreads.status,
      lastMessageAt: whatsappThreads.lastMessageAt,
      lastMessagePreview: whatsappThreads.lastMessagePreview,
      leadId: whatsappThreads.leadId,
      leadName: leads.fullName,
    })
    .from(whatsappThreads)
    .leftJoin(leads, eq(whatsappThreads.leadId, leads.id))
    .orderBy(sql`${whatsappThreads.lastMessageAt} desc nulls last`)
    .limit(100);
}

export async function getThread(id: string) {
  const db = requireDb();
  const [thread] = await db
    .select({
      id: whatsappThreads.id,
      waId: whatsappThreads.waId,
      status: whatsappThreads.status,
      leadId: whatsappThreads.leadId,
      leadName: leads.fullName,
    })
    .from(whatsappThreads)
    .leftJoin(leads, eq(whatsappThreads.leadId, leads.id))
    .where(eq(whatsappThreads.id, id))
    .limit(1);
  if (!thread) return null;
  const messages = await db
    .select()
    .from(whatsappMessages)
    .where(eq(whatsappMessages.threadId, id))
    .orderBy(whatsappMessages.occurredAt);
  return { thread, messages };
}

export async function listCalls() {
  const db = requireDb();
  return db
    .select({
      id: calls.id,
      status: calls.status,
      durationSec: calls.durationSec,
      callerNumber: calls.callerNumber,
      campaign: calls.campaign,
      qualified: calls.qualified,
      leadId: calls.leadId,
      leadName: leads.fullName,
      createdAt: calls.createdAt,
    })
    .from(calls)
    .leftJoin(leads, eq(calls.leadId, leads.id))
    .orderBy(desc(calls.createdAt))
    .limit(200);
}

export async function getCall(id: string) {
  const db = requireDb();
  const [row] = await db
    .select()
    .from(calls)
    .leftJoin(leads, eq(calls.leadId, leads.id))
    .where(eq(calls.id, id))
    .limit(1);
  if (!row) return null;
  const events = await db.select().from(callEvents).where(eq(callEvents.callId, id)).orderBy(callEvents.occurredAt);
  return { call: row.calls, lead: row.leads, events };
}
