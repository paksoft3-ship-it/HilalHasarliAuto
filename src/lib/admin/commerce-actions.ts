"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
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
  auditLogs,
} from "@/db/schema";
import { requirePermission } from "@/lib/auth/guard";

function str(fd: FormData, k: string): string {
  return String(fd.get(k) ?? "").trim();
}
function money(fd: FormData, k: string): number | null {
  const v = str(fd, k).replace(/[^\d-]/g, "");
  return v ? parseInt(v, 10) : null;
}
function list(fd: FormData, k: string): string[] {
  return str(fd, k).split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
}
async function audit(userId: string, action: string, entityType: string, entityId?: string, summary?: string) {
  await requireDb().insert(auditLogs).values({ actorUserId: userId, action, entityType, entityId, summary });
}

// ---- Buyers ----
export async function saveBuyer(formData: FormData): Promise<void> {
  const user = await requirePermission("buyers.write");
  const id = str(formData, "id");
  const db = requireDb();
  const values = {
    name: str(formData, "name"),
    companyName: str(formData, "companyName") || null,
    phone: str(formData, "phone") || null,
    whatsapp: str(formData, "whatsapp") || null,
    email: str(formData, "email") || null,
    cities: list(formData, "cities"),
    categories: list(formData, "categories"),
    minYear: money(formData, "minYear"),
    maxYear: money(formData, "maxYear"),
    reliability: money(formData, "reliability"),
    commissionTerms: str(formData, "commissionTerms") || null,
    notes: str(formData, "notes") || null,
  };
  if (!values.name) return;

  if (id) {
    await db.update(buyers).set({ ...values, updatedAt: new Date() }).where(eq(buyers.id, id));
    await audit(user.id, "buyer.update", "buyer", id);
  } else {
    const [row] = await db.insert(buyers).values(values).returning({ id: buyers.id });
    await audit(user.id, "buyer.create", "buyer", row.id);
  }
  revalidatePath("/admin/buyers");
  redirect("/admin/buyers");
}

export async function toggleBuyer(formData: FormData): Promise<void> {
  const user = await requirePermission("buyers.write");
  const id = str(formData, "id");
  const active = str(formData, "active") === "true";
  if (!id) return;
  await requireDb().update(buyers).set({ active: !active, updatedAt: new Date() }).where(eq(buyers.id, id));
  await audit(user.id, "buyer.toggle", "buyer", id);
  revalidatePath("/admin/buyers");
}

