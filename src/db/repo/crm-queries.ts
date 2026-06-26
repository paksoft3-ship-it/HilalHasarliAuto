import {
  and, count, desc, eq, gte, ilike, inArray, isNull, lte, notInArray, or, type SQL,
} from "drizzle-orm";
import { requireDb } from "@/db";
import {
  leads,
  vehicles,
  formSubmissions,
  leadStageHistory,
  leadNotes,
  tasks,
  users,
} from "@/db/schema";

export const WON_STAGES = [
  "accepted", "vehicle_purchased", "vehicle_sold", "broker_closed",
] as const;

export type QuickView = "all" | "mine" | "unassigned" | "high" | "followup" | "stale" | "won" | "lost";

export async function getAssignableUsers() {
  const db = requireDb();
  return db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(and(eq(users.isActive, true), isNull(users.deletedAt)))
    .orderBy(users.name);
}

export type LeadStageCode =
  | "new_lead" | "waiting_contact" | "contacted" | "missing_info" | "evaluation"
  | "referred_buyers" | "buyer_offers" | "offer_sent" | "negotiation" | "accepted"
  | "notary_pending" | "vehicle_purchased" | "preparing_sale" | "vehicle_sold"
  | "broker_closed" | "lost";

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getDashboardStats() {
  const db = requireDb();
  const active = isNull(leads.deletedAt);

  const [[total], [fresh], [today], [openTasks]] = await Promise.all([
    db.select({ v: count() }).from(leads).where(active),
    db.select({ v: count() }).from(leads).where(and(active, eq(leads.stage, "new_lead"))),
    db.select({ v: count() }).from(leads).where(and(active, gte(leads.createdAt, startOfToday()))),
    db.select({ v: count() }).from(tasks).where(inArray(tasks.status, ["open", "in_progress"])),
  ]);

  const recent = await db
    .select({
      id: leads.id,
      leadNumber: leads.leadNumber,
      fullName: leads.fullName,
      stage: leads.stage,
      source: leads.source,
      city: leads.city,
      createdAt: leads.createdAt,
    })
    .from(leads)
    .where(active)
    .orderBy(desc(leads.createdAt))
    .limit(8);

  return {
    total: total.v,
    newLeads: fresh.v,
    today: today.v,
    openTasks: openTasks.v,
    recent,
  };
}

const PAGE_SIZE = 20;

export interface LeadFilters {
  stage?: string;
  source?: string;
  q?: string;
  view?: QuickView;
  currentUserId?: string;
}

function buildConditions(f: LeadFilters): SQL[] {
  const conditions: SQL[] = [isNull(leads.deletedAt)];
  if (f.stage) conditions.push(eq(leads.stage, f.stage as LeadStageCode));
  if (f.source) conditions.push(eq(leads.source, f.source as never));
  if (f.q) {
    const like = `%${f.q}%`;
    const search = or(
      ilike(leads.fullName, like),
      ilike(leads.phone, like),
      ilike(leads.leadNumber, like),
    );
    if (search) conditions.push(search);
  }
  switch (f.view) {
    case "mine":
      if (f.currentUserId) conditions.push(eq(leads.assignedUserId, f.currentUserId));
      break;
    case "unassigned":
      conditions.push(isNull(leads.assignedUserId));
      break;
    case "high":
      conditions.push(inArray(leads.priority, ["high", "urgent"]));
      break;
    case "followup": {
      const dueCond = lte(leads.nextActionAt, new Date());
      if (dueCond) conditions.push(dueCond);
      break;
    }
    case "stale": {
      const threeDaysAgo = new Date(Date.now() - 3 * 86400000);
      conditions.push(isNull(leads.lastContactAt));
      const staleCond = lte(leads.createdAt, threeDaysAgo);
      if (staleCond) conditions.push(staleCond);
      conditions.push(notInArray(leads.stage, [...WON_STAGES, "lost"]));
      break;
    }
    case "won":
      conditions.push(inArray(leads.stage, [...WON_STAGES]));
      break;
    case "lost":
      conditions.push(eq(leads.stage, "lost"));
      break;
  }
  return conditions;
}

