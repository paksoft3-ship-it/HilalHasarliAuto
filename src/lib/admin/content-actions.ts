"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { requireDb } from "@/db";
import { contentItems, contentVersions, contentApprovals, auditLogs } from "@/db/schema";
import { requirePermission } from "@/lib/auth/guard";
import { textToBlocks } from "@/lib/cms/blocks";

const TYPES = ["blog_post", "guide", "page", "service", "faq"] as const;

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ı/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g")
    .replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function str(fd: FormData, k: string) { return String(fd.get(k) ?? "").trim(); }

function revalidatePublic(type: string, slug: string) {
  if (type === "blog_post") { revalidatePath("/blog"); revalidatePath(`/blog/${slug}`); }
  if (type === "guide") { revalidatePath("/rehberler"); revalidatePath(`/rehberler/${slug}`); }
}

export async function saveContent(formData: FormData): Promise<void> {
  const user = await requirePermission("content.write");
  const id = str(formData, "id");
  const type = str(formData, "type");
  const title = str(formData, "title");
  if (!TYPES.includes(type as never) || !title) return;
  const slug = str(formData, "slug") ? slugify(str(formData, "slug")) : slugify(title);

  const values = {
    type: type as (typeof TYPES)[number],
    slug,
    internalTitle: str(formData, "internalTitle") || null,
    title,
    excerpt: str(formData, "excerpt") || null,
    category: str(formData, "category") || null,
    body: textToBlocks(str(formData, "bodyText")),
    imageUrl: str(formData, "imageUrl") || null,
    imageAlt: str(formData, "imageAlt") || null,
    seoTitle: str(formData, "seoTitle") || null,
    seoDescription: str(formData, "seoDescription") || null,
  };

  const db = requireDb();
  if (id) {
    const [current] = await db.select().from(contentItems).where(eq(contentItems.id, id)).limit(1);
    if (!current) return;
    const version = current.version + 1;
    await db.update(contentItems).set({ ...values, version, updatedAt: new Date() }).where(eq(contentItems.id, id));
    await db.insert(contentVersions).values({
      contentItemId: id, version, snapshot: { ...values }, createdByUserId: user.id,
    });
    await db.insert(auditLogs).values({ actorUserId: user.id, action: "content.update", entityType: "content", entityId: id });
    revalidatePath(`/admin/content/${id}`);
    revalidatePublic(type, slug);
    return;
  }

  const [row] = await db
    .insert(contentItems)
    .values({ ...values, status: "draft", authorId: user.id, version: 1 })
    .returning({ id: contentItems.id });
  await db.insert(contentVersions).values({
    contentItemId: row.id, version: 1, snapshot: { ...values }, createdByUserId: user.id,
  });
  await db.insert(auditLogs).values({ actorUserId: user.id, action: "content.create", entityType: "content", entityId: row.id });
  redirect(`/admin/content/${row.id}`);
}

const PUBLISH_ACTIONS = new Set(["request_changes", "approve", "publish", "unpublish"]);

export async function transitionContent(formData: FormData): Promise<void> {
  const action = str(formData, "action");
  const perm = PUBLISH_ACTIONS.has(action) ? "content.publish" : "content.write";
  const user = await requirePermission(perm);
  const id = str(formData, "id");
  if (!id) return;

  const db = requireDb();
  const [item] = await db.select().from(contentItems).where(eq(contentItems.id, id)).limit(1);
  if (!item) return;

  const patch: Record<string, unknown> = { updatedAt: new Date() };
  switch (action) {
    case "submit": patch.status = "in_review"; break;
    case "request_changes": patch.status = "changes_requested"; break;
    case "approve": patch.status = "approved"; patch.reviewerId = user.id; break;
    case "publish": patch.status = "published"; patch.publishedAt = item.publishedAt ?? new Date(); break;
    case "unpublish": patch.status = "draft"; break;
    case "archive": patch.status = "archived"; break;
    default: return;
  }
  await db.update(contentItems).set(patch).where(eq(contentItems.id, id));
  await db.insert(contentApprovals).values({
    contentItemId: id, action, comment: str(formData, "comment") || null, byUserId: user.id,
  });
  await db.insert(auditLogs).values({
    actorUserId: user.id, action: `content.${action}`, entityType: "content", entityId: id,
  });
  revalidatePath(`/admin/content/${id}`);
  revalidatePath("/admin/content");
  if (action === "publish" || action === "unpublish") revalidatePublic(item.type, item.slug);
}

export async function addContentComment(formData: FormData): Promise<void> {
  const user = await requirePermission("content.write");
  const id = str(formData, "id");
  const comment = str(formData, "comment");
  if (!id || !comment) return;
  await requireDb().insert(contentApprovals).values({
    contentItemId: id, action: "comment", comment, byUserId: user.id,
  });
  revalidatePath(`/admin/content/${id}`);
}

export async function deleteContent(formData: FormData): Promise<void> {
  const user = await requirePermission("content.write");
  const id = str(formData, "id");
  if (!id) return;
  await requireDb().update(contentItems).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(contentItems.id, id));
  await requireDb().insert(auditLogs).values({ actorUserId: user.id, action: "content.delete", entityType: "content_item", entityId: id });
  revalidatePath("/admin/content");
  redirect(`/admin/content?ok=${encodeURIComponent("İçerik silindi.")}`);
}
