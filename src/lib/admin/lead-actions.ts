"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { requireDb } from "@/db";
import {
  leads,
  leadStageHistory,
  leadNotes,
  leadAssignments,
  tasks,
  auditLogs,
} from "@/db/schema";
import { requirePermission } from "@/lib/auth/guard";
import type { LeadStageCode } from "@/db/repo/crm-queries";

const STAGES = new Set<LeadStageCode>([
  "new_lead", "waiting_contact", "contacted", "missing_info", "evaluation",
  "referred_buyers", "buyer_offers", "offer_sent", "negotiation", "accepted",
  "notary_pending", "vehicle_purchased", "preparing_sale", "vehicle_sold",
  "broker_closed", "lost",
]);
const PRIORITIES = new Set(["low", "normal", "high", "urgent"]);
const DEAL_TYPES = new Set(["undecided", "broker_commission", "direct_purchase_resale"]);

function revalidateLead(leadId: string) {
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");
  revalidatePath("/admin/funnel");
}

export async function deleteLead(formData: FormData): Promise<void> {
  const user = await requirePermission("leads.delete");
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  await requireDb().update(leads).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(leads.id, id));
  await requireDb().insert(auditLogs).values({ actorUserId: user.id, action: "lead.delete", entityType: "lead", entityId: id });
  revalidatePath("/admin/leads");
  revalidatePath("/admin/funnel");
  redirect(`/admin/leads?ok=${encodeURIComponent("Talep silindi.")}`);
}

export async function changeLeadStage(formData: FormData): Promise<void> {
  const user = await requirePermission("leads.write");
  const leadId = String(formData.get("leadId") ?? "");
  const toStage = String(formData.get("toStage") ?? "") as LeadStageCode;
  const reason = String(formData.get("reason") ?? "").trim();
  const lossReason = String(formData.get("lossReason") ?? "").trim();
  if (!leadId || !STAGES.has(toStage)) return;

  const db = requireDb();
  const [current] = await db.select({ stage: leads.stage }).from(leads).where(eq(leads.id, leadId)).limit(1);
  if (!current || current.stage === toStage) return;

  // Loss reason is required when moving to Lost.
  const finalReason = toStage === "lost" ? lossReason || reason : reason || null;
  if (toStage === "lost" && !finalReason) return;

  await db
    .update(leads)
    .set({
      stage: toStage,
      lossReason: toStage === "lost" ? finalReason : null,
      updatedAt: new Date(),
    })
    .where(eq(leads.id, leadId));
  await db.insert(leadStageHistory).values({
    leadId,
    fromStage: current.stage,
    toStage,
    changedByUserId: user.id,
    reason: finalReason,
  });
  await db.insert(auditLogs).values({
    actorUserId: user.id,
    action: "lead.stage_change",
    entityType: "lead",
    entityId: leadId,
    summary: `${current.stage} → ${toStage}`,
  });
  revalidateLead(leadId);
}

export async function addLeadNote(formData: FormData): Promise<void> {
  const user = await requirePermission("leads.write");
  const leadId = String(formData.get("leadId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!leadId || body.length < 1) return;

  const db = requireDb();
  await db.insert(leadNotes).values({ leadId, userId: user.id, body });
  await db.insert(auditLogs).values({
    actorUserId: user.id, action: "lead.note_create", entityType: "lead", entityId: leadId,
  });
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function assignLead(formData: FormData): Promise<void> {
  const user = await requirePermission("leads.assign");
  const leadId = String(formData.get("leadId") ?? "");
  const raw = String(formData.get("userId") ?? "");
  const userId = raw || null;
  if (!leadId) return;

  const db = requireDb();
  await db.update(leads).set({ assignedUserId: userId, updatedAt: new Date() }).where(eq(leads.id, leadId));
  if (userId) {
    await db.insert(leadAssignments).values({
      leadId, userId, assignedByUserId: user.id, strategy: "manual",
    });
  }
  await db.insert(auditLogs).values({
    actorUserId: user.id, action: "lead.assign", entityType: "lead", entityId: leadId,
    summary: userId ? `assigned:${userId}` : "unassigned",
  });
  revalidateLead(leadId);
}

export async function updateLeadDetails(formData: FormData): Promise<void> {
  const user = await requirePermission("leads.write");
  const leadId = String(formData.get("leadId") ?? "");
  const priority = String(formData.get("priority") ?? "");
  const dealType = String(formData.get("dealType") ?? "");
  const nextAction = String(formData.get("nextActionAt") ?? "").trim();
  if (!leadId) return;

  const patch: Record<string, unknown> = { updatedAt: new Date() };
  if (PRIORITIES.has(priority)) patch.priority = priority;
  if (DEAL_TYPES.has(dealType)) patch.dealType = dealType;
  if (nextAction) {
    const d = new Date(nextAction);
    if (!Number.isNaN(d.getTime())) patch.nextActionAt = d;
  } else {
    patch.nextActionAt = null;
  }

  const db = requireDb();
  await db.update(leads).set(patch).where(eq(leads.id, leadId));
  await db.insert(auditLogs).values({
    actorUserId: user.id, action: "lead.update", entityType: "lead", entityId: leadId,
  });
  revalidateLead(leadId);
}

export async function markContacted(formData: FormData): Promise<void> {
  const user = await requirePermission("leads.write");
  const leadId = String(formData.get("leadId") ?? "");
  if (!leadId) return;

  const db = requireDb();
  const [current] = await db.select({ stage: leads.stage }).from(leads).where(eq(leads.id, leadId)).limit(1);
  if (!current) return;
  const advance = current.stage === "new_lead" || current.stage === "waiting_contact";

  await db
    .update(leads)
    .set({ lastContactAt: new Date(), stage: advance ? "contacted" : current.stage, updatedAt: new Date() })
    .where(eq(leads.id, leadId));
  if (advance) {
    await db.insert(leadStageHistory).values({
      leadId, fromStage: current.stage, toStage: "contacted", changedByUserId: user.id, reason: "İletişime geçildi",
    });
  }
  await db.insert(auditLogs).values({
    actorUserId: user.id, action: "lead.contacted", entityType: "lead", entityId: leadId,
  });
  revalidateLead(leadId);
}

export async function addTask(formData: FormData): Promise<void> {
  const user = await requirePermission("leads.write");
  const leadId = String(formData.get("leadId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const dueRaw = String(formData.get("dueAt") ?? "").trim();
  if (!leadId || !title) return;

  let dueAt: Date | undefined;
  if (dueRaw) {
    const d = new Date(dueRaw);
    if (!Number.isNaN(d.getTime())) dueAt = d;
  }

  const db = requireDb();
  await db.insert(tasks).values({
    leadId, title, dueAt, assignedUserId: user.id, createdByUserId: user.id, status: "open",
  });
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function completeTask(formData: FormData): Promise<void> {
  const user = await requirePermission("leads.write");
  const taskId = String(formData.get("taskId") ?? "");
  const leadId = String(formData.get("leadId") ?? "");
  if (!taskId) return;

  const db = requireDb();
  await db
    .update(tasks)
    .set({ status: "done", completedAt: new Date(), updatedAt: new Date() })
    .where(eq(tasks.id, taskId));
  await db.insert(auditLogs).values({
    actorUserId: user.id, action: "task.complete", entityType: "task", entityId: taskId,
  });
  if (leadId) revalidatePath(`/admin/leads/${leadId}`);
}