export async function listLeads(params: LeadFilters & { page?: number }) {
  const db = requireDb();
  const where = and(...buildConditions(params));
  const page = Math.max(1, params.page ?? 1);

  const [rows, [{ v: total }]] = await Promise.all([
    db
      .select({
        id: leads.id,
        leadNumber: leads.leadNumber,
        fullName: leads.fullName,
        phone: leads.phone,
        stage: leads.stage,
        source: leads.source,
        city: leads.city,
        score: leads.score,
        assignedUserId: leads.assignedUserId,
        assignedName: users.name,
        createdAt: leads.createdAt,
      })
      .from(leads)
      .leftJoin(users, eq(leads.assignedUserId, users.id))
      .where(where)
      .orderBy(desc(leads.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ v: count() }).from(leads).where(where),
  ]);

  // Vehicle summary per lead.
  const ids = rows.map((r) => r.id);
  const vrows = ids.length
    ? await db
        .select({ leadId: vehicles.leadId, brand: vehicles.brand, model: vehicles.model, category: vehicles.category })
        .from(vehicles)
        .where(inArray(vehicles.leadId, ids))
    : [];
  const vmap = new Map(vrows.map((v) => [v.leadId, v]));

  return {
    rows: rows.map((r) => ({ ...r, vehicle: vmap.get(r.id) ?? null })),
    total,
    page,
    pageSize: PAGE_SIZE,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

/** Active-lead counts per stage, for the pipeline overview strip. */
export async function getStageCounts(): Promise<Record<string, number>> {
  const db = requireDb();
  const rows = await db
    .select({ stage: leads.stage, v: count() })
    .from(leads)
    .where(isNull(leads.deletedAt))
    .groupBy(leads.stage);
  return Object.fromEntries(rows.map((r) => [r.stage, Number(r.v)]));
}

export async function getLeadsByStage() {
  const db = requireDb();
  const rows = await db
    .select({
      id: leads.id,
      leadNumber: leads.leadNumber,
      fullName: leads.fullName,
      stage: leads.stage,
      city: leads.city,
      score: leads.score,
      createdAt: leads.createdAt,
    })
    .from(leads)
    .where(isNull(leads.deletedAt))
    .orderBy(desc(leads.createdAt))
    .limit(500);
  return rows;
}

export async function getLeadDetail(id: string) {
  const db = requireDb();
  const [lead] = await db
    .select()
    .from(leads)
    .leftJoin(users, eq(leads.assignedUserId, users.id))
    .where(eq(leads.id, id))
    .limit(1);
  if (!lead) return null;

  const [vehicleRows, submissions, history, notes, leadTasks] = await Promise.all([
    db.select().from(vehicles).where(eq(vehicles.leadId, id)),
    db.select().from(formSubmissions).where(eq(formSubmissions.leadId, id)).orderBy(desc(formSubmissions.createdAt)),
    db.select().from(leadStageHistory).where(eq(leadStageHistory.leadId, id)).orderBy(desc(leadStageHistory.createdAt)),
    db
      .select({
        id: leadNotes.id,
        body: leadNotes.body,
        createdAt: leadNotes.createdAt,
        authorName: users.name,
      })
      .from(leadNotes)
      .leftJoin(users, eq(leadNotes.userId, users.id))
      .where(and(eq(leadNotes.leadId, id), isNull(leadNotes.deletedAt)))
      .orderBy(desc(leadNotes.createdAt)),
    db
      .select({
        id: tasks.id,
        title: tasks.title,
        status: tasks.status,
        dueAt: tasks.dueAt,
        assigneeName: users.name,
      })
      .from(tasks)
      .leftJoin(users, eq(tasks.assignedUserId, users.id))
      .where(eq(tasks.leadId, id))
      .orderBy(desc(tasks.createdAt)),
  ]);

  return {
    lead: lead.leads,
    assignedUser: lead.users,
    vehicle: vehicleRows[0] ?? null,
    submissions,
    history,
    notes,
    tasks: leadTasks,
  };
}

/** Flat rows for CSV export (capped). Honors the same filters as the list. */
export async function getLeadsForExport(filters: LeadFilters) {
  const db = requireDb();
  const where = and(...buildConditions(filters));
  return db
    .select({
      leadNumber: leads.leadNumber,
      fullName: leads.fullName,
      phone: leads.phone,
      email: leads.email,
      stage: leads.stage,
      source: leads.source,
      priority: leads.priority,
      city: leads.city,
      district: leads.district,
      score: leads.score,
      createdAt: leads.createdAt,
    })
    .from(leads)
    .where(where)
    .orderBy(desc(leads.createdAt))
    .limit(5000);
}
