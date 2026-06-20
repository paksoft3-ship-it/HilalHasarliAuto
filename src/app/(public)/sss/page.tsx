import type { Metadata } from "next";
import Link from "next/link";
import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { routes } from "@/config/navigation";
import { faqCategories } from "@/config/faq";
import { getPublicSettings } from "@/lib/settings/server";
import { telHref, whatsappHref } from "@/lib/settings/shared";
import { Section } from "@/components/ui/section";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHero } from "@/components/ui/page-hero";
import { JsonLd } from "@/components/ui/json-ld";
import { buttonClasses } from "@/components/ui/button";
import { FaqSearch } from "@/components/forms/faq-search";
import { FinalCta } from "@/components/sections/final-cta";
import { faqPageLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Sık Sorulan Sorular",
  description:
    "Araç satış süreci, teklif ve değerlendirme, fotoğraf gönderme, noter, ödeme ve teslim hakkında sık sorulan sorular.",
  alternates: { canonical: routes.faq },
};

const allFaqs = faqCategories.flatMap((c) => c.items);

export default async function FaqPage() {
  const settings = await getPublicSettings();
  return (
    <>
      <Breadcrumb items={[{ label: "Sık Sorulan Sorular", href: routes.faq }]} />

      <PageHero
        image="/images/heroes/4.png"
        eyebrow="Merak Ettikleriniz"
        title="Araç Satış Süreci Hakkında Sık Sorulan Sorular"
        description="Aradığınız cevabı bulamazsanız bizimle telefon veya WhatsApp üzerinden iletişime geçebilirsiniz."
      />

      <Section tone="white">
        <FaqSearch categories={faqCategories} />
      </Section>

      {/* Contact panel */}
      <Section tone="cream">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-[18px] border border-line bg-white p-8 text-center">
          <h2 className="text-xl font-bold text-ink">Cevabınızı Bulamadınız mı?</h2>
          <p className="max-w-md text-[15px] leading-relaxed text-ink-secondary">
            Uzman ekibimiz aracınızla ilgili sorularınızı yanıtlamaktan
            memnuniyet duyar.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappHref(settings)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({ variant: "whatsapp" })}
            >
              <WhatsAppIcon size={18} />
              WhatsApp’tan Yazın
            </a>
            <a href={telHref(settings)} className={buttonClasses({ variant: "dark" })}>
              <Phone size={18} />
              {settings.phoneDisplay}
            </a>
            <Link href={routes.contact} className={buttonClasses({ variant: "outline" })}>
              İletişim Sayfası
            </Link>
          </div>
        </div>
      </Section>

      <FinalCta />
      <JsonLd data={faqPageLd(allFaqs)} />
    </>
  );
}
