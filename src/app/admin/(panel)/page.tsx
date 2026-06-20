import Link from "next/link";
import { isDbConfigured } from "@/db";
import { requirePermission } from "@/lib/auth/guard";
import { getAdminLocale, translator } from "@/lib/i18n/admin";
import { getDashboardStats } from "@/db/repo/crm-queries";
import { StatCard, StageBadge, NotConfigured, PageTitle } from "@/components/admin/bits";
import { formatTrDate } from "@/lib/utils";

export default async function DashboardPage() {
  await requirePermission("dashboard.view");
  const locale = await getAdminLocale();
  const t = translator(locale);

  if (!isDbConfigured) {
    return (
      <>
        <PageTitle title={t("dashboard.title")} />
        <NotConfigured message={t("common.notConfigured")} />
      </>
    );
  }

  const stats = await getDashboardStats();

  return (
    <>
      <PageTitle title={t("dashboard.title")} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label={t("dashboard.totalLeads")} value={stats.total} accent />
        <StatCard label={t("dashboard.newLeads")} value={stats.newLeads} />
        <StatCard label={t("dashboard.todayLeads")} value={stats.today} />
        <StatCard label={t("dashboard.openTasks")} value={stats.openTasks} />
      </div>

      <div className="mt-8 rounded-[14px] border border-line bg-white">
        <div className="border-b border-line px-5 py-4">
          <h2 className="text-base font-bold text-ink">{t("dashboard.recentLeads")}</h2>
        </div>
        {stats.recent.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-ink-muted">{t("common.noResults")}</p>
        ) : (
          <ul className="divide-y divide-line">
            {stats.recent.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/admin/leads/${l.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-cream-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{l.fullName}</p>
                    <p className="text-xs text-ink-muted">
                      {l.leadNumber} · {l.city ?? "—"} · {formatTrDate(l.createdAt.toISOString())}
                    </p>
                  </div>
                  <StageBadge stage={l.stage} locale={locale} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
