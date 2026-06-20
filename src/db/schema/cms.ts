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
import { pk, timestamps } from "./shared";
import { users } from "./identity";
import { contentType, contentStatus, mediaVisibility } from "./enums";
import type { Block } from "@/config/blog";

/** Structured CMS content with editorial workflow (master prompt §8). */
export const contentItems = pgTable(
  "content_items",
  {
    id: pk(),
    type: contentType("type").notNull(),
    slug: text("slug").notNull(),
    locale: text("locale").default("tr").notNull(),
    internalTitle: text("internal_title"),
    title: text("title").notNull(),
    excerpt: text("excerpt"),
    category: text("category"),
    body: jsonb("body").$type<Block[]>().default([]).notNull(),
    imageUrl: text("image_url"),
    imageAlt: text("image_alt"),
    // SEO
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    canonical: text("canonical"),
    robots: text("robots"),
    ogImage: text("og_image"),
    // Workflow
    status: contentStatus("status").default("draft").notNull(),
    authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
    reviewerId: uuid("reviewer_id").references(() => users.id, { onDelete: "set null" }),
    version: integer("version").default(1).notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("content_type_slug_locale_idx").on(t.type, t.slug, t.locale),
    index("content_status_idx").on(t.status),
    index("content_type_idx").on(t.type),
  ],
);

export const contentVersions = pgTable(
  "content_versions",
  {
    id: pk(),
    contentItemId: uuid("content_item_id").notNull().references(() => contentItems.id, { onDelete: "cascade" }),
    version: integer("version").notNull(),
    snapshot: jsonb("snapshot").$type<Record<string, unknown>>().notNull(),
    note: text("note"),
    createdByUserId: uuid("created_by_user_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("content_versions_item_idx").on(t.contentItemId)],
);

export const contentApprovals = pgTable(
  "content_approvals",
  {
    id: pk(),
    contentItemId: uuid("content_item_id").notNull().references(() => contentItems.id, { onDelete: "cascade" }),
    action: text("action").notNull(), // submit, approve, request_changes, publish, unpublish, archive
    comment: text("comment"),
    byUserId: uuid("by_user_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("content_approvals_item_idx").on(t.contentItemId)],
);

export const mediaAssets = pgTable(
  "media_assets",
  {
    id: pk(),
    url: text("url").notNull(),
    filename: text("filename"),
    mime: text("mime"),
    size: integer("size"),
    width: integer("width"),
    height: integer("height"),
    alt: text("alt"),
    caption: text("caption"),
    credit: text("credit"),
    folder: text("folder"),
    visibility: mediaVisibility("visibility").default("public").notNull(),
    createdByUserId: uuid("created_by_user_id").references(() => users.id, { onDelete: "set null" }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [index("media_folder_idx").on(t.folder)],
);

export const mediaUsages = pgTable(
  "media_usages",
  {
    id: pk(),
    mediaId: uuid("media_id").notNull().references(() => mediaAssets.id, { onDelete: "cascade" }),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
  },
  (t) => [index("media_usages_media_idx").on(t.mediaId)],
);
