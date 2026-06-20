import type { Metadata } from "next";
import { ShieldCheck, Lock, MapPin, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { routes } from "@/config/navigation";
import { getPublicSettings } from "@/lib/settings/server";
import { telHref, whatsappHref } from "@/lib/settings/shared";
import { Section } from "@/components/ui/section";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHero } from "@/components/ui/page-hero";
import { buttonClasses } from "@/components/ui/button";
import { FullQuoteForm } from "@/components/forms/full-quote-form";

export const metadata: Metadata = {
  title: "Teklif Al — Ücretsiz Araç Değerlendirmesi",
  description:
    "Aracınızın bilgilerini, durumunu ve fotoğraflarını paylaşarak ücretsiz değerlendirme talebi oluşturun. Teklif almak bağlayıcı değildir.",
  alternates: { canonical: routes.getOffer },
};

const trust = [
  { icon: ShieldCheck, text: "Ücretsiz değerlendirme, bağlayıcı değil" },
  { icon: Lock, text: "Bilgileriniz gizli ve güvenli tutulur" },
  { icon: MapPin, text: "Türkiye geneli başvuru kabul edilir" },
];

export default async function GetOfferPage() {
  const settings = await getPublicSettings();
  return (
    <>
      <Breadcrumb items={[{ label: "Teklif Al", href: routes.getOffer }]} />

      <PageHero
        image="/images/heroes/4.png"
        size="sm"
        eyebrow="Ücretsiz Araç Değerlendirmesi"
        title="Aracınız İçin Değerlendirme Talebi Oluşturun"
        description="Araç, hasar, konum ve iletişim bilgilerinizi adım adım paylaşın. Bilgileriniz yalnızca değerlendirme amacıyla kullanılır."
      />

      <Section tone="white">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-[18px] border border-line bg-white p-5 shadow-[0_18px_50px_rgba(22,27,31,0.08)] md:p-8">
              <FullQuoteForm />
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-5">
              <div className="rounded-[18px] border border-line bg-cream-50 p-6">
                <h2 className="text-base font-bold text-ink">Neden Güvenle Başvurabilirsiniz?</h2>
                <ul className="mt-4 space-y-3">
                  {trust.map((t) => (
                    <li key={t.text} className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-burgundy-700">
                        <t.icon size={17} />
                      </span>
                      <span className="text-[14px] leading-relaxed text-ink-secondary">{t.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[18px] border border-line bg-charcoal-950 p-6 text-white">
                <h2 className="text-base font-bold">Hemen Konuşmak İster misiniz?</h2>
                <p className="mt-2 text-sm text-white/65">
                  Formu doldurmadan da bize ulaşabilirsiniz.
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  <a href={whatsappHref(settings)} target="_blank" rel="noopener noreferrer" className={buttonClasses({ variant: "whatsapp", fullWidth: true })}>
                    <WhatsAppIcon size={18} /> WhatsApp’tan Yazın
                  </a>
                  <a href={telHref(settings)} className={buttonClasses({ variant: "outline", fullWidth: true })}>
                    <Phone size={18} /> {settings.phoneDisplay}
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
