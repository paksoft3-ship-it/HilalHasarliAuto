import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/navigation";
import { services } from "@/config/services";
import { publishedCities, getCity } from "@/config/cities";
import { districts } from "@/config/districts";
import { blogPosts } from "@/config/blog";
import { guides } from "@/config/guides";

/**
 * Only published, canonical, indexable, 200-status URLs (master prompt §10).
 * Excludes admin, search, thank-you, drafts, filter/tracking URLs.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.domain;
  const url = (path: string) => `${base}${path}`;
  const now = new Date();

  const core = [
    { url: url(routes.home), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: url(routes.getOffer), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: url(routes.vehiclesWeBuy), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url(routes.howItWorks), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: url(routes.about), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: url(routes.faq), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: url(routes.contact), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: url(routes.serviceAreas), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: url(routes.blog), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: url(routes.guides), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ] satisfies MetadataRoute.Sitemap;

  const servicePages = services.map((s) => ({
    url: url(routes.service(s.slug)),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const cityPages = publishedCities.map((c) => ({
    url: url(routes.city(c.slug)),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const districtPages = districts
    .filter((d) => getCity(d.citySlug)?.published)
    .map((d) => ({
      url: url(routes.district(d.citySlug, d.slug)),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

  const blog = blogPosts.map((p) => ({
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
  ].map((p) => ({ url: url(p), lastModified: now, changeFrequency: "yearly", priority: 0.2 }));

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
