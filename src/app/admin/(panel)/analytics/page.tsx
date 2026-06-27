import { CheckCircle2, XCircle, Users, MousePointerClick, Target, TrendingUp } from "lucide-react";
import { isDbConfigured } from "@/db";
import { requirePermission } from "@/lib/auth/guard";
import { getAdminLocale, translator, sourceLabels } from "@/lib/i18n/admin";
import { getAnalyticsOverview, getAnalyticsDashboard } from "@/db/repo/analytics";
import { tracking } from "@/config/tracking";
import { NotConfigured, PageTitle } from "@/components/admin/bits";

/** Human-readable labels for first-party event names (Kritik Olaylar). */
const EVENT_LABELS: Record<string, string> = {
  phone_click: "Telefon (Ara) tıklaması",
  whatsapp_click: "WhatsApp tıklaması",
  quote_click: "“Hemen Teklif Al” tıklaması",
  quote_form_submit: "Teklif formu gönderimi",
  contact_form_submit: "İletişim formu gönderimi",
  lead_created: "Yeni aday oluştu",
  whatsapp_conversation_started: "WhatsApp görüşmesi başladı",
  qualified_call: "Nitelikli arama",
};

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

function Kpi({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-[14px] border border-line bg-white p-5">
      <div className="flex items-center gap-2 text-ink-muted">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <div className="mt-2 text-[28px] font-bold leading-none text-ink">{value}</div>
      {hint && <div className="mt-1 text-xs text-ink-muted">{hint}</div>}
    </div>
  );
}

function BarRow({ label, value, max, sub }: { label: string; value: number; max: number; sub?: string }) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <div className="py-1.5">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="truncate text-ink-secondary" title={label}>{label}</span>
        <span className="shrink-0 font-semibold text-ink">{value}{sub && <span className="ml-1 text-xs font-normal text-ink-muted">{sub}</span>}</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-cream-200">
        <div className="h-full rounded-full bg-burgundy-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default async function AnalyticsPage() {
  await requirePermission("analytics.view");
  const locale = await getAdminLocale();
  const t = translator(locale);

  return (
    <>
      <PageTitle title={t("nav.analytics")} subtitle="Son 30 gün · birinci taraf veriler" />

      {!isDbConfigured ? (
        <div className="mt-5"><NotConfigured message={t("common.notConfigured")} /></div>
      ) : (
        <Dashboard locale={locale} />
      )}

      <div className="mt-6 rounded-[14px] border border-line bg-white p-5">
        <h2 className="mb-3 text-sm font-bold text-ink">Takip Yapılandırması</h2>
        <ConfigRow label="Google Tag Manager (GTM)" value={tracking.gtmId} />
        <ConfigRow label="Google Analytics 4 (GA4)" value={tracking.ga4Id} />
        <ConfigRow label="Google Ads" value={tracking.googleAdsId} />
        <ConfigRow label="Microsoft Clarity (ısı haritası)" value={tracking.clarityId ? "Etkin" : ""} />
        <p className="mt-3 text-xs leading-relaxed text-ink-muted">
          Consent Mode v2 varsayılan olarak reddedilir; ziyaretçi onayına göre güncellenir.
          GA4 ve Google Ads dönüşümleri GTM üzerinden yönetilir. Isı haritası ve oturum
          kayıtları için Microsoft Clarity analitik onayından sonra devreye girer.
        </p>
      </div>
    </>
  );
}

