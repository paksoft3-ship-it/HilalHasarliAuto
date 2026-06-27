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

/** Only trust Vercel Blob URLs for the direct-upload path. */
const BLOB_URL = /^https:\/\/[\w.-]*\.public\.blob\.vercel-storage\.com\//;

/**
 * Persist a media asset that the browser already uploaded directly to Vercel
 * Blob via /api/admin/media/upload. Re-checks permission + URL origin server-
 * side so a forged call cannot inject arbitrary URLs.
 */
export async function registerUploadedMedia(input: {
  url: string;
  filename?: string;
  mime?: string;
  size?: number;
  folder?: string;
  alt?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const user = await requirePermission("media.write");
  if (!input?.url || !BLOB_URL.test(input.url)) {
    return { ok: false, error: "Geçersiz dosya adresi." };
  }
  await requireDb().insert(mediaAssets).values({
    url: input.url,
    filename: (input.filename || input.url.split("/").pop() || "").slice(0, 255) || null,
    mime: input.mime?.slice(0, 100) || null,
    size: typeof input.size === "number" && input.size > 0 ? input.size : null,
    alt: input.alt?.slice(0, 255) || null,
    folder: input.folder?.slice(0, 100) || null,
    createdByUserId: user.id,
  });
  await requireDb().insert(auditLogs).values({
    actorUserId: user.id, action: "media.upload", entityType: "media",
  });
  revalidatePath("/admin/media");
  return { ok: true };
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
