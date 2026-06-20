import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import { requireDb } from "@/db";
import {
  buyers,
  leadReferrals,
  buyerOffers,
  customerOffers,
  deals,
  dealExpenses,
  adSpendDaily,
  leads,
  users,
} from "@/db/schema";
import { computeDealFinancials } from "@/lib/finance/calc";

// ---- Buyers ----
export async function listBuyers(activeOnly = false) {
  const db = requireDb();
  const where = activeOnly
    ? and(isNull(buyers.deletedAt), eq(buyers.active, true))
    : isNull(buyers.deletedAt);
  return db.select().from(buyers).where(where).orderBy(buyers.name);
}

export async function getBuyer(id: string) {
  const db = requireDb();
  const [row] = await db.select().from(buyers).where(eq(buyers.id, id)).limit(1);
  return row ?? null;
}

// ---- Lead commercial bundle (referrals + offers + deal) ----
export async function getLeadCommercial(leadId: string) {
  const db = requireDb();
  const [referrals, offers, custOffers, dealRow] = await Promise.all([
    db
      .select({
        id: leadReferrals.id,
        status: leadReferrals.status,
        createdAt: leadReferrals.createdAt,
        buyerName: buyers.name,
      })
      .from(leadReferrals)
      .leftJoin(buyers, eq(leadReferrals.buyerId, buyers.id))
      .where(eq(leadReferrals.leadId, leadId))
      .orderBy(desc(leadReferrals.createdAt)),
    db
      .select({
        id: buyerOffers.id,
        amount: buyerOffers.amount,
        status: buyerOffers.status,
        selected: buyerOffers.selected,
        note: buyerOffers.note,
        createdAt: buyerOffers.createdAt,
        buyerName: buyers.name,
      })
      .from(buyerOffers)
      .leftJoin(buyers, eq(buyerOffers.buyerId, buyers.id))
      .where(eq(buyerOffers.leadId, leadId))
      .orderBy(desc(buyerOffers.amount)),
    db.select().from(customerOffers).where(eq(customerOffers.leadId, leadId)).orderBy(desc(customerOffers.createdAt)),
    db.select().from(deals).where(eq(deals.leadId, leadId)).limit(1),
  ]);
  return { referrals, offers, customerOffers: custOffers, deal: dealRow[0] ?? null };
}

async function expenseTotals(dealIds: string[]): Promise<Map<string, number>> {
  if (!dealIds.length) return new Map();
  const db = requireDb();
  const rows = await db
    .select({ dealId: dealExpenses.dealId, total: sql<number>`coalesce(sum(${dealExpenses.amount}),0)::int` })
    .from(dealExpenses)
    .where(inArray(dealExpenses.dealId, dealIds))
    .groupBy(dealExpenses.dealId);
  return new Map(rows.map((r) => [r.dealId, Number(r.total)]));
}

// ---- Deals ----
export async function listDeals() {
  const db = requireDb();
  const rows = await db
    .select({
      id: deals.id,
      leadId: deals.leadId,
      type: deals.type,
      status: deals.status,
      currency: deals.currency,
      actualCommission: deals.actualCommission,
      directPurchasePrice: deals.directPurchasePrice,
      directResalePrice: deals.directResalePrice,
      adCostAllocated: deals.adCostAllocated,
      netProfitAdjustment: deals.netProfitAdjustment,
      leadNumber: leads.leadNumber,
      leadName: leads.fullName,
      createdAt: deals.createdAt,
    })
    .from(deals)
    .leftJoin(leads, eq(deals.leadId, leads.id))
    .orderBy(desc(deals.createdAt))
    .limit(200);

  const totals = await expenseTotals(rows.map((r) => r.id));
  return rows.map((r) => {
    const fin = computeDealFinancials(r, totals.get(r.id) ?? 0);
    return { ...r, ...fin };
  });
}

export async function getDealDetail(id: string) {
  const db = requireDb();
  const [row] = await db
    .select()
    .from(deals)
    .leftJoin(leads, eq(deals.leadId, leads.id))
    .where(eq(deals.id, id))
    .limit(1);
  if (!row) return null;
  const expenses = await db.select().from(dealExpenses).where(eq(dealExpenses.dealId, id)).orderBy(desc(dealExpenses.createdAt));
  const expTotal = expenses.reduce((s, e) => s + e.amount, 0);
  const fin = computeDealFinancials(row.deals, expTotal);
  return { deal: row.deals, lead: row.leads, expenses, financials: fin };
}

// ---- Finance summary ----
export async function getFinanceSummary() {
  const db = requireDb();
  const wonDeals = await db.select().from(deals).where(eq(deals.status, "won"));
  const totals = await expenseTotals(wonDeals.map((d) => d.id));

  let grossRevenue = 0;
  let netProfit = 0;
  for (const d of wonDeals) {
    const fin = computeDealFinancials(d, totals.get(d.id) ?? 0);
    grossRevenue += fin.grossRevenue;
    netProfit += fin.netProfit;
  }

  const [[leadCount], [adSpendRow], [openDeals]] = await Promise.all([
    db.select({ v: sql<number>`count(*)::int` }).from(leads).where(isNull(leads.deletedAt)),
    db.select({ v: sql<number>`coalesce(sum(${adSpendDaily.spend}),0)::int` }).from(adSpendDaily),
    db.select({ v: sql<number>`count(*)::int` }).from(deals).where(eq(deals.status, "open")),
  ]);

  return {
    leadsTotal: Number(leadCount.v),
    dealsWon: wonDeals.length,
    dealsOpen: Number(openDeals.v),
    grossRevenue,
    netProfit,
    adSpendTotal: Number(adSpendRow.v),
  };
}

// ---- Ad spend ----
export async function listAdSpend() {
  const db = requireDb();
  return db.select().from(adSpendDaily).orderBy(desc(adSpendDaily.spendDate)).limit(200);
}

export async function activeUsersCount() {
  const db = requireDb();
  const [r] = await db.select({ v: sql<number>`count(*)::int` }).from(users);
  return Number(r.v);
}
