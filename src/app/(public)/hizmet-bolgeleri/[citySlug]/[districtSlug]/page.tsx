import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { getCity } from "@/config/cities";
import { districts, getDistrict, districtsOfCity } from "@/config/districts";
import { siteConfig } from "@/config/site";
import { getDistrictContent } from "@/config/local-data";
import { locationMetaKeywords } from "@/lib/seo/local-copy";
import { featuredServices } from "@/config/services";
import { routes } from "@/config/navigation";
import { Section, SectionHeading } from "@/components/ui/section";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { IconList } from "@/components/ui/icon-list";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { JsonLd } from "@/components/ui/json-ld";
import { QuickOfferForm } from "@/components/forms/quick-offer-form";
import { TrustStrip } from "@/components/sections/trust-strip";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FinalCta } from "@/components/sections/final-cta";
import { faqPageLd } from "@/lib/seo/jsonld";

export const dynamicParams = false;

export function generateStaticParams() {
  return districts
    .filter((d) => getCity(d.citySlug)?.published)
    .map((d) => ({ citySlug: d.citySlug, districtSlug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ citySlug: string; districtSlug: string }>;
}): Promise<Metadata> {
  const { citySlug, districtSlug } = await params;
  const city = getCity(citySlug);
  const district = getDistrict(citySlug, districtSlug);
  if (!city || !district) return {};
  const content = getDistrictContent(citySlug, districtSlug);
  const title = content?.metaTitle ?? `${district.name} Hasarlı Araç Alımı`;
  const description =
    content?.metaDescription ??
    `${district.name} (${city.name}) bölgesinde hasarlı, kazalı ve çalışmayan araç alımı. Ücretsiz çekici ile yerinden alım, devirde nakit ödeme.`;
  const url = routes.district(citySlug, districtSlug);
  return {
    title,
    description,
    keywords: locationMetaKeywords(district.name),
    alternates: { canonical: url },
    openGraph: { title: `${title} | ${siteConfig.brandName}`, description, url, type: "website" },
  };
}

export default async function DistrictPage({
  params,
}: {
  params: Promise<{ citySlug: string; districtSlug: string }>;
}) {
  const { citySlug, districtSlug } = await params;
  const city = getCity(citySlug);
  const district = getDistrict(citySlug, districtSlug);
  if (!city || !city.published || !district) notFound();

  const content = getDistrictContent(citySlug, districtSlug);
  const nearbyDistricts = districtsOfCity(citySlug).filter((d) => d.slug !== districtSlug);

  const faqs = content?.faqs ?? [
    { q: `${district.name}'de hangi araçlar değerlendiriliyor?`, a: `${district.name} ve çevresinde hasarlı, kazalı, arızalı, çalışmayan ve hurda araçlar için değerlendirme talebi oluşturabilirsiniz.` },
    { q: "Aracı bulunduğum yerden alıyor musunuz?", a: "Teklif kabul edildiğinde araç bulunduğu noktadan ücretsiz çekici ile alınır." },
  ];

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Hizmet Bölgeleri", href: routes.serviceAreas },
          { label: city.name, href: routes.city(citySlug) },
          { label: district.name, href: routes.district(citySlug, districtSlug) },
        ]}
      />

      <section className="bg-cream-50">
        <div className="container-page grid items-start gap-8 py-10 md:py-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-4">{district.name} Araç Alım Hizmeti</p>
            <h1 className="text-[28px] font-bold leading-[1.12] text-ink md:text-[38px]">
              {content?.heroTitle ?? `${district.name}'de Hasarlı Araç Alımı`}
            </h1>
            <p className="mt-5 max-w-[560px] text-[16px] leading-relaxed text-ink-secondary md:text-[18px]">
              {content?.lead ??
                `${district.name} (${city.name}) bölgesindeki hasarlı, kazalı veya çalışmayan aracınız yerinden değerlendirilir.`}
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-[18px] border border-line bg-white p-5 shadow-[0_18px_50px_rgba(22,27,31,0.12)] md:p-6">
              <h2 className="text-lg font-bold text-ink">{district.name} İçin Teklif</h2>
              <div className="mt-5">
                <QuickOfferForm source={`district:${citySlug}:${districtSlug}`} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip />

      <Section tone="cream">
        <div className="max-w-[760px]">
          <SectionHeading title={`${district.name}’de Hizmet`} align="left" />
          {(content?.body ?? [
            `${district.name}, ${city.name} içindeki hizmet bölgelerimizden biridir. Bölgedeki hasarlı, arızalı veya çalışmayan araçlar için bilgilerinizi paylaşarak ücretsiz değerlendirme başlatabilirsiniz.`,
          ]).map((p, i) => (
            <p key={i} className="mt-4 text-[16px] leading-relaxed text-ink-secondary">
              {p}
            </p>
          ))}
          <IconList
            className="mt-6"
            items={
              content?.points ?? [
                "Bölgeden hızlı başvuru imkânı",
                "Çalışmayan araçlara ücretsiz çekici",
                "Konuma göre teslim veya taşıma planlaması",
                "Güvenli ve şeffaf devir süreci",
              ]
            }
          />
        </div>
      </Section>

      <Section tone="white">
        <SectionHeading title="Değerlendirilen Araç Türleri" align="left" />
        <div className="mt-6 flex flex-wrap gap-2.5">
          {featuredServices.map((s) => (
            <Link key={s.slug} href={routes.service(s.slug)} className="rounded-full border border-line bg-cream-50 px-4 py-2 text-sm font-medium text-ink hover:border-burgundy-700 hover:text-burgundy-700">
              {s.name}
            </Link>
          ))}
        </div>
      </Section>

      <HowItWorks />

      {nearbyDistricts.length > 0 && (
        <Section tone="cream">
          <SectionHeading title="Yakın İlçeler" align="left" />
          <div className="mt-6 flex flex-wrap gap-2.5">
            {nearbyDistricts.map((d) => (
              <Link key={d.slug} href={routes.district(citySlug, d.slug)} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:border-burgundy-700 hover:text-burgundy-700">
                <MapPin size={14} className="text-gold-600" />
                {d.name}
              </Link>
            ))}
          </div>
        </Section>
      )}

      <Section tone="alt">
        <SectionHeading eyebrow="Sık Sorulan Sorular" title={`${district.name} Hakkında Sorular`} />
        <div className="mt-10">
          <FaqAccordion items={faqs} />
        </div>
        <JsonLd data={faqPageLd(faqs)} />
      </Section>

      <FinalCta />
    </>
  );
}
