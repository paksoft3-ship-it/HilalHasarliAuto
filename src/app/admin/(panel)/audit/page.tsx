import Link from "next/link";
import { isDbConfigured } from "@/db";
import { requirePermission } from "@/lib/auth/guard";
import { getAdminLocale, translator } from "@/lib/i18n/admin";
import { listAuditLogs } from "@/db/repo/admin-extra";
import { NotConfigured, PageTitle } from "@/components/admin/bits";
import { formatTrDate } from "@/lib/utils";

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; page?: string }>;
}) {
  await requirePermission("audit.read");
  const sp = await searchParams;
  const locale = await getAdminLocale();
  const t = translator(locale);

  if (!isDbConfigured) {
    return (<><PageTitle title={t("nav.audit")} /><NotConfigured message={t("common.notConfigured")} /></>);
  }

  const data = await listAuditLogs({ action: sp.action, page: sp.page ? parseInt(sp.page, 10) : 1 });

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (sp.action) params.set("action", sp.action);
    params.set("page", String(p));
    return `/admin/audit?${params.toString()}`;
  };

  return (
    <>
      <PageTitle title={t("nav.audit")} subtitle={`${data.total}`} />

      <form method="get" className="mb-4 flex items-end gap-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-muted">{t("audit.action")}</label>
          <input name="action" defaultValue={sp.action ?? ""} placeholder="örn. lead.stage_change" className="h-10 w-64 rounded-md border border-line px-3 text-sm" />
        </div>
        <button type="submit" className="h-10 rounded-md bg-burgundy-700 px-5 text-sm font-semibold text-white hover:bg-burgundy-800">{t("common.search")}</button>
      </form>

      <div className="overflow-x-auto rounded-[14px] border border-line bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-3 font-semibold">{t("audit.action")}</th>
              <th className="px-4 py-3 font-semibold">{t("audit.actor")}</th>
              <th className="px-4 py-3 font-semibold">{t("audit.entity")}</th>
              <th className="px-4 py-3 font-semibold">Özet</th>
              <th className="px-4 py-3 font-semibold">{t("common.created")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {data.rows.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-ink-muted">{t("common.noResults")}</td></tr>
            ) : data.rows.map((r) => (
              <tr key={r.id} className="hover:bg-cream-50">
                <td className="px-4 py-3 font-mono text-xs text-ink">{r.action}</td>
                <td className="px-4 py-3 text-ink-secondary">{r.actorName ?? "—"}</td>
                <td className="px-4 py-3 text-ink-secondary">
                  {r.entityType ? (r.entityType === "lead" && r.entityId ? <Link href={`/admin/leads/${r.entityId}`} className="text-burgundy-700 hover:underline">{r.entityType}</Link> : r.entityType) : "—"}
                </td>
                <td className="px-4 py-3 text-ink-muted">{r.summary ?? "—"}</td>
                <td className="px-4 py-3 text-ink-muted">{formatTrDate(r.createdAt.toISOString())}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.pageCount > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-ink-muted">{data.page} / {data.pageCount}</span>
          <div className="flex gap-2">
            {data.page > 1 && <Link href={pageHref(data.page - 1)} className="rounded-md border border-line px-3 py-1.5 hover:bg-cream-100">←</Link>}
            {data.page < data.pageCount && <Link href={pageHref(data.page + 1)} className="rounded-md border border-line px-3 py-1.5 hover:bg-cream-100">→</Link>}
          </div>
        </div>
      )}
    </>
  );
}
