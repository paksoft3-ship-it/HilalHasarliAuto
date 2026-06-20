"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "drizzle-orm";
import { requireDb } from "@/db";
import { siteSettings, auditLogs } from "@/db/schema";
import { requirePermission } from "@/lib/auth/guard";
import { SETTING_KEYS } from "./settings-keys";

export async function saveSiteSettings(formData: FormData): Promise<void> {
  const actor = await requirePermission("settings.manage");
  const db = requireDb();
  for (const key of SETTING_KEYS) {
    const raw = formData.get(key);
    if (raw === null) continue;
    const value = String(raw).trim();
    await db
      .insert(siteSettings)
      .values({ key, value, updatedBy: actor.id })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value, updatedBy: actor.id, updatedAt: sql`now()` },
      });
  }
  await db.insert(auditLogs).values({ actorUserId: actor.id, action: "settings.update", entityType: "site_settings" });
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout"); // refresh public header/footer/contact across the site
  redirect(`/admin/settings?ok=${encodeURIComponent("Ayarlar kaydedildi.")}`);
}
