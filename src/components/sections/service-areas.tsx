import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { featuredCities } from "@/config/cities";
import { routes } from "@/config/navigation";
import { buttonClasses } from "@/components/ui/button";

export function ServiceAreas() {
  return (
    <Section tone="white">
      <SectionHeading
        eyebrow="Hizmet Bölgeleri"
        title="Türkiye Genelinde Hizmetinizdeyiz"
        intro="Konum ve araç durumuna göre hizmet planlaması yapılır. Şehrinizi seçerek başlayın."
      />
      <ul className="mx-auto mt-9 flex max-w-3xl flex-wrap justify-center gap-2.5">
        {featuredCities.map((c) => (
          <li key={c.slug}>
            <Link
              href={routes.city(c.slug)}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream-50 px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-burgundy-700 hover:text-burgundy-700"
            >
              <MapPin size={14} className="text-gold-600" />
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8 text-center">
        <Link
          href={routes.serviceAreas}
          className={buttonClasses({ variant: "outline", size: "md" })}
        >
          Tüm Hizmet Bölgeleri
          <ArrowRight size={16} />
        </Link>
      </div>
    </Section>
  );
}
