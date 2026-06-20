import { FileText, SearchCheck, Banknote } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";

const steps = [
  {
    icon: FileText,
    title: "Bilgilerinizi paylaşın",
    desc: "Araç bilgilerini ve güncel fotoğrafları form veya WhatsApp üzerinden iletin.",
  },
  {
    icon: SearchCheck,
    title: "Değerlendirme ve teklif alın",
    desc: "Uzman ekibimiz aracınızı değerlendirir ve size teklifimizi iletir.",
  },
  {
    icon: Banknote,
    title: "Noter, ödeme ve teslim",
    desc: "Anlaşma sonrası noter devri, ödeme ve teslim süreci güvenle planlanır.",
  },
];

export function HowItWorks() {
  return (
    <Section tone="white">
      <SectionHeading
        eyebrow="Nasıl Çalışır?"
        title="Aracınızı 3 Adımda Değerlendirin"
        intro="Süreç açık ve anlaşılırdır. Her adımda sizi bilgilendiririz."
      />
      <div className="relative mt-12 grid gap-6 md:grid-cols-3">
        {/* Connecting line on desktop */}
        <div className="absolute inset-x-[16%] top-9 hidden h-px bg-line md:block" />
        {steps.map((s, i) => (
          <div key={s.title} className="relative flex flex-col items-center text-center">
            <div className="relative grid h-[72px] w-[72px] place-items-center rounded-full border border-line bg-cream-50">
              <s.icon size={30} className="text-burgundy-700" strokeWidth={1.8} />
              <span className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-burgundy-700 text-sm font-bold text-white">
                {i + 1}
              </span>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-ink">{s.title}</h3>
            <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-ink-muted">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
