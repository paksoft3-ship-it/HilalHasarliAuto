import { Phone, FileText, Hand } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { isDbConfigured } from "@/db";
import { requirePermission } from "@/lib/auth/guard";
import { getAdminLocale, translator } from "@/lib/i18n/admin";
import { getClickBreakdown, type ClickBreakdownRow } from "@/db/repo/analytics";
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
  const { totals, byLocation, byPage } = await getClickBreakdown(range);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi icon={<Phone size={15} />} label="Telefon (Ara)" value={totals.phone_click} />
        <Kpi icon={<WhatsAppIcon size={15} />} label="WhatsApp" value={totals.whatsapp_click} />
        <Kpi icon={<FileText size={15} />} label="Hemen Teklif Al" value={totals.quote_click} />
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

      <p className="flex items-center gap-1.5 text-xs text-ink-muted">
        <Hand size={13} /> Sayımlar birinci taraf, anonimdir (IP/çerez saklanmaz) ve seçilen tarih aralığını yansıtır.
      </p>
    </div>
  );
}
