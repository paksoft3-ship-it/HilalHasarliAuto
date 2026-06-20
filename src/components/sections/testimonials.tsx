import { Star } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";

/**
 * Editable SAMPLE testimonials only (master prompt: never invent real reviews).
 * Replace with verified, consented testimonials via the CMS before launch.
 */
const sampleTestimonials = [
  {
    quote:
      "Kazada ağır hasar gören aracım için hızlıca dönüş aldım. Süreç baştan sona açık şekilde anlatıldı.",
    name: "M. A.",
    city: "İstanbul",
  },
  {
    quote:
      "Çalışmayan aracımı nasıl satacağımı bilmiyordum. Fotoğraf gönderdim, değerlendirme ve devir kısmında yardımcı oldular.",
    name: "S. K.",
    city: "Ankara",
  },
  {
    quote:
      "Noter ve ödeme adımları net planlandı. İletişim boyunca herhangi bir baskı hissetmedim.",
    name: "E. T.",
    city: "İzmir",
  },
];

export function Testimonials() {
  return (
    <Section tone="cream">
      <SectionHeading
        eyebrow="Deneyimler"
        title="Araç Sahipleri Ne Diyor?"
        intro="Aşağıdaki yorumlar örnek niteliğindedir."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {sampleTestimonials.map((t) => (
          <figure
            key={t.name}
            className="flex flex-col rounded-[14px] border border-line bg-white p-6"
          >
            <div className="flex gap-0.5 text-gold-600" aria-label="5 üzerinden 5 yıldız">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-secondary">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-5 text-sm font-semibold text-ink">
              {t.name}
              <span className="font-normal text-ink-muted"> · {t.city}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
