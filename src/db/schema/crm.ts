import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  uuid,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";
import { pk, timestamps } from "./shared";
import { users } from "./identity";
import {
  leadStage,
  dealType,
  leadPriority,
  leadSource,
  leadStatus,
  contactMethod,
  triState,
  taskStatus,
  formType,
  touchType,
} from "./enums";

export const leads = pgTable(
  "leads",
  {
    id: pk(),
    leadNumber: text("lead_number").notNull().unique(), // human ref, e.g. ON-260620-AB12
    stage: leadStage("stage").default("new_lead").notNull(),
    dealType: dealType("deal_type").default("undecided").notNull(),
    priority: leadPriority("priority").default("normal").notNull(),
    source: leadSource("source").default("website_form").notNull(),
    status: leadStatus("status").default("active").notNull(),

    // Primary contact (the vehicle owner).
    fullName: text("full_name").notNull(),
    phone: text("phone").notNull(),
    phoneNormalized: text("phone_normalized").notNull(),
    email: text("email"),
    preferredContact: contactMethod("preferred_contact"),
    city: text("city"),
    district: text("district"),

    assignedUserId: uuid("assigned_user_id").references(() => users.id, { onDelete: "set null" }),

    score: integer("score").default(0).notNull(),
    lossReason: text("loss_reason"),
    lossNote: text("loss_note"),

    firstTouchAt: timestamp("first_touch_at", { withTimezone: true }),
    lastContactAt: timestamp("last_contact_at", { withTimezone: true }),
    nextActionAt: timestamp("next_action_at", { withTimezone: true }),

    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    index("leads_stage_idx").on(t.stage),
    index("leads_assigned_idx").on(t.assignedUserId),
    index("leads_source_idx").on(t.source),
    index("leads_city_idx").on(t.city),
    index("leads_phone_idx").on(t.phoneNormalized),
    index("leads_created_idx").on(t.createdAt),
  ],
);

export const vehicles = pgTable(
  "vehicles",
  {
    id: pk(),
    leadId: uuid("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
    brand: text("brand"),
    model: text("model"),
    year: integer("year"),
    mileage: integer("mileage"),
    fuel: text("fuel"),
    transmission: text("transmission"),
    category: text("category"), // service title / damage category label
    damageDescription: text("damage_description"),
    running: triState("running"),
    starts: triState("starts"),
    registrationStatus: text("registration_status"),
    hasTowDoc: triState("has_tow_doc"),
    plate: text("plate"),
    vin: text("vin"), // restricted; access-controlled
    photoCount: integer("photo_count").default(0).notNull(),
    documentCount: integer("document_count").default(0).notNull(),
    ...timestamps,
  },
  (t) => [index("vehicles_lead_idx").on(t.leadId)],
);

export const formSubmissions = pgTable(
  "form_submissions",
  {
    id: pk(),
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
    type: formType("type").notNull(),
    referenceNumber: text("reference_number").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(), // sanitized
    source: text("source"),
    ip: text("ip"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("form_submissions_lead_idx").on(t.leadId)],
);

export const attributionTouches = pgTable(
  "attribution_touches",
  {
    id: pk(),
    leadId: uuid("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
    touchType: touchType("touch_type").notNull(),
    gclid: text("gclid"),
    gbraid: text("gbraid"),
    wbraid: text("wbraid"),
    fbclid: text("fbclid"),
    ttclid: text("ttclid"),
    msclkid: text("msclkid"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmTerm: text("utm_term"),
    utmContent: text("utm_content"),
    landingPage: text("landing_page"),
    referrer: text("referrer"),
    sessionId: text("session_id"),
    deviceCategory: text("device_category"),
    country: text("country"),
    city: text("city"),
    consentSnapshot: jsonb("consent_snapshot").$type<Record<string, unknown>>(),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("attribution_lead_idx").on(t.leadId)],
);

export const consentRecords = pgTable("consent_records", {
  id: pk(),
  leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
  necessary: boolean("necessary").default(true).notNull(),
  functional: boolean("functional").default(false).notNull(),
  analytics: boolean("analytics").default(false).notNull(),
  marketing: boolean("marketing").default(false).notNull(),
  version: integer("version").notNull(),
  source: text("source"),
  snapshot: jsonb("snapshot").$type<Record<string, unknown>>(),
  ip: text("ip"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const leadStageHistory = pgTable(
  "lead_stage_history",
  {
    id: pk(),
    leadId: uuid("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
    fromStage: leadStage("from_stage"),
    toStage: leadStage("to_stage").notNull(),
    changedByUserId: uuid("changed_by_user_id").references(() => users.id, { onDelete: "set null" }),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("stage_history_lead_idx").on(t.leadId)],
);

export const leadAssignments = pgTable(
  "lead_assignments",
  {
    id: pk(),
    leadId: uuid("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    assignedByUserId: uuid("assigned_by_user_id").references(() => users.id, { onDelete: "set null" }),
    strategy: text("strategy"),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("assignments_lead_idx").on(t.leadId)],
);

export const leadNotes = pgTable(
  "lead_notes",
  {
    id: pk(),
    leadId: uuid("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    body: text("body").notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("notes_lead_idx").on(t.leadId)],
);

export const tasks = pgTable(
  "tasks",
  {
    id: pk(),
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "cascade" }),
    assignedUserId: uuid("assigned_user_id").references(() => users.id, { onDelete: "set null" }),
    createdByUserId: uuid("created_by_user_id").references(() => users.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    description: text("description"),
    status: taskStatus("status").default("open").notNull(),
    dueAt: timestamp("due_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    index("tasks_assigned_idx").on(t.assignedUserId),
    index("tasks_lead_idx").on(t.leadId),
    index("tasks_due_idx").on(t.dueAt),
  ],
);

export const tags = pgTable("tags", {
  id: pk(),
  name: text("name").notNull().unique(),
  color: text("color"),
});

export const leadTags = pgTable(
  "lead_tags",
  {
    leadId: uuid("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.leadId, t.tagId] })],
);
