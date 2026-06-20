/**
 * Development/initial seed: roles, permissions, RBAC mapping, a super-admin
 * user, default site settings and a few tags. Idempotent (safe to re-run).
 *
 * Usage: set DATABASE_URL in .env.local, run `pnpm db:migrate` then `pnpm db:seed`.
 * Admin credentials come from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { hashPassword } from "../lib/auth/password";
import { PERMISSIONS, ROLES, permissionsForRole } from "../lib/auth/rbac";

async function main() {
  const { requireDb, isDbConfigured } = await import("./index");
  if (!isDbConfigured) {
    console.error("✗ DATABASE_URL is not set. Add it to .env.local and retry.");
    process.exit(1);
  }
  const db = requireDb();
  const s = await import("./schema");

  console.log("→ Seeding permissions…");
  await db
    .insert(s.permissions)
    .values(
      (Object.entries(PERMISSIONS) as [string, string][]).map(([code, description]) => ({
        code,
        description,
      })),
    )
    .onConflictDoNothing({ target: s.permissions.code });

  console.log("→ Seeding roles…");
  await db
    .insert(s.roles)
    .values(ROLES.map((r) => ({ code: r.code, name: r.name, description: r.description })))
    .onConflictDoNothing({ target: s.roles.code });

  // Map codes → ids.
  const roleRows = await db.select().from(s.roles);
  const permRows = await db.select().from(s.permissions);
  const roleId = new Map(roleRows.map((r) => [r.code, r.id]));
  const permId = new Map(permRows.map((p) => [p.code, p.id]));

  console.log("→ Mapping role permissions…");
  const rp: { roleId: string; permissionId: string }[] = [];
  for (const role of ROLES) {
    const rid = roleId.get(role.code);
    if (!rid) continue;
    for (const code of permissionsForRole(role)) {
      const pid = permId.get(code);
      if (pid) rp.push({ roleId: rid, permissionId: pid });
    }
  }
  if (rp.length) {
    await db.insert(s.rolePermissions).values(rp).onConflictDoNothing();
  }

  console.log("→ Seeding super-admin user…");
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@otonakit.local";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "OtoNakit!2026";
  const passwordHash = await hashPassword(password);
  await db
    .insert(s.users)
    .values({ email, name: "Süper Yönetici", passwordHash, locale: "tr" })
    .onConflictDoNothing({ target: s.users.email });

  const [admin] = await db.select().from(s.users);
  const superAdminId = roleId.get("super_admin");
  const adminRow = (await db.select().from(s.users)).find((u) => u.email === email) ?? admin;
  if (adminRow && superAdminId) {
    await db
      .insert(s.userRoles)
      .values({ userId: adminRow.id, roleId: superAdminId })
      .onConflictDoNothing();
  }

  console.log("→ Seeding default site settings…");
  await db
    .insert(s.siteSettings)
    .values([
      { key: "brand.name", value: "OTO NAKİT" },
      { key: "brand.tagline", value: "Hasarlı Araç Alım Merkezi" },
      { key: "contact.phoneDisplay", value: "0850 302 16 16" },
      { key: "contact.email", value: "info@example.com" },
      { key: "contact.workingHours", value: "7/24 İletişim" },
    ])
    .onConflictDoNothing({ target: s.siteSettings.key });

  console.log("→ Seeding tags…");
  await db
    .insert(s.tags)
    .values([
      { name: "Acil", color: "#B4232C" },
      { name: "Yüksek Değer", color: "#C89A4B" },
      { name: "Takipte", color: "#335C85" },
    ])
    .onConflictDoNothing({ target: s.tags.name });

  console.log(`✓ Seed complete. Admin: ${email}`);
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log(`  Default password: ${password} — change it after first login.`);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
