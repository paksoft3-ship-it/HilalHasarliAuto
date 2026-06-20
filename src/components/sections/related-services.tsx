import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { services, serviceIconImage } from "@/config/services";
import { routes } from "@/config/navigation";

/**
 * All vehicle services as cards (the current service excluded). Same card
 * design as before — just shows every option.
 */
export function RelatedServices({
  currentSlug,
  title = "İlgili Hizmetler",
}: {
  currentSlug?: string;
  title?: string;
}) {
  const items = services.filter((s) => s.slug !== currentSlug);
  if (items.length === 0) return null;

  return (
    <Section tone="white">
      <SectionHeading title={title} align="left" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <Link
            key={s.slug}
            href={routes.service(s.slug)}
            className="group flex items-center gap-4 rounded-[14px] border border-line bg-cream-50 p-4 transition-colors hover:border-burgundy-700"
          >
            <div className="relative h-14 w-24 shrink-0">
              <Image
                src={serviceIconImage(s.slug)}
                alt={s.name}
                fill
                sizes="96px"
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-semibold text-ink">{s.title}</h3>
              <span className="mt-1 inline-flex items-center gap-1 text-[13px] font-semibold text-burgundy-700">
                İncele
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
