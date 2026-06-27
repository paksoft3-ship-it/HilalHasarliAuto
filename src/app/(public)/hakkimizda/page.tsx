import type { Metadata } from "next";
import { ShieldCheck, Eye, Zap, BadgeCheck, Scale } from "lucide-react";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/navigation";
import { Section, SectionHeading } from "@/components/ui/section";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHero } from "@/components/ui/page-hero";
import { IconList } from "@/components/ui/icon-list";
import { CtaGroup } from "@/components/sections/cta-buttons";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FinalCta } from "@/components/sections/final-cta";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Hasarlı, kazalı, pert ve hurda araç alımında güvenilir çözüm ortağınız. Şeffaf değerlendirme, en yüksek fiyat, ücretsiz çekici ve anında nakit ödeme.",
  keywords:
    "hasarlı araç alan firma, güvenilir araç alımı, hasarlı araç alım merkezi",
  alternates: { canonical: routes.about },
};

const values = [
  { icon: ShieldCheck, title: "Güven", desc: "Kayıtlı ve resmi süreç; baskısız iletişim." },
  { icon: Eye, title: "Şeffaflık", desc: "Değerlendirme ve teklif adımlarını açıkça paylaşırız." },
  { icon: Zap, title: "Hızlı iletişim", desc: "Talebiniz ulaştığında en kısa sürede dönüş yapılır." },
  { icon: BadgeCheck, title: "Profesyonellik", desc: "Her aracı durumuna göre uzmanca değerlendiririz." },
  { icon: Scale, title: "Adil değerlendirme", desc: "Aracın gerçek durumuna dayalı gerçekçi değerleme." },
];

export default function AboutPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Hakkımızda", href: routes.about }]} />

      <PageHero
        image="/images/heroes/7.png"
        eyebrow="Profesyonel Araç Değerlendirme"
        title={`${siteConfig.brandName} Hakkında`}
        description="Hasarlı, kazalı, arızalı ve çalışmayan araçların sahipleri için karmaşık bir süreci basitleştiriyoruz. Aracınızı birlikte değerlendirir; güvenli, şeffaf ve anlaşılır bir satın alma süreci sunarız."
      >
        <CtaGroup location="hero" />
      </PageHero>

      {/* Who we are / what we do */}
      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading title="Biz Kimiz?" align="left" />
            <p className="mt-4 text-[16px] leading-relaxed text-ink-secondary">
              {siteConfig.brandName}, problemli araçların değerlendirilmesi ve
              satın alınması konusunda araç sahiplerine yardımcı olur. Aracınızın
              durumu ne olursa olsun, paylaştığınız bilgilere göre gerçekçi bir
              değerlendirme yapar; devir, ödeme ve teslim adımlarını birlikte
              planlarız.
            </p>
          </div>
          <div>
            <SectionHeading title="Ne Yapıyoruz?" align="left" />
            <IconList
              className="mt-4"
              items={[
                "Araç durumuna özel değerlendirme",
                "Satın alma sürecinde açık iletişim",
                "Noter, ödeme ve teslim planlaması",
                "Türkiye geneli başvuru kabulü",
              ]}
            />
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section tone="charcoal">
        <SectionHeading
          eyebrow="Yaklaşımımız"
          title="Çalışma Değerlerimiz"
          tone="light"
        />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="flex gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[12px] border border-white/12 text-gold-600">
                <v.icon size={24} strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="text-base font-semibold text-white">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/65">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <HowItWorks />

      {/* Verified company info — placeholders, only shows real data */}
      <Section tone="cream">
        <div className="mx-auto max-w-2xl rounded-[18px] border border-line bg-white p-7 md:p-9">
          <SectionHeading title="Kurumsal Bilgiler" align="left" />
          <p className="mt-3 text-sm text-ink-muted">
            Yalnızca doğrulanmış kurumsal bilgiler yayımlanır. Aşağıdaki alanlar
            resmi bilgiler tamamlandığında güncellenecektir.
          </p>
          <dl className="mt-6 divide-y divide-line text-[15px]">
            {[
              ["Şirket Ünvanı", siteConfig.legalCompanyName],
              ["Adres", siteConfig.companyAddress],
              ["Telefon", siteConfig.phoneDisplay],
              ["E-posta", siteConfig.email],
              ["Çalışma Saatleri", siteConfig.workingHours],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
                <dt className="font-medium text-ink">{k}</dt>
                <dd className="text-ink-secondary">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
