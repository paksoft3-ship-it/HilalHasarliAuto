import { CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { isDbConfigured } from "@/db";
import { requirePermission } from "@/lib/auth/guard";
import { getAdminLocale, translator, contentStatusLabels } from "@/lib/i18n/admin";
import { getSeoOverview } from "@/db/repo/admin-extra";
import { services } from "@/config/services";
import { publishedCities } from "@/config/cities";
import { StatCard, PageTitle } from "@/components/admin/bits";

const FILES = [
  { label: "Sitemap", href: "/sitemap.xml" },
  { label: "Robots", href: "/robots.txt" },
  { label: "llms.txt", href: "/llms.txt" },
  { label: "RSS", href: "/rss.xml" },
];

export default async function SeoPage() {
  await requirePermission("seo.read");
  const locale = await getAdminLocale();
  const t = translator(locale);
  const overview = isDbConfigured ? await getSeoOverview() : null;

  return (
    <>
      <PageTitle title={t("nav.seo")} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Hizmet Sayfası" value={services.length} accent />
        <StatCard label="Yayında Şehir" value={publishedCities.length} />
        {overview && (
          <StatCard
            label="Yayında İçerik"
            value={overview.byStatus.find((s) => s.status === "published")?.count ?? 0}
          />
        )}
        {overview && <StatCard label="SEO açıklaması eksik" value={overview.publishedMissingSeo} />}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[14px] border border-line bg-white p-5">
          <h2 className="mb-3 text-sm font-bold text-ink">{t("seo.sitemaps")}</h2>
          <ul className="space-y-2 text-sm">
            {FILES.map((f) => (
              <li key={f.href}>
                <a href={f.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-burgundy-700 hover:underline">
                  {f.label} <ExternalLink size={13} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {overview && (
          <div className="rounded-[14px] border border-line bg-white p-5">
            <h2 className="mb-3 text-sm font-bold text-ink">{t("seo.contentStatus")}</h2>
            {overview.byStatus.length === 0 ? (
              <p className="text-sm text-ink-muted">{t("common.noResults")}</p>
            ) : (
              <ul className="space-y-1.5 text-sm">
                {overview.byStatus.map((s) => (
                  <li key={s.status} className="flex justify-between">
                    <span className="text-ink-secondary">{contentStatusLabels[locale][s.status] ?? s.status}</span>
                    <span className="font-semibold text-ink">{s.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="rounded-[14px] border border-line bg-white p-5">
          <h2 className="mb-3 text-sm font-bold text-ink">{t("seo.gsc")}</h2>
          <p className="flex items-center gap-1.5 text-sm text-ink-muted">
            <XCircle size={15} /> {t("seo.notConnected")}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-ink-muted">
            Search Console OAuth entegrasyonu kimlik bilgileri sağlandığında etkinleştirilecektir
            (tıklama/gösterim/CTR/sıra, indeksleme durumu, URL denetimi).
          </p>
        </div>

        <div className="rounded-[14px] border border-line bg-white p-5">
          <h2 className="mb-3 text-sm font-bold text-ink">Teknik SEO</h2>
          <ul className="space-y-1.5 text-sm text-ink-secondary">
            {["Metadata API (başlık/açıklama/canonical)", "JSON-LD (Organization, Service, FAQ, Article)", "robots & sitemap & llms.txt", "ISR + yayında revalidate"].map((x) => (
              <li key={x} className="flex items-center gap-2"><CheckCircle2 size={14} className="text-success" /> {x}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
