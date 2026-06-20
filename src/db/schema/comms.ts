import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  uuid,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { pk, timestamps } from "./shared";
import { users } from "./identity";
import { leads } from "./crm";
import {
  callStatus,
  messageDirection,
  threadStatus,
  notificationChannel,
  notificationStatus,
} from "./enums";

/** WhatsApp conversation threads (Cloud API). */
export const whatsappThreads = pgTable(
  "whatsapp_threads",
  {
    id: pk(),
    waId: text("wa_id").notNull(), // customer phone (WhatsApp id)
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
    assignedUserId: uuid("assigned_user_id").references(() => users.id, { onDelete: "set null" }),
    status: threadStatus("status").default("open").notNull(),
    lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
    lastMessagePreview: text("last_message_preview"),
    ...timestamps,
  },
  (t) => [uniqueIndex("whatsapp_threads_waid_idx").on(t.waId)],
);

export const whatsappMessages = pgTable(
  "whatsapp_messages",
  {
    id: pk(),
    threadId: uuid("thread_id").notNull().references(() => whatsappThreads.id, { onDelete: "cascade" }),
    direction: messageDirection("direction").notNull(),
    waMessageId: text("wa_message_id"), // provider message id (idempotency)
    type: text("type").default("text").notNull(),
    body: text("body"),
    mediaUrl: text("media_url"),
    status: text("status"), // sent, delivered, read, failed
    sentByUserId: uuid("sent_by_user_id").references(() => users.id, { onDelete: "set null" }),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("whatsapp_messages_thread_idx").on(t.threadId),
    uniqueIndex("whatsapp_messages_waid_idx").on(t.waMessageId),
  ],
);

/** Call tracking (provider-agnostic). Caller numbers masked by role in the UI. */
export const calls = pgTable(
  "calls",
  {
    id: pk(),
    provider: text("provider").notNull(),
    externalId: text("external_id"), // provider call id (idempotency)
    trackingNumber: text("tracking_number"),
    callerNumber: text("caller_number"),
    status: callStatus("status").default("initiated").notNull(),
    durationSec: integer("duration_sec").default(0).notNull(),
    landingPage: text("landing_page"),
    campaign: text("campaign"),
    keyword: text("keyword"),
    recordingUrl: text("recording_url"),
    recordingConsent: boolean("recording_consent").default(false).notNull(),
    transcription: text("transcription"),
    qualified: boolean("qualified").default(false).notNull(),
    qualifiedReason: text("qualified_reason"),
    salesRepUserId: uuid("sales_rep_user_id").references(() => users.id, { onDelete: "set null" }),
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
    startedAt: timestamp("started_at", { withTimezone: true }),
    answeredAt: timestamp("answered_at", { withTimezone: true }),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    index("calls_status_idx").on(t.status),
    index("calls_lead_idx").on(t.leadId),
    uniqueIndex("calls_external_idx").on(t.provider, t.externalId),
  ],
);

export const callEvents = pgTable(
  "call_events",
  {
    id: pk(),
    callId: uuid("call_id").notNull().references(() => calls.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("call_events_call_idx").on(t.callId)],
);

/** Staff notifications (multi-channel; WhatsApp primary). */
export const notifications = pgTable(
  "notifications",
  {
    id: pk(),
    type: text("type").notNull(), // new_lead, missed_qualified_call, ...
    channel: notificationChannel("channel").notNull(),
    recipient: text("recipient").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
    status: notificationStatus("status").default("pending").notNull(),
    error: text("error"),
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true }),
  },
  (t) => [index("notifications_status_idx").on(t.status)],
);
