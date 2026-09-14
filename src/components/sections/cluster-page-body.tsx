import Link from "next/link";
import { ListChecks, Info } from "lucide-react";
import type { ClusterPageContent } from "@/config/cluster-content";
import { clusterPages } from "@/config/cluster-content";
import { getService } from "@/config/services";
import { routes } from "@/config/navigation";
import { Section, SectionHeading } from "@/components/ui/section";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHero } from "@/components/ui/page-hero";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { JsonLd } from "@/components/ui/json-ld";
import { CtaGroup } from "@/components/sections/cta-buttons";
import { QuoteSection } from "@/components/sections/quote-section";
import { TrustStrip } from "@/components/sections/trust-strip";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FinalCta } from "@/components/sections/final-cta";
import { serviceLd, faqPageLd } from "@/lib/seo/jsonld";

export function ClusterPageBody({ content }: { content: ClusterPageContent }) {
  const url = routes[content.routeKey];
  const siblings = clusterPages.filter((c) => c.slug !== content.slug);

  return (
    <>
      <Breadcrumb items={[{ label: content.heroTitle, href: url }]} />

      <PageHero
        image={content.heroImage}
        imageAlt={content.heroAlt}
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        description={content.heroDescription}
      >
        <CtaGroup
          location="hero"
          whatsappMessage={`Merhaba, ${content.heroTitle.toLowerCase()} hakkında değerlendirme talep etmek istiyorum.`}
        />
      </PageHero>

      <TrustStrip />

      {/* Intro — naturally covers the "alan / alım yapan yerler / alan firmalar" phrasing */}
      <Section tone="cream">
        <div className="max-w-[760px] space-y-4">
          {content.intro.map((p, i) => (
            <p key={i} className="text-[16px] leading-relaxed text-ink-secondary">
              {p}
            </p>
          ))}
        </div>
      </Section>

      {/* Definitions (pert only) */}
      {content.definitions && content.definitions.length > 0 && (
        <Section tone="white">
          <SectionHeading eyebrow="Tanımlar" title="Hangi Durum Hangi Kategoriye Girer?" align="left" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {content.definitions.map((d) => (
              <div key={d.term} className="rounded-[14px] border border-line bg-cream-50 p-5">
                <h3 className="text-[15px] font-bold text-ink">{d.term}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-secondary">{d.body}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Phrasing-variant H2 sections */}
      <Section tone={content.definitions ? "cream" : "white"}>
        <div className="space-y-10">
          {content.variantSections.map((v) => (
            <div key={v.h2} className="max-w-[760px]">
              <h2 className="text-xl font-bold text-ink md:text-2xl">{v.h2}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-secondary">{v.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Real process prerequisite (hurda / pert) */}
      {content.processFact && (
        <Section tone="alt">
          <div className="mx-auto flex max-w-[760px] gap-4 rounded-[14px] border border-line bg-white p-5">
            <Info size={20} className="mt-0.5 shrink-0 text-burgundy-700" />
            <p className="text-[15px] leading-relaxed text-ink-secondary">{content.processFact}</p>
          </div>
        </Section>
      )}

      <HowItWorks />

      {/* FAQ */}
      <Section tone="cream">
        <SectionHeading eyebrow="Sık Sorulan Sorular" title={`${content.shortTitle} Hakkında Sorular`} />
        <div className="mt-10">
          <FaqAccordion items={content.faqs} />
        </div>
        <JsonLd data={faqPageLd(content.faqs)} />
      </Section>

      {/* Related condition pages + siblings + hub — keeps every cluster page linked in. */}
      <Section tone="white">
        <SectionHeading eyebrow="İlgili İçerikler" title="Daha Fazla Bilgi" align="left" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.relatedConditionSlugs.map((slug) => {
            const service = getService(slug);
            if (!service) return null;
            return (
              <Link
                key={slug}
                href={routes.service(slug)}
                className="group flex items-center gap-3 rounded-[14px] border border-line bg-cream-50 p-4 transition-colors hover:border-burgundy-700"
              >
                <ListChecks size={18} className="shrink-0 text-burgundy-700" />
                <span className="text-[15px] font-semibold text-ink">{service.title}</span>
              </Link>
            );
          })}
          {siblings.map((s) => (
            <Link
              key={s.slug}
              href={routes[s.routeKey]}
              className="group flex items-center gap-3 rounded-[14px] border border-line bg-cream-50 p-4 transition-colors hover:border-burgundy-700"
            >
              <ListChecks size={18} className="shrink-0 text-burgundy-700" />
              <span className="text-[15px] font-semibold text-ink">{s.shortTitle}</span>
            </Link>
          ))}
          <Link
            href={routes.serviceAreas}
            className="group flex items-center gap-3 rounded-[14px] border border-line bg-cream-50 p-4 transition-colors hover:border-burgundy-700"
          >
            <ListChecks size={18} className="shrink-0 text-burgundy-700" />
            <span className="text-[15px] font-semibold text-ink">Tüm Hizmet Bölgeleri</span>
          </Link>
        </div>
      </Section>

      <QuoteSection
        source={`cluster:${content.slug}`}
        title={`${content.shortTitle} İçin Ücretsiz Teklif Alın`}
        tone="cream"
      />

      <FinalCta />

      <JsonLd
        data={serviceLd({
          name: content.heroTitle,
          description: content.heroDescription,
          url,
        })}
      />
    </>
  );
}
