import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Camera, FileText, ListChecks } from "lucide-react";
import { services, getService } from "@/config/services";
import {
  getServiceContent,
  DEFAULT_EVALUATED,
  DEFAULT_PHOTOS,
  DEFAULT_DOCUMENTS,
} from "@/config/service-content";
import { routes } from "@/config/navigation";
import { siteConfig } from "@/config/site";
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
import { OfferExplainer } from "@/components/sections/offer-explainer";
import { RelatedServices } from "@/components/sections/related-services";
import { FinalCta } from "@/components/sections/final-cta";
import { serviceLd, faqPageLd } from "@/lib/seo/jsonld";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  const content = getServiceContent(slug);
  const title = service.metaTitle ?? service.title;
  const description = service.metaDescription ?? content.heroLead;
  const url = routes.service(slug);
  return {
    title,
    description,
    keywords: service.metaKeywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${siteConfig.brandName}`,
      description,
      url,
      type: "website",
      images: [{ url: service.image }],
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const content = getServiceContent(slug);

  // Rotate through the 7 hero images for variety across service pages.
  const heroIdx = Math.max(0, services.findIndex((s) => s.slug === slug));
  const heroImage = `/images/heroes/${(heroIdx % 7) + 1}.png`;

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Hangi Araçları Alıyoruz?", href: routes.vehiclesWeBuy },
          { label: service.title, href: routes.service(slug) },
        ]}
      />

      <PageHero
        image={heroImage}
        eyebrow={`${service.name} Alımı`}
        title={service.title}
        description={content.heroLead}
      >
        <CtaGroup
          whatsappMessage={`Merhaba, ${service.title.toLowerCase()} hakkında değerlendirme talep etmek istiyorum.`}
        />
      </PageHero>

      <TrustStrip />

      {/* Definition */}
      {content.definition.length > 0 && (
        <Section tone="cream">
          <div className="max-w-[760px]">
            <SectionHeading title={`${service.title} Nedir?`} align="left" />
            <div className="mt-5 space-y-4">
              {content.definition.map((p, i) => (
                <p key={i} className="text-[16px] leading-relaxed text-ink-secondary">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Who for + conditions */}
      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-2">
          {content.whoFor.length > 0 && (
            <div>
              <SectionHeading title="Bu Hizmet Kimler İçin Uygun?" align="left" />
              <IconList items={content.whoFor} className="mt-6" />
            </div>
          )}
          {content.conditions.length > 0 && (
            <div>
              <SectionHeading title="Tipik Araç Durumları" align="left" />
              <IconList items={content.conditions} className="mt-6" />
            </div>
          )}
        </div>
      </Section>

      {/* What is evaluated */}
      <Section tone="cream">
        <div className="max-w-[760px]">
          <p className="eyebrow mb-3">
            <ListChecks size={15} /> Değerlendirme
          </p>
          <SectionHeading title="Hangi Bilgiler Değerlendirilir?" align="left" />
          <p className="mt-4 max-w-[640px] text-[15px] leading-relaxed text-ink-muted">
            Aracınızın değeri aşağıdaki bilgiler bütün olarak ele alınarak
            belirlenir. Bilgiler ne kadar eksiksiz olursa değerlendirme o kadar
            sağlıklı olur.
          </p>
          <IconList items={DEFAULT_EVALUATED} columns className="mt-6" />
        </div>
      </Section>

      <HowItWorks />

      {/* Photos + documents */}
      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-3">
              <Camera size={15} /> Fotoğraflar
            </p>
            <SectionHeading title="Gerekli Fotoğraflar" align="left" />
            <IconList items={DEFAULT_PHOTOS} className="mt-6" />
          </div>
          <div>
            <p className="eyebrow mb-3">
              <FileText size={15} /> Belgeler
            </p>
            <SectionHeading title="Faydalı Belgeler" align="left" />
            <IconList items={DEFAULT_DOCUMENTS} className="mt-6" />
          </div>
        </div>
      </Section>

      {/* First vs final offer */}
      <Section tone="cream">
        <SectionHeading
          eyebrow="Şeffaf Süreç"
          title="İlk Değerlendirme ve Nihai Teklif"
          intro="Beklentilerinizi en baştan netleştiriyoruz."
        />
        <div className="mt-10">
          <OfferExplainer />
        </div>
      </Section>

      {/* Service FAQ */}
      {content.faqs.length > 0 && (
        <Section tone="alt">
          <SectionHeading
            eyebrow="Sık Sorulan Sorular"
            title={`${service.name} Hakkında Sorular`}
          />
          <div className="mt-10">
            <FaqAccordion items={content.faqs} />
          </div>
          <JsonLd data={faqPageLd(content.faqs)} />
        </Section>
      )}

      <RelatedServices currentSlug={slug} />

      <QuoteSection
        source={`service:${slug}`}
        title={`${service.name} İçin Ücretsiz Teklif Alın`}
        tone="cream"
      />

      <FinalCta />

      <JsonLd
        data={serviceLd({
          name: service.title,
          description: content.heroLead,
          url: routes.service(slug),
        })}
      />
    </>
  );
}
