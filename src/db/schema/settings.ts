import { pgTable, text, boolean, jsonb, uuid } from "drizzle-orm/pg-core";
import { pk, timestamps } from "./shared";
import { users } from "./identity";

/** Key/value store for editable brand, contact and global settings. */
export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").$type<unknown>(),
  updatedBy: uuid("updated_by").references(() => users.id),
  ...timestamps,
});

/** Per-provider integration config + test-mode flag (secrets referenced, not stored raw). */
export const integrationSettings = pgTable("integration_settings", {
  id: pk(),
  provider: text("provider").notNull().unique(), // gsc, google_ads, ga4, gtm, clarity, whatsapp, call_tracking, ...
  enabled: boolean("enabled").default(false).notNull(),
  testMode: boolean("test_mode").default(true).notNull(),
  config: jsonb("config").$type<Record<string, unknown>>().default({}).notNull(),
  ...timestamps,
});

export const featureFlags = pgTable("feature_flags", {
  key: text("key").primaryKey(),
  enabled: boolean("enabled").default(false).notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>().default({}).notNull(),
  ...timestamps,
});
