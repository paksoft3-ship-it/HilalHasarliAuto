import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { requireDb } from "@/db";
import {
  buyerOffers, customerOffers, leads, buyers, users, roles, userRoles,
  siteSettings, integrationSettings, auditLogs, contentItems,
} from "@/db/schema";

// ---- Offers ----
export async function getOffersOverview() {
  const db = requireDb();
  const [buyer, customer] = await Promise.all([
    db
      .select({
        id: buyerOffers.id, amount: buyerOffers.amount, status: buyerOffers.status,
        selected: buyerOffers.selected, createdAt: buyerOffers.createdAt,
        buyerName: buyers.name, leadId: buyerOffers.leadId, leadName: leads.fullName,
      })
      .from(buyerOffers)
      .leftJoin(buyers, eq(buyerOffers.buyerId, buyers.id))
      .leftJoin(leads, eq(buyerOffers.leadId, leads.id))
      .orderBy(desc(buyerOffers.createdAt))
      .limit(100),
    db
      .select({
        id: customerOffers.id, amount: customerOffers.amount, status: customerOffers.status,
        createdAt: customerOffers.createdAt, leadId: customerOffers.leadId, leadName: leads.fullName,
      })
      .from(customerOffers)
      .leftJoin(leads, eq(customerOffers.leadId, leads.id))
      .orderBy(desc(customerOffers.createdAt))
      .limit(100),
  ]);
  return { buyerOffers: buyer, customerOffers: customer };
}

// ---- Users ----
export async function getUsersWithRoles() {
  const db = requireDb();
  const us = await db
    .select({
      id: users.id, email: users.email, name: users.name,
      isActive: users.isActive, lastLoginAt: users.lastLoginAt, createdAt: users.createdAt,
    })
    .from(users)
    .where(isNull(users.deletedAt))
    .orderBy(users.name);
  const ur = await db
    .select({ userId: userRoles.userId, roleCode: roles.code, roleName: roles.name })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id));
  const roleMap = new Map<string, string[]>();
  for (const r of ur) {
    const arr = roleMap.get(r.userId) ?? [];
    arr.push(r.roleName);
    roleMap.set(r.userId, arr);
  }
  return us.map((u) => ({ ...u, roles: roleMap.get(u.id) ?? [] }));
}

export async function listRoles() {
  return requireDb().select({ id: roles.id, code: roles.code, name: roles.name }).from(roles).orderBy(roles.name);
}

// ---- Settings ----
export async function getSiteSettings() {
  const rows = await requireDb().select().from(siteSettings).orderBy(siteSettings.key);
  return rows;
}
export async function getIntegrations() {
  return requireDb().select().from(integrationSettings).orderBy(integrationSettings.provider);
}

// ---- Audit ----
const AUDIT_PAGE = 50;
export async function listAuditLogs(params: { action?: string; page?: number }) {
  const db = requireDb();
  const where = params.action ? eq(auditLogs.action, params.action) : undefined;
  const page = Math.max(1, params.page ?? 1);
  const [rows, [{ v: total }]] = await Promise.all([
    db
      .select({
        id: auditLogs.id, action: auditLogs.action, entityType: auditLogs.entityType,
        entityId: auditLogs.entityId, summary: auditLogs.summary, createdAt: auditLogs.createdAt,
        actorName: users.name,
      })
      .from(auditLogs)
      .leftJoin(users, eq(auditLogs.actorUserId, users.id))
      .where(where)
      .orderBy(desc(auditLogs.createdAt))
      .limit(AUDIT_PAGE)
      .offset((page - 1) * AUDIT_PAGE),
    db.select({ v: sql<number>`count(*)::int` }).from(auditLogs).where(where),
  ]);
  return { rows, total: Number(total), page, pageCount: Math.max(1, Math.ceil(Number(total) / AUDIT_PAGE)) };
}

// ---- SEO overview ----
export async function getSeoOverview() {
  const db = requireDb();
  const byStatus = await db
    .select({ status: contentItems.status, count: sql<number>`count(*)::int` })
    .from(contentItems)
    .where(isNull(contentItems.deletedAt))
    .groupBy(contentItems.status);
  const [missingSeo] = await db
    .select({ v: sql<number>`count(*)::int` })
    .from(contentItems)
    .where(and(eq(contentItems.status, "published"), isNull(contentItems.seoDescription)));
  return {
    byStatus: byStatus.map((s) => ({ status: s.status, count: Number(s.count) })),
    publishedMissingSeo: Number(missingSeo.v),
  };
}
