"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { requireDb } from "@/db";
import { flaggedIps, auditLogs } from "@/db/schema";
import { requirePermission } from "@/lib/auth/guard";
import { setAvgCpc } from "@/db/repo/click-protection";
import { runAggregateJob } from "@/lib/click-protection/aggregate";
import type { FlaggedStatus } from "@/lib/click-protection/types";

const STATUSES = new Set<FlaggedStatus>(["watching", "flagged", "excluded", "whitelisted"]);
const BASE = "/admin/click-protection/flagged";

function done(msg: string, error = false) {
  revalidatePath(BASE);
  revalidatePath("/admin/click-protection");
  redirect(`${BASE}?${error ? "error" : "ok"}=${encodeURIComponent(msg)}`);
}

/** Manual status change — the only path to "excluded" (v1 never auto-excludes). */
export async function setIpStatus(formData: FormData): Promise<void> {
  const user = await requirePermission("adspend.write");
  const ip = String(formData.get("ip") ?? "").trim();
  const status = String(formData.get("status") ?? "") as FlaggedStatus;
  if (!ip || !STATUSES.has(status)) return;

  await requireDb()
    .update(flaggedIps)
    .set({ status, manuallyReviewed: true, updatedAt: new Date() })
    .where(eq(flaggedIps.ipAddress, ip));
  await requireDb().insert(auditLogs).values({
    actorUserId: user.id,
    action: "click_protection.ip_status",
    entityType: "flagged_ip",
    entityId: ip,
    summary: `IP ${ip} → ${status}`,
  });
  done(`IP durumu güncellendi: ${status}`);
}

/** Whitelist — protect a real-lead IP from ever being flagged. */
export async function whitelistIp(formData: FormData): Promise<void> {
  const user = await requirePermission("adspend.write");
  const ip = String(formData.get("ip") ?? "").trim();
  if (!ip) return;
  await requireDb()
    .update(flaggedIps)
    .set({ status: "whitelisted", manuallyReviewed: true, updatedAt: new Date() })
    .where(eq(flaggedIps.ipAddress, ip));
  await requireDb().insert(auditLogs).values({
    actorUserId: user.id,
    action: "click_protection.whitelist",
    entityType: "flagged_ip",
    entityId: ip,
    summary: `IP ${ip} beyaz listeye alındı`,
  });
  done("IP beyaz listeye alındı.");
}

export async function addIpNote(formData: FormData): Promise<void> {
  const user = await requirePermission("adspend.write");
  const ip = String(formData.get("ip") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  if (!ip) return;
  await requireDb()
    .update(flaggedIps)
    .set({ notes: note || null, manuallyReviewed: true, updatedAt: new Date() })
    .where(eq(flaggedIps.ipAddress, ip));
  await requireDb().insert(auditLogs).values({
    actorUserId: user.id,
    action: "click_protection.note",
    entityType: "flagged_ip",
    entityId: ip,
  });
  done("Not kaydedildi.");
}

/** Average CPC used for "wasted spend" estimation on the dashboard. */
export async function saveAvgCpc(formData: FormData): Promise<void> {
  const user = await requirePermission("adspend.write");
  const value = Number(formData.get("avgCpc"));
  if (!Number.isFinite(value) || value < 0) return;
  await setAvgCpc(value, user.id);
  revalidatePath("/admin/click-protection");
  redirect(`/admin/click-protection?ok=${encodeURIComponent("Ortalama TBM güncellendi.")}`);
}

/** Manual "run now" for the aggregate job (otherwise hourly via cron). */
export async function runJobNow(): Promise<void> {
  await requirePermission("adspend.write");
  await runAggregateJob();
  revalidatePath("/admin/click-protection");
  revalidatePath(BASE);
  redirect(`/admin/click-protection?ok=${encodeURIComponent("Analiz çalıştırıldı.")}`);
}
