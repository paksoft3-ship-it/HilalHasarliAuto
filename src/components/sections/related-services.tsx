import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/section";
import { services } from "@/config/services";
import { routes } from "@/config/navigation";

/**
 * All vehicle services shown as badges (the current service excluded). Lets a
 * visitor jump to any category from a service page.
 */
export function RelatedServices({
  currentSlug,
  title = "Diğer Araç Alım Hizmetleri",
}: {
  currentSlug?: string;
  title?: string;
}) {
  const items = services.filter((s) => s.slug !== currentSlug);
  if (items.length === 0) return null;

  return (
    <Section tone="white">
      <SectionHeading title={title} align="left" />
      <ul className="mt-6 flex flex-wrap gap-2.5">
        {items.map((s) => (
          <li key={s.slug}>
            <Link
              href={routes.service(s.slug)}
              className="inline-flex items-center rounded-full border border-line bg-cream-50 px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-burgundy-700 hover:text-burgundy-700"
            >
              {s.title}
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
