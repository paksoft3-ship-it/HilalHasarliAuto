import { CheckCircle2, XCircle } from "lucide-react";
import { isDbConfigured } from "@/db";
import { requirePermission } from "@/lib/auth/guard";
import { getAdminLocale, translator, sourceLabels } from "@/lib/i18n/admin";
import { getAnalyticsOverview } from "@/db/repo/analytics";
import { tracking } from "@/config/tracking";
import { NotConfigured, PageTitle } from "@/components/admin/bits";

function ConfigRow({ label, value }: { label: string; value: string }) {
  const ok = Boolean(value);
  return (
    <div className="flex items-center justify-between border-b border-line py-2.5 text-sm last:border-0">
      <span className="text-ink-secondary">{label}</span>
      <span className={ok ? "flex items-center gap-1.5 font-medium text-success" : "flex items-center gap-1.5 text-ink-muted"}>
        {ok ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
        {ok ? value : "Yapılandırılmadı"}
      </span>
    </div>
  );
}

export default async function AnalyticsPage() {
  await requirePermission("analytics.view");
  const locale = await getAdminLocale();
  const t = translator(locale);

  return (
    <>
      <PageTitle title={t("nav.analytics")} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[14px] border border-line bg-white p-5">
          <h2 className="mb-3 text-sm font-bold text-ink">Takip Yapılandırması</h2>
          <ConfigRow label="Google Tag Manager (GTM)" value={tracking.gtmId} />
          <ConfigRow label="Google Analytics 4 (GA4)" value={tracking.ga4Id} />
          <ConfigRow label="Google Ads" value={tracking.googleAdsId} />
          <ConfigRow label="PostHog" value={tracking.posthogKey ? "Etkin" : ""} />
          <p className="mt-3 text-xs leading-relaxed text-ink-muted">
            Consent Mode v2 varsayılan olarak reddedilir; ziyaretçi onayına göre güncellenir.
            Atıf (click ID + UTM) tüm form gönderimlerinde birinci taraf olarak saklanır.
          </p>
        </div>

        {!isDbConfigured ? (
          <NotConfigured message={t("common.notConfigured")} />
        ) : (
          <AnalyticsData locale={locale} />
        )}
      </div>
    </>
  );
}

async function AnalyticsData({ locale }: { locale: "tr" | "en" }) {
  const data = await getAnalyticsOverview();
  return (
    <div className="space-y-6">
      <div className="rounded-[14px] border border-line bg-white p-5">
        <h2 className="mb-3 text-sm font-bold text-ink">Olaylar</h2>
        {data.eventCounts.length === 0 ? (
          <p className="text-sm text-ink-muted">Henüz olay yok.</p>
        ) : (
          <ul className="space-y-1.5 text-sm">
            {data.eventCounts.map((e) => (
              <li key={e.name} className="flex justify-between">
                <span className="text-ink-secondary">{e.name}</span>
                <span className="font-semibold text-ink">{e.count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-[14px] border border-line bg-white p-5">
        <h2 className="mb-3 text-sm font-bold text-ink">Kaynağa Göre Adaylar</h2>
        {data.leadsBySource.length === 0 ? (
          <p className="text-sm text-ink-muted">—</p>
        ) : (
          <ul className="space-y-1.5 text-sm">
            {data.leadsBySource.map((s) => (
              <li key={s.source} className="flex justify-between">
                <span className="text-ink-secondary">{sourceLabels[locale][s.source] ?? s.source}</span>
                <span className="font-semibold text-ink">{s.count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
