import { siteConfig } from "@/config/site";

type Json = Record<string, unknown>;

const abs = (path: string) =>
  path.startsWith("http") ? path : `${siteConfig.domain}${path}`;

export function organizationLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.brandName,
    url: siteConfig.domain,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phoneE164,
      contactType: "customer service",
      areaServed: "TR",
      availableLanguage: ["Turkish"],
    },
  };
}

export function websiteLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.brandName,
    url: siteConfig.domain,
    inLanguage: "tr-TR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.domain}/arama?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbLd(items: { label: string; href: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      item: abs(it.href),
    })),
  };
}

export function serviceLd(opts: {
  name: string;
  description: string;
  url: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: abs(opts.url),
    areaServed: { "@type": "Country", name: "Türkiye" },
    provider: { "@type": "Organization", name: siteConfig.brandName },
    serviceType: "Hasarlı araç alımı",
  };
}

/** Only emit when the FAQ content is actually visible on the page. */
export function faqPageLd(faqs: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
