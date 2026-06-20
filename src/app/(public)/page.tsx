import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/navigation";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaGroup } from "@/components/sections/cta-buttons";
import { TrustStrip } from "@/components/sections/trust-strip";
import { CategoryGrid } from "@/components/sections/category-grid";
import { HowItWorks } from "@/components/sections/how-it-works";
import { WhyUs } from "@/components/sections/why-us";
import { Testimonials } from "@/components/sections/testimonials";
import { ServiceAreas } from "@/components/sections/service-areas";
import { FinalCta } from "@/components/sections/final-cta";
import { QuoteSection } from "@/components/sections/quote-section";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { JsonLd } from "@/components/ui/json-ld";
import { homepageFaqs } from "@/config/faq";
import { organizationLd, websiteLd, faqPageLd } from "@/lib/seo/jsonld";

const homeDescription =
  "Hasarlı, kazalı, pert, ağır hasarlı, motor/mekanik arızalı, çalışmayan, yanmış, sel hasarlı, hurda ve çekme belgeli araçlarınız için Türkiye geneli ücretsiz ve hızlı değerlendirme. Fotoğraf gönderin, teklifinizi alın.";

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.brandName} — Hasarlı, Kazalı ve Hurda Araç Alımı` },
  description: homeDescription,
  alternates: { canonical: routes.home },
  openGraph: {
    title: `${siteConfig.brandName} — Hasarlı, Kazalı ve Hurda Araç Alımı`,
    description: homeDescription,
    url: routes.home,
    type: "website",
  },
};

const heroTrust = [
  "Ücretsiz değerlendirme",
  "Türkiye geneli alım",
  "Güvenli ödeme",
  "Noter destekli işlem",
];

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-cream-50">
      {/* Mobile hero image: cars at bottom, blur at top */}
      <Image
        src="/images/heroes/mobile/2.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-bottom md:hidden"
      />
      {/* Desktop hero image: cars right, blur left */}
      <Image
        src="/images/heroes/2.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 hidden object-cover object-right md:block"
      />
      {/* Mobile overlay (top → bottom) */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cream-50 via-cream-50/90 to-cream-50/40 md:hidden" />
      {/* Desktop overlay (left → right) */}
      <div className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-cream-50 via-cream-50/85 to-cream-50/20 md:block lg:to-transparent" />

      <div className="container-page py-12 md:py-16 lg:py-20">
        <div className="max-w-xl">
          <p className="eyebrow mb-4">Türkiye Geneli Araç Alım Hizmeti</p>
          <h1 className="text-[34px] font-bold leading-[1.08] text-ink md:text-[48px] lg:text-[54px]">
            Hasarlı Aracınız İçin{" "}
            <span className="text-burgundy-700">Anında Nakit Teklif.</span>
          </h1>
          <p className="mt-5 max-w-[520px] text-[16px] leading-relaxed text-ink-secondary md:text-[18px]">
            Kazalı, pert, ağır hasarlı, arızalı, yanmış, sel hasarlı ve hurda
            araçlarınızı bulunduğunuz yerden değerlendiriyor; güvenli satın alma
            ve ödeme süreci sunuyoruz.
          </p>

          <CtaGroup className="mt-7" />

          <ul className="mt-7 grid max-w-md grid-cols-2 gap-x-6 gap-y-3">
            {heroTrust.map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm font-medium text-ink">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-success-surface text-success">
                  <Check size={13} strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}


export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoryGrid />
      <QuoteSection source="homepage_hero" />
      <HowItWorks />
      <WhyUs />
      <Testimonials />
      <ServiceAreas />
      <Section tone="alt">
        <SectionHeading
          eyebrow="Sık Sorulan Sorular"
          title="Merak Edilenler"
          intro="Araç satış süreci hakkında en çok sorulan sorular."
        />
        <div className="mt-10">
          <FaqAccordion items={homepageFaqs} />
        </div>
      </Section>
      <FinalCta />
      <JsonLd data={[organizationLd(), websiteLd(), faqPageLd(homepageFaqs)]} />
    </>
  );
}
