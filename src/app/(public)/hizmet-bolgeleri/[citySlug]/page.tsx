import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { publishedCities, getCity, featuredCities } from "@/config/cities";
import { districtsOfCity } from "@/config/districts";
import { services, serviceIconImage } from "@/config/services";
import { routes } from "@/config/navigation";
import { DEFAULT_EVALUATED } from "@/config/service-content";
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
import { faqPageLd } from "@/lib/seo/jsonld";

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
  return {
    title: `${city.name} Hasarlı Araç Alımı`,
    description: `${city.locative} hasarlı, kazalı, arızalı ve çalışmayan araçlar için değerlendirme talebi oluşturun. Konum ve araç durumuna göre süreç planlanır.`,
    alternates: { canonical: routes.city(citySlug) },
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

  const cityDistricts = districtsOfCity(citySlug);
  const nearby = featuredCities.filter((c) => c.region === city.region && c.slug !== city.slug).slice(0, 5);

  const cityFaqs = [
    { q: `${city.locative} hangi araçlar değerlendiriliyor?`, a: `${city.locative} hasarlı, kazalı, pert, arızalı, çalışmayan, yanmış, sel hasarlı, hurda ve çekme belgeli araçlar için değerlendirme talebi oluşturabilirsiniz.` },
    { q: `Aracım ${city.name} dışındaysa ne olur?`, a: `Çevre il ve ilçelerden de başvuru kabul edilir. Konuma göre teslim veya taşıma seçenekleri planlanır.` },
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
        image="/images/heroes/5.png"
        eyebrow={`${city.name} Geneli Araç Alım Hizmeti`}
        title={`${city.locative} Hasarlı ve Çalışmayan Araçlar İçin Teklif Alın`}
        description={`${city.name} ve çevresindeki araçlar için değerlendirme talebi oluşturabilirsiniz. Konum ve araç durumuna göre hizmet planlaması yapılır.`}
      >
        <CtaGroup
          whatsappMessage={`Merhaba, ${city.locative} bir aracım var, değerlendirme talep etmek istiyorum.`}
        />
      </PageHero>

      <TrustStrip />

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

      {/* Local FAQ */}
      <Section tone="alt">
        <SectionHeading eyebrow="Sık Sorulan Sorular" title={`${city.name} Hakkında Sorular`} />
        <div className="mt-10">
          <FaqAccordion items={cityFaqs} />
        </div>
        <JsonLd data={faqPageLd(cityFaqs)} />
      </Section>

      <QuoteSection
        source={`city:${citySlug}`}
        title={`${city.locative} Ücretsiz Teklif Alın`}
        tone="white"
      />

      <FinalCta />
    </>
  );
}
