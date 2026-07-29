import { Phone, FileText, Hand, Users, UserCheck, Network, Send } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { isDbConfigured } from "@/db";
import { requirePermission } from "@/lib/auth/guard";
import { getAdminLocale, translator } from "@/lib/i18n/admin";
import { getClickBreakdown, getClickVisitorStats, getTopClickIps, getRecentClicks, getVisitSummary, getContactUniques, getPerPersonClicks, getClickIpRanks, type ClickBreakdownRow, type ButtonUniques } from "@/db/repo/analytics";
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
  // Form-submit placements (form `source` becomes the location).
  homepage_hero: "Ana sayfa hero formu",
  contact_page: "İletişim sayfası formu",
  get_offer: "Detaylı teklif formu (/teklif-al)",
  "—": "Belirtilmemiş",
};

/** Friendly Turkish names + colours for each click event type. */
const EVENT_LABELS: Record<string, string> = {
  phone_click: "Telefon",
  whatsapp_click: "WhatsApp",
  quote_click: "Teklif",
  quote_form_submit: "Form Gönderimi",
};

/** Exact click time, in Türkiye (Europe/Istanbul) time. */
const CLICK_TIME_FMT = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "medium",
  timeStyle: "medium",
  timeZone: "Europe/Istanbul",
});

/** Top-6 clicking IPs get distinct colours; the rest share a neutral badge. */
const IP_BADGE_COLORS = [
  "bg-burgundy-700 text-white",
  "bg-charcoal-900 text-white",
  "bg-gold-600 text-white",
  "bg-info text-white",
  "bg-success text-white",
  "bg-warning text-white",
];

/**
 * Consistent visitor badge: the SAME IP always shows the SAME number in every
 * table on this page (numbered by click volume, IP #1 = busiest), so rows in
 * the per-person and raw tables can be cross-referenced at a glance.
 */
