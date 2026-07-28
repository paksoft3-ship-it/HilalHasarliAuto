import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/navigation";
import { services } from "@/config/services";
import { publishedCities, getCity } from "@/config/cities";
import { districts } from "@/config/districts";
import { guides } from "@/config/guides";
import { getPublicBlogPosts } from "@/lib/cms/public-content";

// Re-generate periodically so CMS-published posts show up without a redeploy
// (publish also revalidates this route explicitly).
export const revalidate = 3600;

/**
 * Only published, canonical, indexable, 200-status URLs (master prompt §10).
 * Excludes admin, search, thank-you, drafts, filter/tracking URLs.
 * `lastModified` is set only where a real date exists — a fake "always now"
 * value teaches Google to ignore the field.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.domain;
  const url = (path: string) => `${base}${path}`;

  const core = [
    { url: url(routes.home), changeFrequency: "weekly", priority: 1 },
    { url: url(routes.getOffer), changeFrequency: "monthly", priority: 0.9 },
    { url: url(routes.vehiclesWeBuy), changeFrequency: "monthly", priority: 0.8 },
    { url: url(routes.howItWorks), changeFrequency: "monthly", priority: 0.6 },
    { url: url(routes.about), changeFrequency: "yearly", priority: 0.5 },
    { url: url(routes.faq), changeFrequency: "monthly", priority: 0.6 },
    { url: url(routes.contact), changeFrequency: "yearly", priority: 0.5 },
    { url: url(routes.serviceAreas), changeFrequency: "monthly", priority: 0.7 },
    { url: url(routes.blog), changeFrequency: "weekly", priority: 0.6 },
    { url: url(routes.guides), changeFrequency: "monthly", priority: 0.6 },
  ] satisfies MetadataRoute.Sitemap;

  const servicePages = services.map((s) => ({
    url: url(routes.service(s.slug)),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const cityPages = publishedCities.map((c) => ({
    url: url(routes.city(c.slug)),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const districtPages = districts
    .filter((d) => getCity(d.citySlug)?.published)
    .map((d) => ({
      url: url(routes.district(d.citySlug, d.slug)),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

  const blog = (await getPublicBlogPosts())
    .filter((p) => !p.robots?.includes("noindex"))
    .map((p) => ({
      url: url(routes.blogPost(p.slug)),
      lastModified: new Date(p.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    }));

  const guidePages = guides.map((g) => ({
    url: url(routes.guide(g.slug)),
    lastModified: new Date(g.lastReviewed),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const legal: MetadataRoute.Sitemap = [
    routes.privacy,
    routes.kvkk,
    routes.cookies,
    routes.terms,
    routes.legalNotice,
  ].map((p) => ({ url: url(p), changeFrequency: "yearly", priority: 0.2 }));

  return [
    ...core,
    ...servicePages,
    ...cityPages,
    ...districtPages,
    ...blog,
    ...guidePages,
    ...legal,
  ];
}
