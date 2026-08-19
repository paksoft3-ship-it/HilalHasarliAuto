import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { featuredCities, cities } from "@/config/cities";
import { districts } from "@/config/districts";
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
      {/* District links.
          The homepage carries the most authority on the site and was passing
          none of it to district pages — it linked 12 cities and 0 districts,
          leaving every district three clicks deep. These are grouped under
          their city so the block reads as real navigation rather than a link
          dump, and so the city→district relationship is explicit to crawlers. */}
      <div className="mx-auto mt-10 max-w-3xl border-t border-line pt-8">
        <p className="text-center text-sm font-medium text-ink/70">
          Yoğun hizmet verdiğimiz ilçeler
        </p>
        <div className="mt-5 flex flex-col gap-3.5">
          {featuredCities
            .map((city) => ({
              city,
              list: districts.filter((d) => d.citySlug === city.slug),
            }))
            .filter(({ list }) => list.length > 0)
            .map(({ city, list }) => (
              <div
                key={city.slug}
                className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 text-sm"
              >
                <Link
                  href={routes.city(city.slug)}
                  className="font-semibold text-ink hover:text-burgundy-700"
                >
                  {city.name}
                </Link>
                <span className="text-ink/30">·</span>
                {list.map((d, i) => (
                  <span key={d.slug} className="flex items-baseline gap-2">
                    <Link
                      href={routes.district(d.citySlug, d.slug)}
                      className="text-ink/65 underline-offset-4 hover:text-burgundy-700 hover:underline"
                    >
                      {d.name}
                    </Link>
                    {i < list.length - 1 ? <span className="text-ink/25">·</span> : null}
                  </span>
                ))}
              </div>
            ))}
        </div>
      </div>

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
