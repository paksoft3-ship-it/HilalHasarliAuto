import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { featuredServices, serviceIconImage } from "@/config/services";
import { routes } from "@/config/navigation";

export function CategoryGrid() {
  return (
    <Section tone="cream">
      <SectionHeading
        eyebrow="Hangi Araçları Alıyoruz?"
        title="Her Türlü Hasarlı Aracı Değerlendiriyoruz"
        intro="Aracınızın durumu ne olursa olsun değerini profesyonelce belirliyoruz. Kategorinizi seçin, sürece hemen başlayın."
      />
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {featuredServices.map((s) => (
          <Link
            key={s.slug}
            href={routes.service(s.slug)}
            className="group flex flex-col overflow-hidden rounded-[14px] border border-line bg-white transition-all hover:border-burgundy-700 hover:shadow-[0_12px_30px_rgba(22,27,31,0.08)]"
          >
            {/* Cut-out car fills the image area (minimal padding) */}
            <div className="relative aspect-[16/10] w-full border-b border-line bg-gradient-to-b from-cream-100 to-cream-50">
              <Image
                src={serviceIconImage(s.slug)}
                alt={s.name}
                fill
                sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 320px"
                className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.05]"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-[15px] font-semibold text-ink">{s.name}</h3>
              <p className="mt-1 line-clamp-2 flex-1 text-[13px] leading-snug text-ink-muted">
                {s.short}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-burgundy-700">
                Hizmeti İncele
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
