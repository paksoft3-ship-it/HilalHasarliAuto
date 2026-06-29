import { Phone, FileText, Hand, Users, UserCheck, Network } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { isDbConfigured } from "@/db";
import { requirePermission } from "@/lib/auth/guard";
import { getAdminLocale, translator } from "@/lib/i18n/admin";
import { getClickBreakdown, getClickVisitorStats, getTopClickIps, getRecentClicks, type ClickBreakdownRow } from "@/db/repo/analytics";
import { resolveRange } from "@/lib/admin/date-range";
import { NotConfigured, PageTitle } from "@/components/admin/bits";
import { RangeFilter } from "@/components/admin/range-filter";

/** Friendly Turkish names for each button placement (data-track-location). */
const LOCATION_LABELS: Record<string, string> = {
  header: "Üst menü (header)",
  header_mobile: "Üst menü — mobil telefon ikonu",
  mobile_menu: "Mobil açılır menü",
  mobile_bar: "Alt sabit çubuk (mobil)",
  floating: "Yüzen WhatsApp butonu",
  footer: "Alt bilgi (footer)",
  hero: "Hero (sayfa üstü)",
  cta_banner: "CTA banner (sayfa sonu)",
  cta: "Sayfa CTA",
  offer_sidebar: "Teklif sayfası yan panel",
  vehicles_page: "Araçlar sayfası",
  hangi_araclar: "Hangi Araçlar sayfası",
  iletisim: "İletişim sayfası",
  faq: "SSS sayfası",
  thank_you: "Teşekkürler sayfası",
  arama: "Arama sayfası",
  "—": "Belirtilmemiş",
};

/** Friendly Turkish names + colours for each click event type. */
const EVENT_LABELS: Record<string, string> = {
  phone_click: "Telefon",
  whatsapp_click: "WhatsApp",
  quote_click: "Teklif",
};

/** Exact click time, in Türkiye (Europe/Istanbul) time. */
const CLICK_TIME_FMT = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "medium",
  timeStyle: "medium",
  timeZone: "Europe/Istanbul",
});

function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-[14px] border border-line bg-white p-5">
      <div className="flex items-center gap-2 text-ink-muted">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <div className="mt-2 text-[28px] font-bold leading-none text-ink">{value.toLocaleString("tr-TR")}</div>
    </div>
  );
}

function Stat({ icon, label, value, hint }: { icon?: React.ReactNode; label: string; value: number; hint?: string }) {
  return (
    <div className="rounded-[12px] border border-line bg-cream-50 p-4">
      <div className="flex items-center gap-1.5 text-ink-muted">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <div className="mt-1.5 text-[22px] font-bold leading-none text-ink">{value.toLocaleString("tr-TR")}</div>
      {hint && <div className="mt-1 text-[11px] text-ink-muted">{hint}</div>}
    </div>
  );
}

