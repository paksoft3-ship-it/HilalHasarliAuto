import Link from "next/link";
import { isDbConfigured } from "@/db";
import { requirePermission } from "@/lib/auth/guard";
import { getAdminLocale, translator } from "@/lib/i18n/admin";
import { getOffersOverview } from "@/db/repo/admin-extra";
import { NotConfigured, PageTitle } from "@/components/admin/bits";
import { formatTRY, formatTrDate, cn } from "@/lib/utils";

export default async function OffersPage() {
  await requirePermission("offers.read");
  const locale = await getAdminLocale();
  const t = translator(locale);

  if (!isDbConfigured) {
    return (<><PageTitle title={t("nav.offers")} /><NotConfigured message={t("common.notConfigured")} /></>);
  }

  const { buyerOffers, customerOffers } = await getOffersOverview();

  return (
    <>
      <PageTitle title={t("nav.offers")} />

      <h2 className="mb-3 text-sm font-bold text-ink">{t("offers.buyer")}</h2>
      <div className="mb-8 overflow-x-auto rounded-[14px] border border-line bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-3 font-semibold">{t("leads.lead")}</th>
              <th className="px-4 py-3 font-semibold">Alıcı</th>
              <th className="px-4 py-3 text-right font-semibold">Tutar</th>
              <th className="px-4 py-3 font-semibold">Seçili</th>
              <th className="px-4 py-3 font-semibold">{t("common.created")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {buyerOffers.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-ink-muted">{t("common.noResults")}</td></tr>
            ) : buyerOffers.map((o) => (
              <tr key={o.id} className="hover:bg-cream-50">
                <td className="px-4 py-3">
                  {o.leadId ? <Link href={`/admin/leads/${o.leadId}`} className="font-semibold text-burgundy-700 hover:underline">{o.leadName ?? "—"}</Link> : (o.leadName ?? "—")}
                </td>
                <td className="px-4 py-3 text-ink-secondary">{o.buyerName ?? "—"}</td>
                <td className="px-4 py-3 text-right font-medium text-ink">{formatTRY(o.amount)}</td>
                <td className="px-4 py-3">
                  {o.selected && <span className="rounded-full bg-success-surface px-2 py-0.5 text-xs font-semibold text-success">Seçili</span>}
                </td>
                <td className="px-4 py-3 text-ink-muted">{formatTrDate(o.createdAt.toISOString())}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-3 text-sm font-bold text-ink">{t("offers.customer")}</h2>
      <div className="overflow-x-auto rounded-[14px] border border-line bg-white">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-3 font-semibold">{t("leads.lead")}</th>
              <th className="px-4 py-3 text-right font-semibold">Tutar</th>
              <th className="px-4 py-3 font-semibold">{t("common.status")}</th>
              <th className="px-4 py-3 font-semibold">{t("common.created")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {customerOffers.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-ink-muted">{t("common.noResults")}</td></tr>
            ) : customerOffers.map((o) => (
              <tr key={o.id} className={cn("hover:bg-cream-50")}>
                <td className="px-4 py-3">
                  {o.leadId ? <Link href={`/admin/leads/${o.leadId}`} className="font-semibold text-burgundy-700 hover:underline">{o.leadName ?? "—"}</Link> : (o.leadName ?? "—")}
                </td>
                <td className="px-4 py-3 text-right font-medium text-ink">{formatTRY(o.amount)}</td>
                <td className="px-4 py-3 text-ink-secondary">{o.status}</td>
                <td className="px-4 py-3 text-ink-muted">{formatTrDate(o.createdAt.toISOString())}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
