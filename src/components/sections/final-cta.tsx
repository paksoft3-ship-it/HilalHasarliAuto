import { Section } from "@/components/ui/section";
import { CtaGroup } from "./cta-buttons";

export function FinalCta({
  title = "Aracınızın Değerini Öğrenmeye Hazır mısınız?",
  subtitle = "Bilgilerinizi paylaşın, uzman ekibimiz sizi en kısa sürede arasın. Teklif almak ücretsizdir.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <Section tone="cream" className="pb-16 md:pb-20">
      <div className="overflow-hidden rounded-[18px] bg-charcoal-950 px-6 py-12 text-center md:px-12 md:py-16">
        <h2 className="mx-auto max-w-2xl text-[26px] font-bold leading-tight text-white md:text-[34px]">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/70 md:text-base">
          {subtitle}
        </p>
        <div className="mt-8 flex justify-center">
          <CtaGroup size="lg" showPhone className="justify-center" />
        </div>
      </div>
    </Section>
  );
}
