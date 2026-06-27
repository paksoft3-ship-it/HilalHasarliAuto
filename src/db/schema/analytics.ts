import {
  pgTable,
  text,
  integer,
  timestamp,
  jsonb,
  uuid,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { pk } from "./shared";
import { leads } from "./crm";
import { deals } from "./finance";

/**
 * First-party business-critical events (master prompt §12 event taxonomy).
 * The source of truth for funnel/revenue analytics, independent of GA4.
 */
export const criticalEvents = pgTable(
  "critical_events",
  {
    id: pk(),
    name: text("name").notNull(), // lead_created, qualified_call, ...
    version: integer("version").default(1).notNull(),
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
    entityType: text("entity_type"),
    entityId: text("entity_id"),
    sessionId: text("session_id"),
    pageUrl: text("page_url"),
    referrer: text("referrer"),
    source: jsonb("source").$type<Record<string, unknown>>(), // campaign/click ids
    consentSnapshot: jsonb("consent_snapshot").$type<Record<string, unknown>>(),
    dedupeId: text("dedupe_id"),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("critical_events_name_idx").on(t.name),
    index("critical_events_lead_idx").on(t.leadId),
    uniqueIndex("critical_events_dedupe_idx").on(t.dedupeId),
  ],
);

/**
 * Outbound offline conversion queue (master prompt §12). Provider adapters
 * (Google Ads / Meta / TikTok) drain this; dedupeKey prevents double-sends.
 */
export const conversionExports = pgTable(
  "conversion_exports",
  {
    id: pk(),
    platform: text("platform").notNull(), // google_ads, meta, tiktok
    conversionAction: text("conversion_action").notNull(),
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
    dealId: uuid("deal_id").references(() => deals.id, { onDelete: "set null" }),
    clickIds: jsonb("click_ids").$type<Record<string, string>>(),
    hashedUserData: jsonb("hashed_user_data").$type<Record<string, string>>(),
    conversionTime: timestamp("conversion_time", { withTimezone: true }).notNull(),
    currency: text("currency").default("TRY").notNull(),
    value: integer("value"),
    consentState: jsonb("consent_state").$type<Record<string, unknown>>(),
    dedupeKey: text("dedupe_key").notNull(),
    status: text("status").default("pending").notNull(), // pending, sent, failed, skipped
    attemptCount: integer("attempt_count").default(0).notNull(),
    response: text("response"),
    error: text("error"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("conversion_exports_dedupe_idx").on(t.dedupeKey),
    index("conversion_exports_status_idx").on(t.status),
  ],
);
