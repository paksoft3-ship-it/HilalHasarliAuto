import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { services, serviceIconImage } from "@/config/services";
import { routes } from "@/config/navigation";
import { Section, SectionHeading } from "@/components/ui/section";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHero } from "@/components/ui/page-hero";
import { buttonClasses } from "@/components/ui/button";
import { CtaGroup } from "@/components/sections/cta-buttons";
import { TrustStrip } from "@/components/sections/trust-strip";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FinalCta } from "@/components/sections/final-cta";

export const metadata: Metadata = {
  title: "Araç Alımı",
  description:
    "Hasarlı, kazalı, pert, arızalı, çalışmayan, hurda ve çekme belgeli araç alımı. Aracınızın durumuna uygun kategoriyi seçin, hızlı ve şeffaf değerlendirme alın.",
  keywords:
    "araç alımı, hasarlı araç alımı, kazalı araç alımı, pert araç alımı, arızalı araç alımı, hurda araç alımı",
  // Consolidate ranking to the canonical overview to avoid duplicate content.
  alternates: { canonical: routes.vehiclesWeBuy },
};

export default function VehiclePurchaseHubPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Araç Alımı", href: "/arac-alimi" }]} />

      <PageHero
        image="/images/heroes/2.png"
        eyebrow="Araç Alımı"
        title="Her Durumdaki Araç İçin Alım Hizmeti"
        description="Hasarlı, kazalı, arızalı veya çalışmayan; aracınızın durumu ne olursa olsun değerlendiriyoruz. Aşağıdan kategorinizi seçerek sürece başlayın."
      >
        <CtaGroup location="hero" />
      </PageHero>

      <TrustStrip />

      {/* Service categories */}
      <Section tone="cream">
        <SectionHeading
          eyebrow="Araç Kategorileri"
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
                <p className="mt-1.5 flex-1 text-[14px] leading-relaxed text-ink-muted">{s.short}</p>
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

        <p className="mt-8 text-center text-[15px] text-ink-secondary">
          Tüm kategoriler ve değerlendirme kriterleri için{" "}
          <Link href={routes.vehiclesWeBuy} className="font-semibold text-burgundy-700 underline">
            Hangi Araçları Alıyoruz?
          </Link>{" "}
          sayfasına göz atın.
        </p>
      </Section>

      <HowItWorks />
      <FinalCta />
    </>
  );
}
