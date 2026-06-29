import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, HelpCircle, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { services, serviceIconImage } from "@/config/services";
import { routes } from "@/config/navigation";
import { getPublicSettings } from "@/lib/settings/server";
import { telHref, whatsappHref } from "@/lib/settings/shared";
import { DEFAULT_EVALUATED } from "@/config/service-content";
import { Section, SectionHeading } from "@/components/ui/section";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHero } from "@/components/ui/page-hero";
import { IconList } from "@/components/ui/icon-list";
import { buttonClasses } from "@/components/ui/button";
import { CtaGroup } from "@/components/sections/cta-buttons";
import { TrustStrip } from "@/components/sections/trust-strip";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FinalCta } from "@/components/sections/final-cta";

export const metadata: Metadata = {
  title: "Hangi Araçları Alıyoruz?",
  description:
    "Hasarlı, kazalı, pert, ağır hasarlı, motor ve mekanik arızalı, çalışmayan, yanmış, sel hasarlı, hurda ve çekme belgeli araçları alıyoruz.",
  keywords:
    "hasarlı araç alan, kazalı araç alan, pert araç alan, hurda araç alan, arızalı araç alan",
  alternates: { canonical: routes.vehiclesWeBuy },
};

export default async function VehiclesWeBuyPage() {
  const settings = await getPublicSettings();
  return (
    <>
      <Breadcrumb items={[{ label: "Hangi Araçları Alıyoruz?", href: routes.vehiclesWeBuy }]} />

      <PageHero
        image="/images/heroes/3.png"
        eyebrow="Araç Türüne Göre Değerlendirme"
        title="Farklı Durumdaki Araçlar İçin Değerlendirme"
        description="Aracınızın durumu ne olursa olsun değerini profesyonelce belirliyoruz. Aşağıdan kategorinizi seçerek sürece başlayın."
      >
        <CtaGroup location="hero" />
      </PageHero>

      <TrustStrip />

      {/* All services grid */}
      <Section tone="cream">
        <SectionHeading
          eyebrow="Hizmetlerimiz"
          title="Hangi Araçları Alıyoruz?"
          intro="Aşağıdaki tüm araç durumları için değerlendirme talebi oluşturabilirsiniz."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.slug}
              className="flex flex-col overflow-hidden rounded-[14px] border border-line bg-white"
            >
              <div className="relative aspect-[16/10] w-full border-b border-line bg-gradient-to-b from-cream-100 to-cream-50">
                <Image
                  src={serviceIconImage(s.slug)}
                  alt={s.name}
                  fill
                  sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 360px"
                  className="object-contain p-3"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-semibold text-ink">{s.title}</h3>
                <p className="mt-1.5 flex-1 text-[14px] leading-relaxed text-ink-muted">
                  {s.short}
                </p>
                <div className="mt-4">
                  <Link
                    href={routes.service(s.slug)}
                    className={buttonClasses({ variant: "outline", size: "sm" })}
                  >
                    Hizmeti İncele
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Helper panel */}
      <Section tone="white">
        <div className="flex flex-col items-start gap-6 rounded-[18px] border border-line bg-cream-50 p-7 md:flex-row md:items-center md:justify-between md:p-9">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[12px] bg-burgundy-700 text-white">
              <HelpCircle size={24} />
            </span>
            <div>
              <h2 className="text-xl font-bold text-ink">
                Aracınızın Kategorisinden Emin Değil misiniz?
              </h2>
              <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-ink-secondary">
                Aracınız listede olmasa da değerlendirebiliriz. Fotoğraf gönderin,
                uygun süreç birlikte belirlensin.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <a
              href={whatsappHref(settings, "Merhaba, aracımın durumu için yardım almak istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              data-track="whatsapp_click"
              data-track-location="vehicles_page"
              className={buttonClasses({ variant: "whatsapp" })}
            >
              <WhatsAppIcon size={18} />
              WhatsApp’tan Sorun
            </a>
            <a href={telHref(settings)} data-track="phone_click" data-track-location="hangi_araclar" className={buttonClasses({ variant: "primary" })}>
              <Phone size={18} />
              Hemen Ara
            </a>
          </div>
        </div>
      </Section>

      {/* Evaluation criteria */}
      <Section tone="cream">
        <div className="max-w-[760px]">
          <SectionHeading
            eyebrow="Değerlendirme Kriterleri"
            title="Aracınız Neye Göre Değerlendirilir?"
            align="left"
          />
          <IconList items={DEFAULT_EVALUATED} columns className="mt-6" />
        </div>
      </Section>

      <HowItWorks />
      <FinalCta />
    </>
  );
}
