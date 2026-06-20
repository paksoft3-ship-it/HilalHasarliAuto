import { and, desc, eq, isNull } from "drizzle-orm";
import { requireDb } from "@/db";
import { contentItems, contentApprovals, contentVersions, users } from "@/db/schema";

export type ContentType = "blog_post" | "guide" | "page" | "service" | "faq";

export async function listContent(filters: { type?: string; status?: string }) {
  const db = requireDb();
  const conds = [isNull(contentItems.deletedAt)];
  if (filters.type) conds.push(eq(contentItems.type, filters.type as ContentType));
  if (filters.status) conds.push(eq(contentItems.status, filters.status as never));
  return db
    .select({
      id: contentItems.id,
      type: contentItems.type,
      title: contentItems.title,
      slug: contentItems.slug,
      status: contentItems.status,
      updatedAt: contentItems.updatedAt,
      authorName: users.name,
    })
    .from(contentItems)
    .leftJoin(users, eq(contentItems.authorId, users.id))
    .where(and(...conds))
    .orderBy(desc(contentItems.updatedAt))
    .limit(200);
}

export async function getContent(id: string) {
  const db = requireDb();
  const [item] = await db.select().from(contentItems).where(eq(contentItems.id, id)).limit(1);
  if (!item) return null;
  const approvals = await db
    .select({
      id: contentApprovals.id,
      action: contentApprovals.action,
      comment: contentApprovals.comment,
      createdAt: contentApprovals.createdAt,
      byName: users.name,
    })
    .from(contentApprovals)
    .leftJoin(users, eq(contentApprovals.byUserId, users.id))
    .where(eq(contentApprovals.contentItemId, id))
    .orderBy(desc(contentApprovals.createdAt));
  return { item, approvals };
}

export async function getVersionCount(id: string): Promise<number> {
  const db = requireDb();
  const rows = await db.select({ v: contentVersions.id }).from(contentVersions).where(eq(contentVersions.contentItemId, id));
  return rows.length;
}

// ---- Public reads (published only) ----
export async function listPublishedByType(type: ContentType, locale = "tr") {
  const db = requireDb();
  return db
    .select()
    .from(contentItems)
    .where(and(eq(contentItems.type, type), eq(contentItems.status, "published"), eq(contentItems.locale, locale), isNull(contentItems.deletedAt)))
    .orderBy(desc(contentItems.publishedAt));
}

export async function getPublishedByTypeSlug(type: ContentType, slug: string, locale = "tr") {
  const db = requireDb();
  const [item] = await db
    .select()
    .from(contentItems)
    .where(and(eq(contentItems.type, type), eq(contentItems.slug, slug), eq(contentItems.status, "published"), eq(contentItems.locale, locale), isNull(contentItems.deletedAt)))
    .limit(1);
  return item ?? null;
}