// ---- Referrals & offers ----
export async function referToBuyers(formData: FormData): Promise<void> {
  const user = await requirePermission("referrals.write");
  const leadId = str(formData, "leadId");
  const buyerIds = formData.getAll("buyerIds").map(String).filter(Boolean);
  const summary = str(formData, "summary") || null;
  if (!leadId || buyerIds.length === 0) return;

  const db = requireDb();
  await db.insert(leadReferrals).values(
    buyerIds.map((buyerId) => ({ leadId, buyerId, sharedSummary: summary, createdByUserId: user.id })),
  );
  await audit(user.id, "lead.referral", "lead", leadId, `buyers:${buyerIds.length}`);
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function recordBuyerOffer(formData: FormData): Promise<void> {
  const user = await requirePermission("offers.write");
  const leadId = str(formData, "leadId");
  const buyerId = str(formData, "buyerId");
  const amount = money(formData, "amount");
  if (!leadId || !buyerId || amount == null) return;
  await requireDb().insert(buyerOffers).values({
    leadId, buyerId, amount, note: str(formData, "note") || null, createdByUserId: user.id,
  });
  await audit(user.id, "offer.buyer_record", "lead", leadId);
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function selectBuyerOffer(formData: FormData): Promise<void> {
  const user = await requirePermission("offers.write");
  const offerId = str(formData, "offerId");
  const leadId = str(formData, "leadId");
  if (!offerId || !leadId) return;
  const db = requireDb();
  await db.update(buyerOffers).set({ selected: false }).where(eq(buyerOffers.leadId, leadId));
  await db.update(buyerOffers).set({ selected: true, status: "accepted" }).where(eq(buyerOffers.id, offerId));
  await audit(user.id, "offer.buyer_select", "lead", leadId);
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function presentCustomerOffer(formData: FormData): Promise<void> {
  const user = await requirePermission("offers.write");
  const leadId = str(formData, "leadId");
  const amount = money(formData, "amount");
  if (!leadId || amount == null) return;
  await requireDb().insert(customerOffers).values({
    leadId, amount, note: str(formData, "note") || null, createdByUserId: user.id,
  });
  await audit(user.id, "offer.customer_present", "lead", leadId);
  revalidatePath(`/admin/leads/${leadId}`);
}

// ---- Deals ----
export async function createDealForLead(formData: FormData): Promise<void> {
  const user = await requirePermission("deals.write");
  const leadId = str(formData, "leadId");
  if (!leadId) return;
  const db = requireDb();
  const [existing] = await db.select({ id: deals.id }).from(deals).where(eq(deals.leadId, leadId)).limit(1);
  if (existing) redirect(`/admin/deals/${existing.id}`);

  const [lead] = await db.select({ dealType: leads.dealType }).from(leads).where(eq(leads.id, leadId)).limit(1);
  const [row] = await db
    .insert(deals)
    .values({ leadId, type: lead?.dealType ?? "undecided" })
    .returning({ id: deals.id });
  await audit(user.id, "deal.create", "deal", row.id, `lead:${leadId}`);
  redirect(`/admin/deals/${row.id}`);
}

export async function updateDeal(formData: FormData): Promise<void> {
  const user = await requirePermission("deals.write");
  const id = str(formData, "id");
  if (!id) return;
  const type = str(formData, "type");
  const status = str(formData, "status");
  const paymentStatus = str(formData, "paymentStatus");
  const patch: Record<string, unknown> = {
    customerAskingPrice: money(formData, "customerAskingPrice"),
    offerPresented: money(formData, "offerPresented"),
    bestBuyerOffer: money(formData, "bestBuyerOffer"),
    agreedAmount: money(formData, "agreedAmount"),
    directPurchasePrice: money(formData, "directPurchasePrice"),
    directResalePrice: money(formData, "directResalePrice"),
    expectedCommission: money(formData, "expectedCommission"),
    actualCommission: money(formData, "actualCommission"),
    adCostAllocated: money(formData, "adCostAllocated") ?? 0,
    netProfitAdjustment: money(formData, "netProfitAdjustment"),
    adjustmentReason: str(formData, "adjustmentReason") || null,
    updatedAt: new Date(),
  };
  if (["undecided", "broker_commission", "direct_purchase_resale"].includes(type)) patch.type = type;
  if (["pending", "partial", "paid"].includes(paymentStatus)) patch.paymentStatus = paymentStatus;
  if (["open", "won", "lost"].includes(status)) {
    patch.status = status;
    if (status === "won") patch.closingDate = new Date();
  }
  await requireDb().update(deals).set(patch).where(eq(deals.id, id));
  await audit(user.id, "deal.update", "deal", id);
  revalidatePath(`/admin/deals/${id}`);
  revalidatePath("/admin/deals");
}

export async function addDealExpense(formData: FormData): Promise<void> {
  const user = await requirePermission("deals.write");
  const dealId = str(formData, "dealId");
  const type = str(formData, "type");
  const amount = money(formData, "amount");
  if (!dealId || !type || amount == null) return;
  const dateRaw = str(formData, "expenseDate");
  await requireDb().insert(dealExpenses).values({
    dealId, type, amount, expenseDate: dateRaw || null, note: str(formData, "note") || null,
    createdByUserId: user.id,
  });
  await audit(user.id, "deal.expense_add", "deal", dealId);
  revalidatePath(`/admin/deals/${dealId}`);
}

// ---- Ad spend ----
export async function addAdSpend(formData: FormData): Promise<void> {
  const user = await requirePermission("adspend.write");
  const platform = str(formData, "platform");
  const spendDate = str(formData, "spendDate");
  if (!["google_ads", "meta_ads", "tiktok_ads", "other"].includes(platform) || !spendDate) return;
  await requireDb()
    .insert(adSpendDaily)
    .values({
      platform: platform as "google_ads" | "meta_ads" | "tiktok_ads" | "other",
      spendDate,
      account: str(formData, "account") || null,
      campaign: str(formData, "campaign") || null,
      spend: money(formData, "spend") ?? 0,
      impressions: money(formData, "impressions") ?? 0,
      clicks: money(formData, "clicks") ?? 0,
      notes: str(formData, "notes") || null,
      source: "manual",
      createdByUserId: user.id,
    })
    .onConflictDoNothing();
  await audit(user.id, "adspend.add", "ad_spend", undefined, platform);
  revalidatePath("/admin/adspend");
}

// ---- Deletes ----
export async function deleteBuyer(formData: FormData): Promise<void> {
  const user = await requirePermission("buyers.write");
  const id = str(formData, "id");
  if (!id) return;
  await requireDb().update(buyers).set({ deletedAt: new Date() }).where(eq(buyers.id, id));
  await audit(user.id, "buyer.delete", "buyer", id);
  revalidatePath("/admin/buyers");
  redirect(`/admin/buyers?ok=${encodeURIComponent("Alıcı silindi.")}`);
}

export async function deleteBuyerOffer(formData: FormData): Promise<void> {
  const user = await requirePermission("offers.write");
  const id = str(formData, "id");
  if (!id) return;
  const [row] = await requireDb().select({ leadId: buyerOffers.leadId }).from(buyerOffers).where(eq(buyerOffers.id, id)).limit(1);
  await requireDb().delete(buyerOffers).where(eq(buyerOffers.id, id));
  await audit(user.id, "offer.buyer.delete", "buyer_offer", id);
  if (row?.leadId) revalidatePath(`/admin/leads/${row.leadId}`);
  revalidatePath("/admin/offers");
  redirect(`/admin/offers?ok=${encodeURIComponent("Teklif silindi.")}`);
}

export async function deleteCustomerOffer(formData: FormData): Promise<void> {
  const user = await requirePermission("offers.write");
  const id = str(formData, "id");
  if (!id) return;
  const [row] = await requireDb().select({ leadId: customerOffers.leadId }).from(customerOffers).where(eq(customerOffers.id, id)).limit(1);
  await requireDb().delete(customerOffers).where(eq(customerOffers.id, id));
  await audit(user.id, "offer.customer.delete", "customer_offer", id);
  if (row?.leadId) revalidatePath(`/admin/leads/${row.leadId}`);
  revalidatePath("/admin/offers");
  redirect(`/admin/offers?ok=${encodeURIComponent("Teklif silindi.")}`);
}

export async function deleteDeal(formData: FormData): Promise<void> {
  const user = await requirePermission("deals.write");
  const id = str(formData, "id");
  if (!id) return;
  await requireDb().delete(dealExpenses).where(eq(dealExpenses.dealId, id));
  await requireDb().delete(deals).where(eq(deals.id, id));
  await audit(user.id, "deal.delete", "deal", id);
  revalidatePath("/admin/deals");
  redirect(`/admin/deals?ok=${encodeURIComponent("Anlaşma silindi.")}`);
}
