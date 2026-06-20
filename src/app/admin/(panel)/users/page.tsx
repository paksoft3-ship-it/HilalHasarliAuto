import { isDbConfigured } from "@/db";
import { requirePermission } from "@/lib/auth/guard";
import { getAdminLocale, translator } from "@/lib/i18n/admin";
import { getUsersWithRoles, listRoles } from "@/db/repo/admin-extra";
import { createUser, toggleUser, setUserRole } from "@/lib/admin/user-actions";
import { NotConfigured, PageTitle } from "@/components/admin/bits";
import { formatTrDate } from "@/lib/utils";

const field = "h-10 rounded-md border border-line px-3 text-sm focus:border-burgundy-700 focus:outline-none";

export default async function UsersPage() {
  await requirePermission("users.manage");
  const locale = await getAdminLocale();
  const t = translator(locale);

  if (!isDbConfigured) {
    return (<><PageTitle title={t("nav.users")} /><NotConfigured message={t("common.notConfigured")} /></>);
  }

  const [users, roles] = await Promise.all([getUsersWithRoles(), listRoles()]);

  return (
    <>
      <PageTitle title={t("nav.users")} subtitle={`${users.length}`} />

      {/* New user */}
      <form action={createUser} className="mb-6 flex flex-wrap items-end gap-2 rounded-[14px] border border-line bg-white p-4">
        <input name="name" required placeholder="Ad Soyad" className={`${field} w-40`} />
        <input name="email" type="email" required placeholder="E-posta" className={`${field} w-52`} />
        <input name="password" type="password" required placeholder={t("users.password")} className={`${field} w-44`} />
        <select name="roleId" className={`${field} w-44`} defaultValue="">
          <option value="" disabled>{t("users.role")}</option>
          {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <button type="submit" className="h-10 rounded-md bg-burgundy-700 px-5 text-sm font-semibold text-white hover:bg-burgundy-800">
          {t("users.new")}
        </button>
      </form>

      <div className="overflow-x-auto rounded-[14px] border border-line bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-3 font-semibold">Kullanıcı</th>
              <th className="px-4 py-3 font-semibold">{t("users.role")}</th>
              <th className="px-4 py-3 font-semibold">{t("common.status")}</th>
              <th className="px-4 py-3 font-semibold">Son Giriş</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-cream-50">
                <td className="px-4 py-3">
                  <span className="font-semibold text-ink">{u.name}</span>
                  <div className="text-xs text-ink-muted">{u.email}</div>
                </td>
                <td className="px-4 py-3">
                  <form action={setUserRole} className="flex items-center gap-2">
                    <input type="hidden" name="userId" value={u.id} />
                    <select
                      name="roleId"
                      defaultValue={roles.find((r) => u.roles.includes(r.name))?.id ?? ""}
                      className="h-9 rounded-md border border-line px-2 text-sm"
                    >
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                    <button type="submit" className="text-xs font-semibold text-burgundy-700 hover:underline">{t("common.save")}</button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <span className={u.isActive ? "rounded-full bg-success-surface px-2.5 py-1 text-xs font-semibold text-success" : "rounded-full bg-cream-200 px-2.5 py-1 text-xs font-semibold text-ink-muted"}>
                    {u.isActive ? t("users.active") : t("users.inactive")}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-muted">{u.lastLoginAt ? formatTrDate(u.lastLoginAt.toISOString()) : "—"}</td>
                <td className="px-4 py-3 text-right">
                  <form action={toggleUser}>
                    <input type="hidden" name="id" value={u.id} />
                    <input type="hidden" name="active" value={String(u.isActive)} />
                    <button type="submit" className="text-xs font-medium text-ink-muted hover:text-burgundy-700">
                      {u.isActive ? t("users.inactive") : t("users.active")}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
