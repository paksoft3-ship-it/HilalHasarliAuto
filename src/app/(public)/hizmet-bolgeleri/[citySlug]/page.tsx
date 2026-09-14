import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { publishedCities, getCity, featuredCities } from "@/config/cities";
import { districtsOfCity } from "@/config/districts";
import { services, serviceIconImage } from "@/config/services";
import { clusterPages } from "@/config/cluster-content";
import { routes } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { DEFAULT_EVALUATED } from "@/config/service-content";
import { getCityContent } from "@/config/local-data";
import { cityMetaTitle, cityMetaDescription, locationMetaKeywords } from "@/lib/seo/local-copy";
import { Section, SectionHeading } from "@/components/ui/section";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHero } from "@/components/ui/page-hero";
import { IconList } from "@/components/ui/icon-list";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { JsonLd } from "@/components/ui/json-ld";
import { CtaGroup } from "@/components/sections/cta-buttons";
import { QuoteSection } from "@/components/sections/quote-section";
import { TrustStrip } from "@/components/sections/trust-strip";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FinalCta } from "@/components/sections/final-cta";
import { faqPageLd, localBusinessLd } from "@/lib/seo/jsonld";
import { seoTitle, seoDescription } from "@/lib/seo/title";

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedCities.map((c) => ({ citySlug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ citySlug: string }>;
}): Promise<Metadata> {
  const { citySlug } = await params;
  const city = getCity(citySlug);
  if (!city) return {};
  const title = cityMetaTitle(city);
  const description = cityMetaDescription(city);
  const url = routes.city(citySlug);
  return {
    title: seoTitle(title),
    description: seoDescription(description),
    keywords: locationMetaKeywords(city.name),
    alternates: { canonical: url },
    openGraph: { title: `${title} | ${siteConfig.brandName}`, description, url, type: "website" },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ citySlug: string }>;
}) {
  const { citySlug } = await params;
  const city = getCity(citySlug);
  if (!city || !city.published) notFound();

  const content = getCityContent(citySlug);
  const cityDistricts = districtsOfCity(citySlug);
  const nearby = featuredCities.filter((c) => c.region === city.region && c.slug !== city.slug).slice(0, 5);

  const cityFaqs = content?.faqs ?? [
    { q: `${city.locative} hangi araçlar değerlendiriliyor?`, a: `${city.locative} hasarlı, kazalı, pert, arızalı, çalışmayan, yanmış, sel hasarlı, hurda ve çekme belgeli araçlar için değerlendirme talebi oluşturabilirsiniz.` },
    { q: "Değerlendirme ücretli mi?", a: "Hayır. Değerlendirme talebi oluşturmak ücretsizdir ve sizi bağlamaz." },
  ];

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Hizmet Bölgeleri", href: routes.serviceAreas },
          { label: city.name, href: routes.city(citySlug) },
        ]}
      />

      <PageHero
        image={`/images/heroes/${content?.heroImage ?? 5}.webp`}
        imageAlt={content?.heroAlt}
        eyebrow={`${city.name} Geneli Araç Alım Hizmeti`}
        title={content?.heroTitle ?? `${city.locative} Hasarlı Araç Alımı`}
        description={content?.intro ?? `${city.name} genelinde hasarlı araçlar için ücretsiz değerlendirme ve yerinden alım hizmeti veriyoruz.`}
      >
        <CtaGroup
          location="hero"
          whatsappMessage={`Merhaba, ${city.locative} bir aracım var, değerlendirme talep etmek istiyorum.`}
        />
      </PageHero>

      <TrustStrip />

      {/* Unique local context */}
      {content && (
        <Section tone="white">
          <div className="max-w-[760px]">
            <SectionHeading eyebrow="Bölge Notları" title={`${city.locative} Hasarlı Araç Alımı Nasıl İşliyor?`} align="left" />
            {content.about.map((p, i) => (
              <p key={i} className="mt-4 text-[16px] leading-relaxed text-ink-secondary">
                {p}
              </p>
            ))}
            <IconList items={content.localPoints} className="mt-6" />
          </div>
        </Section>
      )}

      {/* Services available */}
      <Section tone="cream">
        <SectionHeading eyebrow="Hizmetler" title={`${city.locative} Değerlendirilen Araçlar`} />
        <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {services.map((s) => (
            <Link key={s.slug} href={routes.service(s.slug)} className="group flex items-center gap-3 rounded-[12px] border border-line bg-white p-3 transition-colors hover:border-burgundy-700">
              <span className="relative h-12 w-20 shrink-0">
                <Image src={serviceIconImage(s.slug)} alt={s.name} fill sizes="80px" className="object-contain" />
              </span>
              <span className="text-[13px] font-semibold text-ink">{s.name}</span>
            </Link>
          ))}
        </div>
      </Section>

      {/* District directory */}
      {cityDistricts.length > 0 && (
        <Section tone="white">
          <SectionHeading eyebrow="İlçeler" title={`${city.name} İlçeleri`} align="left" />
          <div className="mt-6 flex flex-wrap gap-2.5">
            {cityDistricts.map((d) => (
              <Link key={d.slug} href={routes.district(citySlug, d.slug)} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream-50 px-4 py-2 text-sm font-medium text-ink hover:border-burgundy-700 hover:text-burgundy-700">
                <MapPin size={14} className="text-gold-600" />
                {d.name}
              </Link>
            ))}
          </div>
        </Section>
      )}

      <HowItWorks />

      {/* Valuation criteria */}
      <Section tone="cream">
        <div className="max-w-[760px]">
          <SectionHeading eyebrow="Değerlendirme" title="Aracınız Neye Göre Değerlendirilir?" align="left" />
          <IconList items={DEFAULT_EVALUATED} columns className="mt-6" />
        </div>
      </Section>

      {/* Nearby cities */}
      {nearby.length > 0 && (
        <Section tone="white">
          <SectionHeading title="Yakın Şehirler" align="left" />
          <div className="mt-6 flex flex-wrap gap-2.5">
            {nearby.map((c) => (
              <Link key={c.slug} href={routes.city(c.slug)} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream-50 px-4 py-2 text-sm font-medium text-ink hover:border-burgundy-700 hover:text-burgundy-700">
                {c.name}
                <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Hasar türüne göre ulusal sayfalar — her şehir sayfasından erişilebilir
          olması, bu sayfalar taranırken kümeleme sayfalarının da keşfedilmesini
          sağlar (crawl cascade). */}
      <Section tone="cream">
        <SectionHeading eyebrow="Hasar Türüne Göre" title="Türkiye Geneli Değerlendirme" align="left" />
        <div className="mt-6 flex flex-wrap gap-2.5">
          <Link href={routes.home} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:border-burgundy-700 hover:text-burgundy-700">
            Hasarlı Araç Alan
          </Link>
          {clusterPages.map((c) => (
            <Link key={c.slug} href={routes[c.routeKey]} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:border-burgundy-700 hover:text-burgundy-700">
              {c.shortTitle}
            </Link>
          ))}
        </div>
      </Section>

      {/* Local FAQ */}
      <Section tone="alt">
        <SectionHeading eyebrow="Sık Sorulan Sorular" title={`${city.name} Hakkında Sorular`} />
        <div className="mt-10">
          <FaqAccordion items={cityFaqs} />
        </div>
        <JsonLd data={faqPageLd(cityFaqs)} />
      </Section>

      <JsonLd
        data={localBusinessLd({
          cityName: city.name,
          citySlug,
          districtNames: cityDistricts.map((d) => d.name),
        })}
      />

      <QuoteSection
        source={`city:${citySlug}`}
        title={`${city.locative} Ücretsiz Teklif Alın`}
        tone="white"
      />

      <FinalCta />
    </>
  );
}
