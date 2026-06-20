"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { isDbConfigured, requireDb } from "@/db";
import { users, auditLogs } from "@/db/schema";
import { verifyPassword } from "./password";
import { createSession, destroySession } from "./session";

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

const loginSchema = z.object({
  email: z.string().trim().email("Geçerli bir e-posta girin."),
  password: z.string().min(1, "Şifre gereklidir."),
});

export interface LoginResult {
  error?: string;
}

export async function login(
  _prev: LoginResult | null,
  formData: FormData,
): Promise<LoginResult> {
  if (!isDbConfigured) {
    return { error: "Veritabanı yapılandırılmamış. Lütfen yöneticinizle iletişime geçin." };
  }

  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz giriş." };
  }

  const db = requireDb();
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = hdrs.get("user-agent");

  const { email, password } = parsed.data;
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  // Uniform failure message (no user enumeration).
  const invalid: LoginResult = { error: "E-posta veya şifre hatalı." };

  if (!user || !user.passwordHash || !user.isActive || user.deletedAt) {
    return invalid;
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return { error: "Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin." };
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    const attempts = user.failedLoginCount + 1;
    const lock = attempts >= MAX_ATTEMPTS ? new Date(Date.now() + LOCK_MINUTES * 60_000) : null;
    await db
      .update(users)
      .set({ failedLoginCount: attempts, lockedUntil: lock })
      .where(eq(users.id, user.id));
    await db.insert(auditLogs).values({
      actorUserId: user.id,
      action: "login.failed",
      entityType: "user",
      entityId: user.id,
      ip,
      userAgent,
    });
    return invalid;
  }

  // Success: reset counters, stamp login, rotate session.
  await db
    .update(users)
    .set({ failedLoginCount: 0, lockedUntil: null, lastLoginAt: new Date() })
    .where(eq(users.id, user.id));
  await createSession(user.id, { ip, userAgent });
  await db.insert(auditLogs).values({
    actorUserId: user.id,
    action: "login",
    entityType: "user",
    entityId: user.id,
    ip,
    userAgent,
  });

  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