async function Dashboard({ locale }: { locale: "tr" | "en" }) {
  const [d, overview] = await Promise.all([getAnalyticsDashboard(30), getAnalyticsOverview()]);
  const maxVisits = Math.max(1, ...d.series.map((s) => s.visits));
  const maxPage = Math.max(1, ...d.topPages.map((p) => p.visits));
  const maxSource = Math.max(1, ...d.sources.map((s) => s.visits));
  const maxEvent = Math.max(1, ...overview.eventCounts.map((e) => e.count));
  const maxLead = Math.max(1, ...overview.leadsBySource.map((s) => s.count));

  return (
    <div className="mt-5 space-y-6">
      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={<MousePointerClick size={15} />} label="Ziyaret" value={d.kpis.visits.toLocaleString("tr-TR")} hint="izlenen oturum" />
        <Kpi icon={<Target size={15} />} label="Dönüşüm" value={d.kpis.conversions.toLocaleString("tr-TR")} hint="telefon / WhatsApp / form" />
        <Kpi icon={<TrendingUp size={15} />} label="Dönüşüm Oranı" value={`%${d.kpis.convRate}`} />
        <Kpi icon={<Users size={15} />} label="Yeni Aday" value={d.kpis.leads.toLocaleString("tr-TR")} hint="CRM kaydı" />
      </div>

      {/* 14-day visits chart */}
      <div className="rounded-[14px] border border-line bg-white p-5">
        <h2 className="mb-4 text-sm font-bold text-ink">Son 14 Gün — Ziyaret &amp; Dönüşüm</h2>
        {d.series.every((s) => s.visits === 0) ? (
          <p className="text-sm text-ink-muted">Henüz ziyaret verisi yok.</p>
        ) : (
          <div className="flex items-end gap-1.5" style={{ height: 140 }}>
            {d.series.map((s) => {
              const h = Math.round((s.visits / maxVisits) * 120);
              const ch = s.visits > 0 ? Math.round((s.conversions / s.visits) * h) : 0;
              return (
                <div key={s.day} className="group relative flex flex-1 flex-col items-center justify-end gap-1">
                  <div className="relative w-full max-w-[26px] overflow-hidden rounded-t bg-cream-200" style={{ height: Math.max(2, h) }}>
                    <div className="absolute bottom-0 w-full bg-burgundy-700" style={{ height: ch }} />
                  </div>
                  <span className="text-[9px] text-ink-muted">{s.day.slice(8)}</span>
                  <span className="pointer-events-none absolute -top-7 hidden whitespace-nowrap rounded bg-charcoal-950 px-1.5 py-0.5 text-[10px] text-white group-hover:block">
                    {s.day.slice(5)}: {s.visits} ziyaret · {s.conversions} dönüşüm
                  </span>
                </div>
              );
            })}
          </div>
        )}
        <p className="mt-3 text-xs text-ink-muted"><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-burgundy-700 align-middle" />Dönüşüm <span className="mx-1 inline-block h-2 w-2 rounded-sm bg-cream-200 align-middle" />Ziyaret</p>
      </div>

      {/* Two-column breakdowns */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[14px] border border-line bg-white p-5">
          <h2 className="mb-3 text-sm font-bold text-ink">En Çok Ziyaret Edilen Sayfalar</h2>
          {d.topPages.length === 0 ? <p className="text-sm text-ink-muted">—</p> : d.topPages.map((p) => (
            <BarRow key={p.page} label={p.page} value={p.visits} max={maxPage} sub={`· ${p.conversions} dönüşüm`} />
          ))}
        </div>
        <div className="rounded-[14px] border border-line bg-white p-5">
          <h2 className="mb-3 text-sm font-bold text-ink">Trafik Kaynakları (UTM)</h2>
          {d.sources.length === 0 ? <p className="text-sm text-ink-muted">—</p> : d.sources.map((s) => (
            <BarRow key={s.source} label={s.source} value={s.visits} max={maxSource} />
          ))}
        </div>

        <div className="rounded-[14px] border border-line bg-white p-5">
          <h2 className="mb-1 text-sm font-bold text-ink">Kritik Olaylar</h2>
          <p className="mb-3 text-xs text-ink-muted">Buton tıklamaları ve dönüşümler — tüm zamanlar.</p>
          {overview.eventCounts.length === 0 ? <p className="text-sm text-ink-muted">Henüz olay yok.</p> : overview.eventCounts.map((e) => (
            <BarRow key={e.name} label={EVENT_LABELS[e.name] ?? e.name} value={e.count} max={maxEvent} />
          ))}
        </div>
        <div className="rounded-[14px] border border-line bg-white p-5">
          <h2 className="mb-3 text-sm font-bold text-ink">Kaynağa Göre Adaylar</h2>
          {overview.leadsBySource.length === 0 ? <p className="text-sm text-ink-muted">—</p> : overview.leadsBySource.map((s) => (
            <BarRow key={s.source} label={sourceLabels[locale][s.source] ?? s.source} value={s.count} max={maxLead} />
          ))}
        </div>
      </div>
    </div>
  );
}
