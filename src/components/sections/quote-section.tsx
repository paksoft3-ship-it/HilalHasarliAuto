import { ShieldCheck, Lock, MapPin } from "lucide-react";
import { Section } from "@/components/ui/section";
import { QuickOfferForm } from "@/components/forms/quick-offer-form";

const trust = [
  { icon: ShieldCheck, text: "Ücretsiz değerlendirme, bağlayıcı değil" },
  { icon: Lock, text: "Bilgileriniz gizli ve güvenli tutulur" },
  { icon: MapPin, text: "Türkiye geneli başvuru kabul edilir" },
];

/**
 * Standalone "Teklif Al" section — intro + trust on the left, quick-offer form
 * card on the right. Reused on the homepage and service/city pages instead of
 * a form embedded in the hero.
 */
export function QuoteSection({
  source,
  title = "Aracınız İçin Ücretsiz Teklif Alın",
  subtitle = "Birkaç bilgiyle değerlendirme talebi oluşturun. Uzman ekibimiz en kısa sürede sizinle iletişime geçer.",
  tone = "alt",
}: {
  source: string;
  title?: string;
  subtitle?: string;
  tone?: "cream" | "white" | "alt";
}) {
  return (
    <Section tone={tone} id="teklif-al">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
        <div>
          <p className="eyebrow mb-3">Ücretsiz Değerlendirme</p>
          <h2 className="text-[28px] font-bold leading-tight text-ink md:text-[34px]">
            {title}
          </h2>
          <p className="mt-4 max-w-[520px] text-[16px] leading-relaxed text-ink-secondary">
            {subtitle}
          </p>
          <ul className="mt-6 space-y-3">
            {trust.map((t) => (
              <li key={t.text} className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-burgundy-700">
                  <t.icon size={18} />
                </span>
                <span className="text-[15px] text-ink-secondary">{t.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[18px] border border-line bg-white p-6 shadow-[0_18px_50px_rgba(22,27,31,0.10)] md:p-7">
          <QuickOfferForm source={source} />
        </div>
      </div>
    </Section>
  );
}
