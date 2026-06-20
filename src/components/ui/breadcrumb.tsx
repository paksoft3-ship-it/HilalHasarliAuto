import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { routes } from "@/config/navigation";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { JsonLd } from "./json-ld";

export interface Crumb {
  label: string;
  href: string;
}

/**
 * Breadcrumb with BreadcrumbList JSON-LD. Always prefixed with "Ana Sayfa".
 * Last item renders as current page (no link).
 */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "Ana Sayfa", href: routes.home }, ...items];
  return (
    <nav aria-label="Sayfa yolu" className="border-b border-line bg-cream-50">
      <div className="container-page py-3">
        <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-ink-muted">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-1.5">
                {last ? (
                  <span className="font-medium text-ink" aria-current="page">
                    {c.label}
                  </span>
                ) : (
                  <Link href={c.href} className="hover:text-burgundy-700">
                    {c.label}
                  </Link>
                )}
                {!last && <ChevronRight size={14} className="text-ink-soft" />}
              </li>
            );
          })}
        </ol>
      </div>
      <JsonLd data={breadcrumbLd(all)} />
    </nav>
  );
}
