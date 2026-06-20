import Link from "next/link";
import { Plus } from "lucide-react";
import { isDbConfigured } from "@/db";
import { requirePermission, can } from "@/lib/auth/guard";
import { getAdminLocale, translator } from "@/lib/i18n/admin";
import { listBuyers } from "@/db/repo/commerce";
import { toggleBuyer } from "@/lib/admin/commerce-actions";
import { NotConfigured, PageTitle } from "@/components/admin/bits";

export default async function BuyersPage() {
  const user = await requirePermission("buyers.read");
  const locale = await getAdminLocale();
  const t = translator(locale);

  if (!isDbConfigured) {
    return (<><PageTitle title={t("buyers.title")} /><NotConfigured message={t("common.notConfigured")} /></>);
  }

  const rows = await listBuyers();
  const canWrite = can(user, "buyers.write");

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <PageTitle title={t("buyers.title")} subtitle={`${rows.length}`} />
        {canWrite && (
          <Link href="/admin/buyers/new" className="inline-flex items-center gap-1.5 rounded-md bg-burgundy-700 px-4 py-2 text-sm font-semibold text-white hover:bg-burgundy-800">
            <Plus size={16} /> {t("buyers.new")}
          </Link>
        )}
      </div>

      <div className="overflow-x-auto rounded-[14px] border border-line bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-3 font-semibold">{t("buyers.name")}</th>
              <th className="px-4 py-3 font-semibold">Telefon</th>
              <th className="px-4 py-3 font-semibold">{t("buyers.cities")}</th>
              <th className="px-4 py-3 font-semibold">{t("common.status")}</th>
              <th className="px-4 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-ink-muted">{t("common.noResults")}</td></tr>
            ) : (
              rows.map((b) => (
                <tr key={b.id} className="hover:bg-cream-50">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-ink">{b.name}</span>
                    {b.companyName && <div className="text-xs text-ink-muted">{b.companyName}</div>}
                  </td>
                  <td className="px-4 py-3 text-ink-secondary">{b.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-secondary">{b.cities.join(", ") || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={b.active ? "rounded-full bg-success-surface px-2.5 py-1 text-xs font-semibold text-success" : "rounded-full bg-cream-200 px-2.5 py-1 text-xs font-semibold text-ink-muted"}>
                      {b.active ? t("buyers.active") : t("buyers.inactive")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {canWrite && (
                        <form action={toggleBuyer}>
                          <input type="hidden" name="id" value={b.id} />
                          <input type="hidden" name="active" value={String(b.active)} />
                          <button type="submit" className="text-xs font-medium text-ink-muted hover:text-burgundy-700">
                            {b.active ? t("buyers.inactive") : t("buyers.active")}
                          </button>
                        </form>
                      )}
                      <Link href={`/admin/buyers/${b.id}`} className="text-xs font-semibold text-burgundy-700 hover:underline">
                        {t("common.view")}
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
