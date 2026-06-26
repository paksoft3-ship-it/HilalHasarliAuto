import { requirePermission, can } from "@/lib/auth/guard";
import { isDbConfigured } from "@/db";
import { PageTitle, StatCard, NotConfigured, Flash } from "@/components/admin/bits";
import {
  getDashboardStats,
  getClicksVsFlaggedSeries,
  getClicksByHour,
  getTopFlaggedIps,
  getAvgCpc,
  getLastDetectionRun,
} from "@/db/repo/click-protection";
import { formatTrDateTime } from "@/lib/utils";
import { saveAvgCpc, runJobNow } from "@/lib/admin/click-protection-actions";
import { ClickProtectionTabs } from "./_tabs";

export const dynamic = "force-dynamic";

const tl = (n: number) => `${n.toLocaleString("tr-TR")} ₺`;

export default async function ClickProtectionDashboard({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const user = await requirePermission("adspend.read");
  const sp = await searchParams;
  const manage = can(user, "adspend.write");

  if (!isDbConfigured) {
    return (
      <>
        <PageTitle title="Tıklama Koruması" subtitle="Google Ads tıklama dolandırıcılığı tespiti" />
        <ClickProtectionTabs active="dashboard" />
        <NotConfigured message="Veritabanı bağlı değil. Verileri görmek için DATABASE_URL ayarlayın." />
      </>
    );
  }

  const avgCpc = await getAvgCpc();
  const [stats, series, byHour, top, lastRun] = await Promise.all([
    getDashboardStats(avgCpc),
    getClicksVsFlaggedSeries(14),
    getClicksByHour(7),
    getTopFlaggedIps(10),
    getLastDetectionRun(),
  ]);

  const maxDay = Math.max(1, ...series.map((s) => s.clicks));
  const maxHour = Math.max(1, ...byHour.map((h) => h.clicks));

  return (
    <>
      <PageTitle title="Tıklama Koruması" subtitle="Google Ads tıklama dolandırıcılığı tespiti" />
      <ClickProtectionTabs active="dashboard" />
      <Flash ok={sp.ok} error={sp.error} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Reklam tıklaması (bugün)" value={stats?.adClicks.d1 ?? 0} />
        <StatCard label="Reklam tıklaması (7 gün)" value={stats?.adClicks.d7 ?? 0} />
        <StatCard label="Reklam tıklaması (30 gün)" value={stats?.adClicks.d30 ?? 0} />
        <StatCard label="İşaretli tıklama (30 gün)" value={stats?.flaggedClicks ?? 0} accent />
        <StatCard label="Tahmini boşa harcama (30 gün)" value={tl(stats?.estimatedWastedSpend ?? 0)} accent />
        <StatCard label="Reklam dönüşüm oranı" value={`%${stats?.adConversionRate ?? 0}`} />
        <StatCard label="İşaretlenme oranı" value={`%${stats?.pctFlagged ?? 0}`} />
        <StatCard label="İzlenen/işaretli IP" value={stats?.flaggedIpsCount ?? 0} />
      </div>

      {/* Avg CPC config + manual run */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[14px] border border-line bg-white p-5">
          <p className="text-sm font-semibold text-ink">Ortalama TBM (boşa harcama tahmini için)</p>
          <form action={saveAvgCpc} className="mt-3 flex items-center gap-2">
            <input
              name="avgCpc"
              type="number"
              step="0.01"
              min="0"
              defaultValue={avgCpc || ""}
              disabled={!manage}
              placeholder="örn. 12.50"
              className="h-10 w-40 rounded-md border border-line px-3 text-sm focus:border-burgundy-700 focus:outline-none disabled:bg-cream-50"
            />
            <span className="text-sm text-ink-muted">₺ / tıklama</span>
            {manage && (
              <button className="rounded-md bg-burgundy-700 px-4 py-2 text-sm font-semibold text-white hover:bg-burgundy-800">
                Kaydet
              </button>
            )}
          </form>
        </div>
        {manage && (
          <div className="rounded-[14px] border border-line bg-white p-5">
            <p className="text-sm font-semibold text-ink">Analizi şimdi çalıştır</p>
            <p className="mt-1 text-xs text-ink-muted">
              Tespit motoru günde bir otomatik çalışır (Vercel Hobby planı). Daha sık
              çalıştırmak için Pro planına geçin veya aşağıdan manuel tetikleyin:
            </p>
            <form action={runJobNow} className="mt-3">
              <button className="rounded-md border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-cream-100">
                Şimdi çalıştır
              </button>
            </form>
            <p className="mt-3 text-xs text-ink-muted">
              Son çalışma: <span className="font-medium text-ink-secondary">{lastRun ? formatTrDateTime(lastRun.toISOString()) : "henüz çalışmadı"}</span>
            </p>
          </div>
        )}
      </div>

      {/* Clicks vs flagged over time */}
      <div className="mt-6 rounded-[14px] border border-line bg-white p-5">
        <p className="mb-4 text-sm font-semibold text-ink">Tıklama / işaretli (son 14 gün)</p>
        {series.length === 0 ? (
          <p className="text-sm text-ink-muted">Henüz veri yok.</p>
        ) : (
          <div className="space-y-1.5">
            {series.map((s) => (
              <div key={s.day} className="flex items-center gap-3 text-xs">
                <span className="w-20 shrink-0 text-ink-muted">{s.day.slice(5)}</span>
                <div className="relative h-4 flex-1 overflow-hidden rounded bg-cream-100">
                  <div className="absolute inset-y-0 left-0 bg-burgundy-700/30" style={{ width: `${(s.clicks / maxDay) * 100}%` }} />
                  <div className="absolute inset-y-0 left-0 bg-error/70" style={{ width: `${(s.flagged / maxDay) * 100}%` }} />
                </div>
                <span className="w-24 shrink-0 text-right tabular-nums text-ink">
                  {s.clicks} / <span className="text-error">{s.flagged}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clicks by hour (bot bursts) */}
      <div className="mt-6 rounded-[14px] border border-line bg-white p-5">
        <p className="mb-4 text-sm font-semibold text-ink">Saate göre tıklama (son 7 gün) — bot patlamalarını gösterir</p>
        <div className="flex items-end gap-1" style={{ height: 120 }}>
          {Array.from({ length: 24 }, (_, hour) => {
            const row = byHour.find((h) => h.hour === hour);
            const clicks = row?.clicks ?? 0;
            const flagged = row?.flagged ?? 0;
            return (
              <div key={hour} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full flex-1 items-end">
                  <div className="relative w-full overflow-hidden rounded-t bg-burgundy-700/30" style={{ height: `${(clicks / maxHour) * 100}%` }}>
                    <div className="absolute inset-x-0 bottom-0 bg-error/70" style={{ height: clicks ? `${(flagged / clicks) * 100}%` : "0%" }} />
                  </div>
                </div>
                <span className="text-[9px] text-ink-soft">{hour}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top flagged IPs */}
      <div className="mt-6 rounded-[14px] border border-line bg-white p-5">
        <p className="mb-4 text-sm font-semibold text-ink">En yüksek skorlu IP'ler</p>
        {top.length === 0 ? (
          <p className="text-sm text-ink-muted">Henüz işaretli IP yok.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-ink-muted">
                <th className="pb-2">IP</th>
                <th className="pb-2">Skor</th>
                <th className="pb-2">Tıklama</th>
                <th className="pb-2">Dönüşüm</th>
                <th className="pb-2">Ülke</th>
                <th className="pb-2">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {top.map((r) => (
                <tr key={r.id}>
                  <td className="py-2 font-mono text-xs">{r.ipAddress}</td>
                  <td className="py-2 font-semibold">{r.fraudScore}</td>
                  <td className="py-2">{r.totalClicks}</td>
                  <td className="py-2">{r.totalConversions}</td>
                  <td className="py-2">{r.country ?? "—"}</td>
                  <td className="py-2">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
