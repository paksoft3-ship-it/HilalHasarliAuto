import { siteConfig } from "@/config/site";

type Json = Record<string, unknown>;

const abs = (path: string) =>
  path.startsWith("http") ? path : `${siteConfig.domain}${path}`;

/** Social profiles that are actually configured (empty string = not active). */
function sameAsLinks(): string[] {
  return Object.values(siteConfig.social).filter((v): v is string => Boolean(v));
}

export function organizationLd(): Json {
  const sameAs = sameAsLinks();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.domain}/#organization`,
    name: siteConfig.brandName,
    url: siteConfig.domain,
    logo: {
      "@type": "ImageObject",
      url: abs("/images/logo/BusinessLogoHasarliAracAlan.webp"),
    },
    ...(sameAs.length ? { sameAs } : {}),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phoneE164,
      contactType: "customer service",
      areaServed: "TR",
      availableLanguage: ["Turkish"],
    },
  };
}

/**
 * City-scoped local-business entity for city landing pages. No self-serving
 * aggregateRating (ignored by Google since 2019) and no fake street address —
 * only fields we can state truthfully for a service-area business.
 */
export function localBusinessLd(opts: {
  cityName: string;
  citySlug: string;
  districtNames?: string[];
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": ["AutoDealer", "LocalBusiness"],
    "@id": `${siteConfig.domain}/hizmet-bolgeleri/${opts.citySlug}/#business`,
    name: `${siteConfig.brandName} — ${opts.cityName}`,
    url: abs(`/hizmet-bolgeleri/${opts.citySlug}`),
    image: abs("/images/logo/BusinessLogoHasarliAracAlan.webp"),
    telephone: siteConfig.phoneE164,
    email: siteConfig.email,
    priceRange: "₺₺",
    currenciesAccepted: "TRY",
    areaServed: [
      { "@type": "City", name: opts.cityName },
      ...(opts.districtNames ?? []).map((d) => ({
        "@type": "AdministrativeArea",
        name: `${d}, ${opts.cityName}`,
      })),
    ],
    parentOrganization: { "@id": `${siteConfig.domain}/#organization` },
    knowsAbout: [
      "Hasarlı araç alımı",
      "Kazalı araç alımı",
      "Pert araç alımı",
      "Hurda araç alımı",
    ],
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

/** Hub/directory pages that list a set of city/service links. */
export function collectionPageLd(opts: {
  name: string;
  description: string;
  url: string;
  items: { name: string; url: string }[];
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: abs(opts.url),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: opts.items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        url: abs(it.url),
      })),
    },
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
