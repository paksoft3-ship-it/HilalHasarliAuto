import {
  pgTable,
  text,
  integer,
  timestamp,
  jsonb,
  uuid,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { pk } from "./shared";
import { users } from "./identity";
import { jobStatus } from "./enums";

/** Append-only audit trail. PII is redacted in metadata. */
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: pk(),
    actorUserId: uuid("actor_user_id").references(() => users.id, { onDelete: "set null" }),
    action: text("action").notNull(), // login, lead.stage_change, content.publish, export, ...
    entityType: text("entity_type"),
    entityId: text("entity_id"),
    summary: text("summary"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    ip: text("ip"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("audit_actor_idx").on(t.actorUserId),
    index("audit_action_idx").on(t.action),
    index("audit_created_idx").on(t.createdAt),
  ],
);

/** Database-backed job/outbox for retries and idempotency. */
export const backgroundJobs = pgTable(
  "background_jobs",
  {
    id: pk(),
    type: text("type").notNull(),
    status: jobStatus("status").default("pending").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().default({}).notNull(),
    attempts: integer("attempts").default(0).notNull(),
    maxAttempts: integer("max_attempts").default(5).notNull(),
    runAfter: timestamp("run_after", { withTimezone: true }).defaultNow().notNull(),
    lockedAt: timestamp("locked_at", { withTimezone: true }),
    lastError: text("last_error"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("jobs_status_runafter_idx").on(t.status, t.runAfter)],
);

/** Raw webhook events with idempotency + replay protection. */
export const webhookEvents = pgTable(
  "webhook_events",
  {
    id: pk(),
    provider: text("provider").notNull(),
    eventId: text("event_id").notNull(),
    signatureValid: boolean("signature_valid").default(false).notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
    status: text("status").default("received").notNull(),
    error: text("error"),
    receivedAt: timestamp("received_at", { withTimezone: true }).defaultNow().notNull(),
    processedAt: timestamp("processed_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("webhook_provider_event_unique").on(t.provider, t.eventId)],
);
