"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { requireDb } from "@/db";
import { users, userRoles, auditLogs } from "@/db/schema";
import { requirePermission } from "@/lib/auth/guard";
import { hashPassword } from "@/lib/auth/password";

function str(fd: FormData, k: string) { return String(fd.get(k) ?? "").trim(); }

export async function createUser(formData: FormData): Promise<void> {
  const actor = await requirePermission("users.manage");
  const email = str(formData, "email").toLowerCase();
  const name = str(formData, "name");
  const password = str(formData, "password");
  const roleId = str(formData, "roleId");
  const locale = str(formData, "locale") === "en" ? "en" : "tr";
  if (!email || !name || password.length < 8 || !roleId) {
    redirect(`/admin/users?error=${encodeURIComponent("Ad, e-posta, rol ve en az 8 karakterli şifre gerekli.")}`);
  }

  const db = requireDb();
  const passwordHash = await hashPassword(password);
  const [row] = await db
    .insert(users)
    .values({ email, name, passwordHash, locale })
    .onConflictDoNothing({ target: users.email })
    .returning({ id: users.id });

  if (!row) {
    redirect(`/admin/users?error=${encodeURIComponent("Bu e-posta zaten kayıtlı.")}`);
  }
  await db.insert(userRoles).values({ userId: row.id, roleId }).onConflictDoNothing();
  await db.insert(auditLogs).values({ actorUserId: actor.id, action: "user.create", entityType: "user", entityId: row.id });
  revalidatePath("/admin/users");
  redirect(`/admin/users?ok=${encodeURIComponent("Kullanıcı oluşturuldu.")}`);
}

export async function toggleUser(formData: FormData): Promise<void> {
  const actor = await requirePermission("users.manage");
  const id = str(formData, "id");
  const active = str(formData, "active") === "true";
  if (!id || id === actor.id) return; // don't deactivate yourself
  await requireDb().update(users).set({ isActive: !active, updatedAt: new Date() }).where(eq(users.id, id));
  await requireDb().insert(auditLogs).values({ actorUserId: actor.id, action: "user.toggle", entityType: "user", entityId: id });
  revalidatePath("/admin/users");
}

export async function deleteUser(formData: FormData): Promise<void> {
  const actor = await requirePermission("users.manage");
  const id = str(formData, "id");
  if (!id || id === actor.id) {
    redirect(`/admin/users?error=${encodeURIComponent("Kendi hesabınızı silemezsiniz.")}`);
  }
  await requireDb().update(users).set({ deletedAt: new Date(), isActive: false, updatedAt: new Date() }).where(eq(users.id, id));
  await requireDb().insert(auditLogs).values({ actorUserId: actor.id, action: "user.delete", entityType: "user", entityId: id });
  redirect(`/admin/users?ok=${encodeURIComponent("Kullanıcı silindi.")}`);
}

export async function setUserRole(formData: FormData): Promise<void> {
  const actor = await requirePermission("users.manage");
  const userId = str(formData, "userId");
  const roleId = str(formData, "roleId");
  if (!userId || !roleId) return;
  const db = requireDb();
  await db.delete(userRoles).where(eq(userRoles.userId, userId));
  await db.insert(userRoles).values({ userId, roleId });
  await db.insert(auditLogs).values({ actorUserId: actor.id, action: "user.role_change", entityType: "user", entityId: userId });
  revalidatePath("/admin/users");
}
