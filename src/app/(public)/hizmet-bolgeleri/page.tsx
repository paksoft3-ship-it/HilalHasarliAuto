import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { cities, featuredCities, publishedCities } from "@/config/cities";
import { districts } from "@/config/districts";
import { routes } from "@/config/navigation";
import { Section, SectionHeading } from "@/components/ui/section";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHero } from "@/components/ui/page-hero";
import { LocationSearch } from "@/components/forms/location-search";
import { TrustStrip } from "@/components/sections/trust-strip";
import { FinalCta } from "@/components/sections/final-cta";
import { getCity } from "@/config/cities";

export const metadata: Metadata = {
  title: "Türkiye Hizmet Bölgeleri",
  description:
    "Türkiye geneli araç alım hizmeti. Şehrinizi seçin; konum ve araç durumuna göre değerlendirme süreci planlanır.",
  alternates: { canonical: routes.serviceAreas },
};

const searchEntries = [
  ...publishedCities.map((c) => ({
    label: c.name,
    href: routes.city(c.slug),
    sub: `${c.region} · İl`,
    published: true,
  })),
  ...districts
    .filter((d) => getCity(d.citySlug)?.published)
    .map((d) => ({
      label: d.name,
      href: routes.district(d.citySlug, d.slug),
      sub: `${getCity(d.citySlug)?.name} · İlçe`,
      published: true,
    })),
];

export default function ServiceAreasPage() {
  // Group all priority cities by region for the directory.
  const byRegion = cities.reduce<Record<string, typeof cities>>((acc, c) => {
    (acc[c.region] ??= []).push(c);
    return acc;
  }, {});

  return (
    <>
      <Breadcrumb items={[{ label: "Hizmet Bölgeleri", href: routes.serviceAreas }]} />

      <PageHero
        image="/images/heroes/5.png"
        eyebrow="Türkiye Geneli Araç Alım Hizmeti"
        title="Aracınızın Bulunduğu Şehri Seçin"
        description="Türkiye genelinden başvuru kabul edilir. Hizmet uygunluğu, araç ve konum değerlendirmesinin ardından netleştirilir."
      >
        <div className="max-w-xl">
          <LocationSearch entries={searchEntries} />
        </div>
      </PageHero>

      <TrustStrip />

      {/* Featured cities */}
      <Section tone="cream">
        <SectionHeading eyebrow="Öne Çıkan Şehirler" title="Hizmet Verdiğimiz Başlıca İller" />
        <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {featuredCities.map((c) => (
            <Link
              key={c.slug}
              href={routes.city(c.slug)}
              className="group flex items-center gap-3 rounded-[14px] border border-line bg-white p-4 transition-colors hover:border-burgundy-700"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-cream-100 text-burgundy-700">
                <MapPin size={18} />
              </span>
              <span className="flex flex-col">
                <span className="text-[15px] font-semibold text-ink">{c.name}</span>
                <span className="text-xs text-ink-muted">{c.region}</span>
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Regional directory */}
      <Section tone="white">
        <SectionHeading eyebrow="Bölgeler" title="Öncelikli İller" />
        <div className="mt-9 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(byRegion).map(([region, list]) => (
            <div key={region}>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gold-700">
                {region}
              </h3>
              <ul className="space-y-1.5">
                {list.map((c) => (
                  <li key={c.slug}>
                    {c.published ? (
                      <Link href={routes.city(c.slug)} className="text-[15px] text-ink hover:text-burgundy-700">
                        {c.name}
                      </Link>
                    ) : (
                      <span className="text-[15px] text-ink-muted">
                        {c.name} <span className="text-xs">(yakında)</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ink-muted">
          Listede yer almayan il ve ilçelerden de başvuru kabul edilir. Konum ve
          araç durumuna göre hizmet planlaması yapılır.
        </p>
      </Section>

      <FinalCta />
    </>
  );
}
