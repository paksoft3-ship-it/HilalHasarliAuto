import Link from "next/link";
import { isDbConfigured } from "@/db";
import { requirePermission } from "@/lib/auth/guard";
import { getAdminLocale, translator, dealTypeLabels } from "@/lib/i18n/admin";
import { listDeals } from "@/db/repo/commerce";
import { deleteDeal } from "@/lib/admin/commerce-actions";
import { NotConfigured, PageTitle, Flash } from "@/components/admin/bits";
import { DeleteButton } from "@/components/admin/delete-button";
import { formatTRY, cn } from "@/lib/utils";
import { can } from "@/lib/auth/guard";

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const user = await requirePermission("deals.read");
  const sp = await searchParams;
  const locale = await getAdminLocale();
  const t = translator(locale);

  if (!isDbConfigured) {
    return (<><PageTitle title={t("deals.title")} /><NotConfigured message={t("common.notConfigured")} /></>);
  }

  const rows = await listDeals();
  const canWrite = can(user, "deals.write");

  return (
    <>
      <PageTitle title={t("deals.title")} subtitle={`${rows.length}`} />
      <Flash ok={sp.ok} error={sp.error} />
      <div className="overflow-x-auto rounded-[14px] border border-line bg-white">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-3 font-semibold">{t("leads.lead")}</th>
              <th className="px-4 py-3 font-semibold">{t("leads.dealType")}</th>
              <th className="px-4 py-3 font-semibold">{t("common.status")}</th>
              <th className="px-4 py-3 text-right font-semibold">{t("deals.gross")}</th>
              <th className="px-4 py-3 text-right font-semibold">{t("deals.net")}</th>
              {canWrite && <th className="px-4 py-3"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 ? (
              <tr><td colSpan={canWrite ? 6 : 5} className="px-4 py-10 text-center text-ink-muted">{t("common.noResults")}</td></tr>
            ) : (
              rows.map((d) => (
                <tr key={d.id} className="hover:bg-cream-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/deals/${d.id}`} className="font-semibold text-burgundy-700 hover:underline">
                      {d.leadName ?? "—"}
                    </Link>
                    <div className="text-xs text-ink-muted">{d.leadNumber}</div>
                  </td>
                  <td className="px-4 py-3 text-ink-secondary">{dealTypeLabels[locale][d.type]}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold",
                      d.status === "won" ? "bg-success-surface text-success" : d.status === "lost" ? "bg-error-surface text-error" : "bg-info-surface text-info",
                    )}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-ink-secondary">{formatTRY(d.grossRevenue)}</td>
                  <td className={cn("px-4 py-3 text-right font-semibold", d.netProfit >= 0 ? "text-success" : "text-error")}>
                    {formatTRY(d.netProfit)}
                  </td>
                  {canWrite && (
                    <td className="px-4 py-3 text-right">
                      <DeleteButton action={deleteDeal} id={d.id} confirmText="Bu anlaşmayı silmek istediğinize emin misiniz?" />
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