function IpBadge({ rank, total }: { rank: number | null; total?: number }) {
  if (rank === null) return <span className="text-[11px] text-ink-muted">kimliksiz</span>;
  const color = IP_BADGE_COLORS[rank - 1] ?? "bg-cream-200 text-ink-secondary";
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap">
      <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold ${color}`}>
        {rank}
      </span>
      {total !== undefined && total > 1 && (
        <span className="text-[11px] font-semibold text-ink-muted">×{total}</span>
      )}
    </span>
  );
}

function ChannelCard({ icon, label, u }: { icon: React.ReactNode; label: string; u: ButtonUniques }) {
  return (
    <div className="rounded-[14px] border border-line bg-white p-5">
      <div className="flex items-center gap-2 text-ink-muted">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <div className="mt-2 text-[28px] font-bold leading-none text-ink">{u.total.toLocaleString("tr-TR")}</div>
      <div className="mt-1 text-[11px] text-ink-muted">toplam tıklama</div>
      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3 text-center">
        <div>
          <div className="text-[18px] font-bold leading-none text-ink">{u.uniquePeople.toLocaleString("tr-TR")}</div>
          <div className="mt-1 text-[11px] text-ink-muted">benzersiz kişi (IP)</div>
        </div>
        <div>
          <div className="text-[18px] font-bold leading-none text-ink">{u.uniqueSessions.toLocaleString("tr-TR")}</div>
          <div className="mt-1 text-[11px] text-ink-muted">benzersiz oturum</div>
        </div>
      </div>
    </div>
  );
}

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
                <th className="py-2 px-2 text-right font-semibold">Form</th>
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
                  <td className="py-2 px-2 text-right tabular-nums text-ink-secondary">{r.quote_form_submit || "—"}</td>
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
      <PageTitle title={t("nav.clicks")} subtitle={`${range.label} · telefon, WhatsApp, teklif butonu ve form gönderimleri`} />
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
  const [{ totals, byLocation, byPage }, visitors, topIps, recent, visitSummary, contacts, personClicks, ipRanks] = await Promise.all([
    getClickBreakdown(range),
    getClickVisitorStats(range),
    getTopClickIps(range),
    getRecentClicks(range, 200),
    getVisitSummary(range),
    getContactUniques(range),
    getPerPersonClicks(range),
    getClickIpRanks(range),
  ]);
  // Shared badge numbering: same IP → same number in every table (1 = busiest).
  const ipRank = new Map(ipRanks.map((r, i) => [r.ipHash, { rank: i + 1, total: r.total }]));
  const repeatPct =
    visitors.uniqueVisitors > 0
      ? Math.round((visitors.repeatVisitors / visitors.uniqueVisitors) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* All-traffic visit summary — everyone, not just clickers */}
      <div className="rounded-[14px] border border-line bg-white p-5">
        <h2 className="text-sm font-bold text-ink">Ziyaret Özeti</h2>
        <p className="mb-3 text-xs text-ink-muted">
          Siteyi ziyaret eden herkes sayılır (arama/form yapmasa bile) — organik, doğrudan ve reklam trafiği dahil.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat icon={<Users size={14} />} label="Toplam ziyaret" value={visitSummary.totalVisits} hint="sayfa görüntüleme" />
          <Stat icon={<UserCheck size={14} />} label="Benzersiz ziyaretçi" value={visitSummary.uniqueVisitors} hint="farklı oturum" />
          <Stat icon={<Network size={14} />} label="Benzersiz IP" value={visitSummary.uniqueIps} hint="farklı IP adresi" />
        </div>
        <p className="mt-3 text-xs text-ink-muted">
          {visitSummary.totalVisits > 0
            ? `Bu dönemde ${visitSummary.totalVisits.toLocaleString("tr-TR")} ziyaretin ${visitors.totalClicks.toLocaleString("tr-TR")} tanesi bir butona tıklamayla sonuçlandı (≈%${Math.round((visitors.totalClicks / visitSummary.totalVisits) * 100)} dönüşüm).`
            : "Ziyaret verisi bu özellik yayına alındıktan sonraki ziyaretler için birikir."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={<Phone size={15} />} label="Telefon (Ara)" value={totals.phone_click} />
        <Kpi icon={<WhatsAppIcon size={15} />} label="WhatsApp" value={totals.whatsapp_click} />
        <Kpi icon={<FileText size={15} />} label="Hemen Teklif Al" value={totals.quote_click} />
        <Kpi icon={<Send size={15} />} label="Form Gönderimi" value={totals.quote_form_submit} />
      </div>

      {/* Per-channel uniques + combined unique contacts (a person counts once) */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChannelCard icon={<Phone size={15} />} label="Telefon" u={contacts.phone} />
        <ChannelCard icon={<WhatsAppIcon size={15} />} label="WhatsApp" u={contacts.whatsapp} />
        <div className="rounded-[14px] border-2 border-burgundy-700 bg-white p-5">
          <div className="flex items-center gap-2 text-burgundy-700">
            <Users size={15} />
            <span className="text-xs font-semibold uppercase tracking-wide">Toplam Benzersiz Kişi</span>
          </div>
          <div className="mt-2 text-[28px] font-bold leading-none text-burgundy-700">
            {contacts.totalUniqueContacts.toLocaleString("tr-TR")}
          </div>
          <div className="mt-1 text-[11px] text-ink-muted">
            telefon + WhatsApp birleşik — iki kanalı da kullanan kişi BİR kez sayılır
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3 text-center">
            <div>
              <div className="text-[18px] font-bold leading-none text-ink">{contacts.onlyPhone.toLocaleString("tr-TR")}</div>
              <div className="mt-1 text-[11px] text-ink-muted">sadece telefon</div>
            </div>
            <div>
              <div className="text-[18px] font-bold leading-none text-ink">{contacts.onlyWhatsapp.toLocaleString("tr-TR")}</div>
              <div className="mt-1 text-[11px] text-ink-muted">sadece WhatsApp</div>
            </div>
            <div>
              <div className="text-[18px] font-bold leading-none text-ink">{contacts.both.toLocaleString("tr-TR")}</div>
              <div className="mt-1 text-[11px] text-ink-muted">her ikisi</div>
            </div>
          </div>
        </div>
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
                  <th className="py-2 px-2 text-right font-semibold">Form</th>
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
                    <td className="py-2 px-2 text-right tabular-nums text-ink-secondary">{r.quote_form_submit || "—"}</td>
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

      {/* PER-PERSON table: one row per unique visitor (IP) per button */}
      <div className="rounded-[14px] border-2 border-burgundy-700 bg-white p-5">
        <h2 className="text-sm font-bold text-burgundy-700">Kişi Bazında Tıklamalar</h2>
        <p className="mb-3 text-xs text-ink-muted">
          Her satır = bir kişi (IP) + bir buton. <strong>İlk tıklama</strong> o kişinin sizinle iletişime
          geçmeyi ilk denediği andır — bu saatleri gerçek telefon arama kaydınız / WhatsApp sohbet
          başlangıçlarıyla karşılaştırın: tıklaması olup araması olmayan kişi, kaçırılmış bir müşteridir.
          En yeni ilk tıklama üstte, en fazla {personClicks.length} satır.
        </p>
        {personClicks.length === 0 ? (
          <p className="text-sm text-ink-muted">Bu aralıkta IP&apos;si tanımlı tıklama yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
                  <th className="py-2 pr-3 font-semibold">Kişi</th>
                  <th className="py-2 px-2 font-semibold">Buton</th>
                  <th className="py-2 px-2 font-semibold">İlk tıklama</th>
                  <th className="py-2 px-2 font-semibold">Son tıklama</th>
                  <th className="py-2 px-2 text-right font-semibold">Tıklama</th>
                  <th className="py-2 px-2 font-semibold">İlk tıklama yeri</th>
                  <th className="py-2 pl-2 font-semibold">İlk sayfa</th>
                </tr>
              </thead>
              <tbody>
                {personClicks.map((r) => {
                  const badge = ipRank.get(r.ipHash);
                  return (
                    <tr key={`${r.ipHash}-${r.name}`} className="border-b border-line last:border-0">
                      <td className="py-2 pr-3"><IpBadge rank={badge?.rank ?? null} total={badge?.total} /></td>
                      <td className="py-2 px-2 text-ink">{EVENT_LABELS[r.name] ?? r.name}</td>
                      <td className="py-2 px-2 whitespace-nowrap font-bold tabular-nums text-ink">
                        {CLICK_TIME_FMT.format(r.firstAt)}
                      </td>
                      <td className="py-2 px-2 whitespace-nowrap tabular-nums text-ink-secondary">
                        {r.count > 1 ? CLICK_TIME_FMT.format(r.lastAt) : "—"}
                      </td>
                      <td className="py-2 px-2 text-right font-semibold tabular-nums text-ink">{r.count}</td>
                      <td className="py-2 px-2 text-ink-secondary" title={r.firstLocation}>
                        {LOCATION_LABELS[r.firstLocation] ?? r.firstLocation}
                      </td>
                      <td className="py-2 pl-2 font-mono text-[12px] text-ink-secondary">{r.firstPage}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
                  <th className="py-2 px-2 font-semibold">Kişi</th>
                  <th className="py-2 px-2 font-semibold">Buton</th>
                  <th className="py-2 px-2 font-semibold">Yer</th>
                  <th className="py-2 pl-2 font-semibold">Sayfa</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => {
                  const badge = r.ipHash ? ipRank.get(r.ipHash) : undefined;
                  return (
                    <tr key={r.id} className="border-b border-line last:border-0">
                      <td className="py-2 pr-3 whitespace-nowrap tabular-nums text-ink-secondary">
                        {CLICK_TIME_FMT.format(r.occurredAt)}
                      </td>
                      <td className="py-2 px-2"><IpBadge rank={badge?.rank ?? null} total={badge?.total} /></td>
                      <td className="py-2 px-2 text-ink">{EVENT_LABELS[r.name] ?? r.name}</td>
                      <td className="py-2 px-2 text-ink-secondary" title={r.location}>
                        {LOCATION_LABELS[r.location] ?? r.location}
                      </td>
                      <td className="py-2 pl-2 font-mono text-[12px] text-ink-secondary">{r.pageUrl}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="flex items-start gap-1.5 text-xs text-ink-muted">
        <Hand size={13} className="mt-0.5 shrink-0" /> Sayımlar birinci taraftır ve seçilen tarih aralığını
        yansıtır. Tıklama = butona her basış; kişi = farklı IP; oturum = aynı tarayıcı ziyareti. Ziyaretçiler
        oturum kimliğiyle, IP&apos;ler ise geri döndürülemez bir özetle (ham IP saklanmaz) sayılır. IP
        bazlı &quot;kişi&quot; sayısı bir yaklaşımdır: ortak Wi-Fi kullanan farklı kişiler tek kişi görünebilir,
        mobil operatör IP&apos;leri ise değişebildiğinden aynı kişi birden fazla sayılabilir. Ziyaretçi/IP
        verileri yalnızca bu özellik yayına alındıktan sonraki tıklamalar için mevcuttur.
      </p>
    </div>
  );
}
