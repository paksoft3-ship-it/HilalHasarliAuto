import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Phone, Home } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { Section } from "@/components/ui/section";
import { buttonClasses } from "@/components/ui/button";
import { routes } from "@/config/navigation";
import { getPublicSettings } from "@/lib/settings/server";
import { telHref, whatsappHref } from "@/lib/settings/shared";

// Thank-you pages must not be indexed (master prompt §10 sitemap exclusions).
export const metadata: Metadata = {
  title: "Talebiniz Alındı",
  robots: { index: false, follow: false },
};

const nextSteps = [
  "Bilgileriniz ve fotoğraflarınız incelenir.",
  "Gerekirse ek bilgi veya fotoğraf talep edilebilir.",
  "Değerlendirme sonrası uzman ekibimiz sizinle iletişime geçer.",
];

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const settings = await getPublicSettings();

  return (
    <Section tone="cream" className="min-h-[60vh]">
      <div className="mx-auto max-w-2xl rounded-[18px] border border-line bg-white p-7 text-center md:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success-surface text-success">
          <CheckCircle2 size={36} />
        </div>
        <p className="eyebrow mt-6 justify-center">Talebiniz Alındı</p>
        <h1 className="mt-2 text-[28px] font-bold text-ink md:text-[34px]">
          Talebiniz Bize Ulaştı
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-secondary">
          Aracınız için değerlendirme talebiniz alınmıştır. Aşağıdaki adımları
          inceleyebilir, dilerseniz WhatsApp veya telefon ile de iletişime
          geçebilirsiniz.
        </p>

        {ref && (
          <div className="mx-auto mt-6 inline-flex flex-col items-center rounded-[12px] border border-line bg-cream-50 px-6 py-3">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
              Başvuru Numaranız
            </span>
            <span className="mt-1 font-mono text-lg font-bold text-burgundy-700">
              {ref}
            </span>
          </div>
        )}

        <ol className="mx-auto mt-8 max-w-md space-y-3 text-left">
          {nextSteps.map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-burgundy-700 text-xs font-bold text-white">
                {i + 1}
              </span>
              <span className="text-[15px] text-ink-secondary">{s}</span>
            </li>
          ))}
        </ol>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={whatsappHref(
              settings,
              ref
                ? `Merhaba, ${ref} numaralı başvurum hakkında bilgi vermek istiyorum.`
                : undefined,
            )}
            target="_blank"
            rel="noopener noreferrer"
            data-track="whatsapp_click"
            data-track-location="thank_you"
            className={buttonClasses({ variant: "whatsapp" })}
          >
            <WhatsAppIcon size={18} />
            WhatsApp’tan Yazın
          </a>
          <a href={telHref(settings)} data-track="phone_click" data-track-location="thank_you" className={buttonClasses({ variant: "dark" })}>
            <Phone size={18} />
            {settings.phoneDisplay}
          </a>
          <Link href={routes.home} className={buttonClasses({ variant: "outline" })}>
            <Home size={18} />
            Ana Sayfaya Dön
          </Link>
        </div>

        <p className="mt-8 text-xs leading-relaxed text-ink-muted">
          Güvenliğiniz için lütfen yalnızca resmi iletişim kanallarımızı
          kullanın. Bilgileriniz yalnızca aracınızın değerlendirilmesi amacıyla
          işlenir.
        </p>
      </div>
    </Section>
  );
}
