import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { cities, featuredCities, publishedCities } from "@/config/cities";
import { districts } from "@/config/districts";
import { routes } from "@/config/navigation";
import { serviceAreasFaqs } from "@/config/faq";
import { Section, SectionHeading } from "@/components/ui/section";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHero } from "@/components/ui/page-hero";
import { LocationSearch } from "@/components/forms/location-search";
import { TrustStrip } from "@/components/sections/trust-strip";
import { FinalCta } from "@/components/sections/final-cta";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { JsonLd } from "@/components/ui/json-ld";
import { collectionPageLd, faqPageLd } from "@/lib/seo/jsonld";
import { getCity } from "@/config/cities";

/** Short, honest logistics note per region — no fabricated local-office claims. */
const REGION_NOTES: Record<string, string> = {
  Marmara:
    "Yoğun nüfuslu ve sanayi ağırlıklı bir bölge olduğu için çekici ve teslim alma planlaması genellikle hızlı ilerler.",
  "İç Anadolu":
    "Şehir merkezleri arası mesafe daha uzun olabildiğinden, çekici süresi konuma göre değişkenlik gösterebilir.",
  Ege:
    "Kıyı ve iç kesim ilçeleri bir arada bulunduğu için teslim alma planı, aracın bulunduğu ilçeye göre netleştirilir.",
  Akdeniz:
    "Turizm ve tarım bölgelerinde mevsimsel yoğunluk olabileceğinden, çekici randevusu önceden planlanır.",
  "Güneydoğu Anadolu":
    "Şehirler arası mesafenin fazla olduğu bu bölgede teslim alma süresi konuma göre birlikte belirlenir.",
  Karadeniz:
    "Kıyı şeridine yayılan yerleşim nedeniyle çekici planlaması aracın bulunduğu ilçeye göre yapılır.",
};

export const metadata: Metadata = {
  title: "Hizmet Bölgeleri | Türkiye Geneli",
  description:
    "Türkiye geneli hasarlı, kazalı, pert ve hurda araç alımı. İstanbul, Ankara, İzmir ve tüm illerde ücretsiz çekici ile bulunduğunuz yerden alım.",
  keywords:
    "hasarlı araç alan şehirler, türkiye geneli araç alımı, hasarlı araç alan iller",
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
        image="/images/heroes/5.webp"
        eyebrow="Türkiye Geneli Araç Alım Hizmeti"
        title="Aracınızın Bulunduğu Şehri Seçin"
        description="Türkiye genelinden başvuru kabul edilir. Hizmet uygunluğu, araç ve konum değerlendirmesinin ardından netleştirilir."
      >
        <div className="max-w-xl">
          <LocationSearch entries={searchEntries} />
        </div>
      </PageHero>

      <TrustStrip />

      {/* Intro / logistics copy */}
      <Section tone="white" className="py-8 md:py-10">
        <div className="max-w-[760px]">
          <p className="text-[16px] leading-relaxed text-ink-secondary">
            Hasarlı, kazalı, pert ve hurda araç değerlendirmesini Türkiye
            genelinde aynı süreçle yürütüyoruz: aracın bulunduğu il ve ilçe
            fark etmeksizin bilgi ve fotoğraf paylaşımı ile değerlendirme
            başlar, ardından çekici veya teslim alma planlaması konuma göre
            netleştirilir. Aşağıda önceliklendirdiğimiz iller ve bölgelere
            göre gruplandırılmış tüm hizmet bölgelerini bulabilirsiniz.
          </p>
        </div>
      </Section>

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
                      <>
                        <Link href={routes.city(c.slug)} className="text-[15px] text-ink hover:text-burgundy-700">
                          {c.name}
                        </Link>
                        {districts.some((d) => d.citySlug === c.slug) && (
                          <span className="ml-2 text-[13px] text-ink-muted">
                            {districts
                              .filter((d) => d.citySlug === c.slug)
                              .map((d, i) => (
                                <span key={d.slug}>
                                  {i > 0 && " · "}
                                  <Link
                                    href={routes.district(c.slug, d.slug)}
                                    className="hover:text-burgundy-700"
                                  >
                                    {d.name}
                                  </Link>
                                </span>
                              ))}
                          </span>
                        )}
                      </>
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

      {/* Region differences */}
      <Section tone="alt">
        <SectionHeading
          eyebrow="Bölgeye Göre"
          title="Teslim Alma Süreci Bölgeye Göre Nasıl Değişir?"
          intro="Değerlendirme süreci her yerde aynıdır; farklılaşan tek şey çekici ve teslim alma için gereken planlamadır."
        />
        <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(REGION_NOTES).map(([region, note]) => (
            <div key={region} className="rounded-[14px] border border-line bg-white p-5">
              <h3 className="text-sm font-bold uppercase tracking-wide text-gold-700">
                {region}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-secondary">{note}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Hub FAQ */}
      <Section tone="white">
        <SectionHeading
          eyebrow="Sık Sorulan Sorular"
          title="Hizmet Bölgeleri Hakkında"
        />
        <div className="mt-10">
          <FaqAccordion items={serviceAreasFaqs} />
        </div>
      </Section>

      <FinalCta />

      <JsonLd
        data={[
          collectionPageLd({
            name: "Hizmet Bölgeleri",
            description:
              "Türkiye geneli hasarlı, kazalı, pert ve hurda araç alımı hizmeti verdiğimiz iller ve ilçeler.",
            url: routes.serviceAreas,
            items: publishedCities.map((c) => ({ name: c.name, url: routes.city(c.slug) })),
          }),
          faqPageLd(serviceAreasFaqs),
        ]}
      />
    </>
  );
}
