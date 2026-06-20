"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { requireDb } from "@/db";
import { mediaAssets, auditLogs } from "@/db/schema";
import { requirePermission } from "@/lib/auth/guard";

function str(fd: FormData, k: string) { return String(fd.get(k) ?? "").trim(); }

export async function deleteMedia(formData: FormData): Promise<void> {
  const user = await requirePermission("media.write");
  const id = str(formData, "id");
  if (!id) return;
  await requireDb().update(mediaAssets).set({ deletedAt: new Date() }).where(eq(mediaAssets.id, id));
  await requireDb().insert(auditLogs).values({ actorUserId: user.id, action: "media.delete", entityType: "media", entityId: id });
  revalidatePath("/admin/media");
  redirect(`/admin/media?ok=${encodeURIComponent("Medya silindi.")}`);
}

/**
 * Register a media asset by URL (works without storage credentials). Direct
 * Vercel Blob uploads are wired via /api/admin/media/upload once
 * BLOB_READ_WRITE_TOKEN is set — see docs.
 */
export async function registerMedia(formData: FormData): Promise<void> {
  const user = await requirePermission("media.write");
  const url = str(formData, "url");
  if (!url) return;
  await requireDb().insert(mediaAssets).values({
    url,
    filename: str(formData, "filename") || url.split("/").pop() || null,
    alt: str(formData, "alt") || null,
    caption: str(formData, "caption") || null,
    folder: str(formData, "folder") || null,
    createdByUserId: user.id,
  });
  await requireDb().insert(auditLogs).values({
    actorUserId: user.id, action: "media.register", entityType: "media",
  });
  revalidatePath("/admin/media");
}
