import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, Clock, ShieldAlert } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { routes } from "@/config/navigation";
import { getPublicSettings } from "@/lib/settings/server";
import { telHref, whatsappHref } from "@/lib/settings/shared";
import { Section, SectionHeading } from "@/components/ui/section";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHero } from "@/components/ui/page-hero";
import { buttonClasses } from "@/components/ui/button";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "İletişim | Hemen Teklif Alın",
  description:
    "Hasarlı, kazalı, pert ve hurda aracınız için bize ulaşın. Telefon veya WhatsApp ile 30 dakikada ücretsiz teklif. Türkiye geneli hizmet.",
  keywords:
    "hasarlı araç alan iletişim, araç satmak için iletişim, teklif al",
  alternates: { canonical: routes.contact },
};

export default async function ContactPage() {
  const settings = await getPublicSettings();
  const methods = [
    { icon: Phone, label: "Telefon", value: settings.phoneDisplay, href: telHref(settings), tone: "text-burgundy-700", track: "phone_click" },
    { icon: WhatsAppIcon, label: "WhatsApp", value: "Fotoğraf gönderin", href: whatsappHref(settings), tone: "text-whatsapp", external: true, track: "whatsapp_click" },
    { icon: Mail, label: "E-posta", value: settings.email, href: `mailto:${settings.email}`, tone: "text-burgundy-700", track: undefined },
  ];
  return (
    <>
      <Breadcrumb items={[{ label: "İletişim", href: routes.contact }]} />

      <PageHero
        image="/images/heroes/1.png"
        eyebrow="Bize Ulaşın"
        title="Aracınızı Birlikte Değerlendirelim"
        description="Aracınız veya süreç hakkında her türlü sorunuz için aşağıdaki kanallardan bize ulaşabilirsiniz."
      />

      {/* Contact method cards */}
      <Section tone="white" className="!pb-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {methods.map((m) => (
            <a
              key={m.label}
              href={m.href}
              {...(m.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              {...(m.track ? { "data-track": m.track, "data-track-location": "contact_page" } : {})}
              className="flex items-center gap-4 rounded-[14px] border border-line bg-cream-50 p-5 transition-colors hover:border-burgundy-700"
            >
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-[12px] bg-white ${m.tone}`}>
                <m.icon size={24} />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-ink">{m.label}</span>
                <span className="text-[13px] text-ink-muted">{m.value}</span>
              </span>
            </a>
          ))}
          <div className="flex items-center gap-4 rounded-[14px] border border-line bg-cream-50 p-5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[12px] bg-white text-gold-700">
              <Clock size={24} />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-semibold text-ink">Çalışma Saatleri</span>
              <span className="text-[13px] text-ink-muted">{settings.workingHours}</span>
            </span>
          </div>
        </div>
      </Section>

      {/* Form + side panel */}
      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading title="Bize Mesaj Gönderin" align="left" />
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-[18px] border border-line bg-cream-50 p-6">
              <h2 className="text-lg font-bold text-ink">Aracınız İçin Teklif</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-secondary">
                Doğrudan değerlendirme talebi oluşturmak isterseniz teklif
                formunu kullanabilirsiniz.
              </p>
              <Link
                href={routes.getOffer}
                className={buttonClasses({ variant: "primary", fullWidth: true, className: "mt-4" })}
              >
                Hemen Teklif Al
              </Link>
            </div>

            <div className="mt-5 flex gap-3 rounded-[14px] border border-warning/30 bg-warning-surface p-5">
              <ShieldAlert size={20} className="mt-0.5 shrink-0 text-warning" />
              <p className="text-[13px] leading-relaxed text-ink-secondary">
                Güvenliğiniz için lütfen yalnızca bu sayfadaki resmi iletişim
                kanallarını kullanın. Ödeme ve devir işlemleri yalnızca resmi
                süreçle yürütülür.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