function BreakdownTable({
  title,
  subtitle,
  rows,
  labeler,
}: {
  title: string;
  subtitle: string;
  rows: ClickBreakdownRow[];
  labeler: (key: string) => string;
}) {
  return (
    <div className="rounded-[14px] border border-line bg-white p-5">
      <h2 className="text-sm font-bold text-ink">{title}</h2>
      <p className="mb-3 text-xs text-ink-muted">{subtitle}</p>
      {rows.length === 0 ? (
        <p className="text-sm text-ink-muted">Bu aralıkta tıklama yok.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
                <th className="py-2 pr-3 font-semibold">Yer</th>
                <th className="py-2 px-2 text-right font-semibold">Telefon</th>
                <th className="py-2 px-2 text-right font-semibold">WhatsApp</th>
                <th className="py-2 px-2 text-right font-semibold">Teklif</th>
                <th className="py-2 pl-2 text-right font-semibold">Toplam</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className="border-b border-line last:border-0">
                  <td className="py-2 pr-3 text-ink" title={r.key}>{labeler(r.key)}</td>
                  <td className="py-2 px-2 text-right tabular-nums text-ink-secondary">{r.phone_click || "—"}</td>
                  <td className="py-2 px-2 text-right tabular-nums text-ink-secondary">{r.whatsapp_click || "—"}</td>
                  <td className="py-2 px-2 text-right tabular-nums text-ink-secondary">{r.quote_click || "—"}</td>
                  <td className="py-2 pl-2 text-right font-semibold tabular-nums text-ink">{r.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default async function ClicksPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; from?: string; to?: string }>;
}) {
  await requirePermission("analytics.view");
  const locale = await getAdminLocale();
  const t = translator(locale);
  const range = resolveRange(await searchParams);

  return (
    <>
      <PageTitle title={t("nav.clicks")} subtitle={`${range.label} · telefon, WhatsApp ve teklif butonu tıklamaları`} />
      <RangeFilter preset={range.preset} fromStr={range.fromStr} toStr={range.toStr} />

      {!isDbConfigured ? (
        <NotConfigured message={t("common.notConfigured")} />
      ) : (
        <Report range={range} />
      )}
    </>
  );
}

async function Report({ range }: { range: ReturnType<typeof resolveRange> }) {
  const [{ totals, byLocation, byPage }, visitors, topIps, recent] = await Promise.all([
    getClickBreakdown(range),
    getClickVisitorStats(range),
    getTopClickIps(range),
    getRecentClicks(range),
  ]);
  const repeatPct =
    visitors.uniqueVisitors > 0
      ? Math.round((visitors.repeatVisitors / visitors.uniqueVisitors) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi icon={<Phone size={15} />} label="Telefon (Ara)" value={totals.phone_click} />
        <Kpi icon={<WhatsAppIcon size={15} />} label="WhatsApp" value={totals.whatsapp_click} />
        <Kpi icon={<FileText size={15} />} label="Hemen Teklif Al" value={totals.quote_click} />
      </div>

      {/* Unique vs repeat visitors + same-IP signal */}
      <div className="rounded-[14px] border border-line bg-white p-5">
        <h2 className="text-sm font-bold text-ink">Ziyaretçi &amp; IP</h2>
        <p className="mb-3 text-xs text-ink-muted">
          Tıklamaların aynı ziyaretçi/IP&apos;den mi yoksa farklı kişilerden mi geldiğini gösterir.
        </p>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Stat icon={<Users size={14} />} label="Benzersiz ziyaretçi" value={visitors.uniqueVisitors} hint="farklı oturum" />
          <Stat icon={<UserCheck size={14} />} label="Tekrar eden" value={visitors.repeatVisitors} hint={`birden çok tıklayan · %${repeatPct}`} />
          <Stat icon={<Network size={14} />} label="Benzersiz IP" value={visitors.uniqueIps} hint="farklı IP adresi" />
          <Stat icon={<Network size={14} />} label="Aynı IP'den tekrar" value={visitors.multiClickIps} hint={`${visitors.clicksFromMultiClickIps.toLocaleString("tr-TR")} tıklama`} />
          <Stat label="Toplam tıklama" value={visitors.totalClicks} hint={visitors.identified < visitors.totalClicks ? `${(visitors.totalClicks - visitors.identified).toLocaleString("tr-TR")} kimliksiz` : "tümü tanımlı"} />
        </div>
      </div>

      {/* Top repeated IPs */}
      <div className="rounded-[14px] border border-line bg-white p-5">
        <h2 className="text-sm font-bold text-ink">En Çok Tıklayan IP&apos;ler</h2>
        <p className="mb-3 text-xs text-ink-muted">
          Birden fazla tıklama yapan IP&apos;ler (özet). Tek bir IP&apos;de birden çok ziyaretçi
          görmek, paylaşımlı bağlantı veya otomasyon işareti olabilir.
        </p>
        {topIps.length === 0 ? (
          <p className="text-sm text-ink-muted">Bu aralıkta birden fazla tıklayan IP yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
                  <th className="py-2 pr-3 font-semibold">IP (özet)</th>
                  <th className="py-2 px-2 text-right font-semibold">Telefon</th>
                  <th className="py-2 px-2 text-right font-semibold">WhatsApp</th>
                  <th className="py-2 px-2 text-right font-semibold">Teklif</th>
                  <th className="py-2 px-2 text-right font-semibold">Ziyaretçi</th>
                  <th className="py-2 px-2 text-right font-semibold">Sayfa</th>
                  <th className="py-2 pl-2 text-right font-semibold">Toplam</th>
                </tr>
              </thead>
              <tbody>
                {topIps.map((r) => (
                  <tr key={r.ipHash} className="border-b border-line last:border-0">
                    <td className="py-2 pr-3 font-mono text-[12px] text-ink-secondary">
                      {r.ipHash.slice(0, 10)}…
                      {r.visitors > 1 && (
                        <span className="ml-2 rounded bg-warning-surface px-1.5 py-0.5 text-[10px] font-semibold text-warning">
                          {r.visitors} ziyaretçi
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-right tabular-nums text-ink-secondary">{r.phone_click || "—"}</td>
                    <td className="py-2 px-2 text-right tabular-nums text-ink-secondary">{r.whatsapp_click || "—"}</td>
                    <td className="py-2 px-2 text-right tabular-nums text-ink-secondary">{r.quote_click || "—"}</td>
                    <td className="py-2 px-2 text-right tabular-nums text-ink-secondary">{r.visitors}</td>
                    <td className="py-2 px-2 text-right tabular-nums text-ink-secondary">{r.pages}</td>
                    <td className="py-2 pl-2 text-right font-semibold tabular-nums text-ink">{r.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <BreakdownTable
        title="Konuma Göre"
        subtitle="Hangi buton, sayfanın neresinde tıklandı (header, yüzen buton, hero, CTA banner, alt çubuk…)."
        rows={byLocation}
        labeler={(k) => LOCATION_LABELS[k] ?? k}
      />

      <BreakdownTable
        title="Sayfaya Göre"
        subtitle="Hangi sayfada tıklandı."
        rows={byPage}
        labeler={(k) => k}
      />

      {/* Per-click log with the exact time of each click */}
      <div className="rounded-[14px] border border-line bg-white p-5">
        <h2 className="text-sm font-bold text-ink">Son Tıklamalar</h2>
        <p className="mb-3 text-xs text-ink-muted">
          Her butona tam olarak ne zaman tıklandığı — yeri ve sayfasıyla birlikte (en yeni
          üstte, Türkiye saati). En fazla {recent.length} kayıt gösterilir.
        </p>
        {recent.length === 0 ? (
          <p className="text-sm text-ink-muted">Bu aralıkta tıklama yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
                  <th className="py-2 pr-3 font-semibold">Zaman</th>
                  <th className="py-2 px-2 font-semibold">Buton</th>
                  <th className="py-2 px-2 font-semibold">Yer</th>
                  <th className="py-2 pl-2 font-semibold">Sayfa</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id} className="border-b border-line last:border-0">
                    <td className="py-2 pr-3 whitespace-nowrap tabular-nums text-ink-secondary">
                      {CLICK_TIME_FMT.format(r.occurredAt)}
                    </td>
                    <td className="py-2 px-2 text-ink">{EVENT_LABELS[r.name] ?? r.name}</td>
                    <td className="py-2 px-2 text-ink-secondary" title={r.location}>
                      {LOCATION_LABELS[r.location] ?? r.location}
                    </td>
                    <td className="py-2 pl-2 font-mono text-[12px] text-ink-secondary">{r.pageUrl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="flex items-start gap-1.5 text-xs text-ink-muted">
        <Hand size={13} className="mt-0.5 shrink-0" /> Sayımlar birinci taraftır ve seçilen tarih aralığını
        yansıtır. Ziyaretçiler oturum kimliğiyle, IP&apos;ler ise geri döndürülemez bir özetle (ham IP
        saklanmaz) sayılır. Ziyaretçi/IP verileri yalnızca bu özellik yayına alındıktan sonraki tıklamalar için mevcuttur.
      </p>
    </div>
  );
}
