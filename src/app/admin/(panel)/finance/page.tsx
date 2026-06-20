import { isDbConfigured } from "@/db";
import { requirePermission } from "@/lib/auth/guard";
import { getAdminLocale, translator } from "@/lib/i18n/admin";
import { getFinanceSummary } from "@/db/repo/commerce";
import { StatCard, NotConfigured, PageTitle } from "@/components/admin/bits";
import { formatTRY } from "@/lib/utils";

export default async function FinancePage() {
  await requirePermission("finance.read");
  const locale = await getAdminLocale();
  const t = translator(locale);

  if (!isDbConfigured) {
    return (<><PageTitle title={t("finance.title")} /><NotConfigured message={t("common.notConfigured")} /></>);
  }

  const s = await getFinanceSummary();
  const roi = s.adSpendTotal > 0 ? (s.netProfit / s.adSpendTotal) : null;

  return (
    <>
      <PageTitle title={t("finance.title")} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label={t("finance.revenue")} value={formatTRY(s.grossRevenue)} accent />
        <StatCard label={t("finance.profit")} value={formatTRY(s.netProfit)} />
        <StatCard label={t("finance.adspend")} value={formatTRY(s.adSpendTotal)} />
        <StatCard label={t("finance.wonDeals")} value={s.dealsWon} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label={t("finance.openDeals")} value={s.dealsOpen} />
        <StatCard label={t("dashboard.totalLeads")} value={s.leadsTotal} />
        <StatCard label="ROAS (Net/Reklam)" value={roi == null ? "—" : `${roi.toFixed(1)}x`} />
      </div>
      <p className="mt-6 text-xs text-ink-muted">
        Brüt gelir ve net kâr yalnızca kazanılan (won) anlaşmalardan hesaplanır.
        Net kâr = brüt − pay edilen reklam maliyeti − giderler (+ manuel düzeltme).
      </p>
    </>
  );
}
