import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  date,
  jsonb,
  uuid,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { pk, timestamps } from "./shared";
import { users } from "./identity";
import { leads } from "./crm";
import {
  dealType,
  referralStatus,
  offerStatus,
  dealStatus,
  paymentStatus,
  adPlatform,
  triState,
} from "./enums";

/** Buyer / referral network (master prompt §16). Amounts are whole TRY. */
export const buyers = pgTable(
  "buyers",
  {
    id: pk(),
    name: text("name").notNull(),
    companyName: text("company_name"),
    phone: text("phone"),
    whatsapp: text("whatsapp"),
    email: text("email"),
    cities: jsonb("cities").$type<string[]>().default([]).notNull(),
    categories: jsonb("categories").$type<string[]>().default([]).notNull(),
    minYear: integer("min_year"),
    maxYear: integer("max_year"),
    runningPref: triState("running_pref"), // yes/no/unknown(=any)
    reliability: integer("reliability"), // 1–5, internal
    commissionTerms: text("commission_terms"),
    notes: text("notes"),
    active: boolean("active").default(true).notNull(),
    lastActivityAt: timestamp("last_activity_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [index("buyers_active_idx").on(t.active)],
);

export const leadReferrals = pgTable(
  "lead_referrals",
  {
    id: pk(),
    leadId: uuid("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
    buyerId: uuid("buyer_id").notNull().references(() => buyers.id, { onDelete: "cascade" }),
    status: referralStatus("status").default("shared").notNull(),
    sharedSummary: text("shared_summary"), // redacted summary actually shared
    responseNote: text("response_note"),
    createdByUserId: uuid("created_by_user_id").references(() => users.id, { onDelete: "set null" }),
    respondedAt: timestamp("responded_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("referrals_lead_idx").on(t.leadId), index("referrals_buyer_idx").on(t.buyerId)],
);

export const buyerOffers = pgTable(
  "buyer_offers",
  {
    id: pk(),
    leadId: uuid("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
    buyerId: uuid("buyer_id").notNull().references(() => buyers.id, { onDelete: "cascade" }),
    referralId: uuid("referral_id").references(() => leadReferrals.id, { onDelete: "set null" }),
    amount: integer("amount").notNull(),
    currency: text("currency").default("TRY").notNull(),
    note: text("note"),
    status: offerStatus("status").default("pending").notNull(),
    selected: boolean("selected").default(false).notNull(),
    createdByUserId: uuid("created_by_user_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("buyer_offers_lead_idx").on(t.leadId)],
);

/** Offer presented to the vehicle owner. */
export const customerOffers = pgTable(
  "customer_offers",
  {
    id: pk(),
    leadId: uuid("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    currency: text("currency").default("TRY").notNull(),
    status: offerStatus("status").default("pending").notNull(),
    note: text("note"),
    createdByUserId: uuid("created_by_user_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("customer_offers_lead_idx").on(t.leadId)],
);

/** Deal & essential financials (master prompt §17). One deal per lead. */
export const deals = pgTable(
  "deals",
  {
    id: pk(),
    leadId: uuid("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }).unique(),
    type: dealType("type").default("undecided").notNull(),
    status: dealStatus("status").default("open").notNull(),

    customerAskingPrice: integer("customer_asking_price"),
    offerPresented: integer("offer_presented"),
    bestBuyerOffer: integer("best_buyer_offer"),
    agreedAmount: integer("agreed_amount"),
    directPurchasePrice: integer("direct_purchase_price"),
    directResalePrice: integer("direct_resale_price"),
    expectedCommission: integer("expected_commission"),
    actualCommission: integer("actual_commission"),
    adCostAllocated: integer("ad_cost_allocated").default(0).notNull(),

    netProfitAdjustment: integer("net_profit_adjustment"),
    adjustmentReason: text("adjustment_reason"),

    currency: text("currency").default("TRY").notNull(),
    paymentStatus: paymentStatus("payment_status").default("pending").notNull(),
    closingDate: timestamp("closing_date", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [index("deals_status_idx").on(t.status), index("deals_type_idx").on(t.type)],
);

export const dealExpenses = pgTable(
  "deal_expenses",
  {
    id: pk(),
    dealId: uuid("deal_id").notNull().references(() => deals.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    amount: integer("amount").notNull(),
    expenseDate: date("expense_date"),
    note: text("note"),
    createdByUserId: uuid("created_by_user_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("deal_expenses_deal_idx").on(t.dealId)],
);

export const adSpendDaily = pgTable(
  "ad_spend_daily",
  {
    id: pk(),
    platform: adPlatform("platform").notNull(),
    account: text("account"),
    campaign: text("campaign"),
    adGroup: text("ad_group"),
    spendDate: date("spend_date").notNull(),
    currency: text("currency").default("TRY").notNull(),
    spend: integer("spend").default(0).notNull(),
    impressions: integer("impressions").default(0).notNull(),
    clicks: integer("clicks").default(0).notNull(),
    source: text("source").default("manual").notNull(), // manual | import | api
    syncBatch: text("sync_batch"),
    notes: text("notes"),
    createdByUserId: uuid("created_by_user_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("adspend_date_idx").on(t.spendDate),
    uniqueIndex("adspend_unique").on(t.platform, t.campaign, t.spendDate, t.source),
  ],
);
