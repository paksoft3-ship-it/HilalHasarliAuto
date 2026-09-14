import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/navigation";
import { services } from "@/config/services";
import { publishedCities, getCity } from "@/config/cities";
import { districts } from "@/config/districts";
import { guides } from "@/config/guides";
import { clusterPages } from "@/config/cluster-content";
import { getCityContent, getDistrictContent } from "@/config/local-data";
import { getPublicBlogPosts } from "@/lib/cms/public-content";

// Re-generate periodically so CMS-published posts show up without a redeploy
// (publish also revalidates this route explicitly).
export const revalidate = 3600;

/**
 * Only published, canonical, indexable, 200-status URLs (master prompt §10).
 * Excludes admin, search, thank-you, drafts, filter/tracking URLs.
 * `lastModified` is set only where a real per-page date exists — a fake
 * "always now" build timestamp, or one shared date stamped on every page,
 * teaches Google to ignore the field. `priority`/`changeFrequency` are
 * omitted entirely: Google has stated for years it ignores both.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.domain;
  const url = (path: string) => `${base}${path}`;

  const core: MetadataRoute.Sitemap = [
    routes.home,
    routes.getOffer,
    routes.vehiclesWeBuy,
    routes.howItWorks,
    routes.about,
    routes.faq,
    routes.contact,
    routes.serviceAreas,
    routes.blog,
    routes.guides,
  ].map((p) => ({ url: url(p) }));

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: url(routes.service(s.slug)),
  }));

  const clusterPageEntries: MetadataRoute.Sitemap = clusterPages.map((c) => ({
    url: url(routes[c.routeKey]),
    lastModified: new Date(c.lastUpdated),
  }));

  // Real, per-page content-revision dates — each city/district entry's own
  // `lastUpdated` in local-data.ts, bumped only when that specific page's
  // content actually changes (not a single constant shared across all of them).
  const cityPages: MetadataRoute.Sitemap = publishedCities.map((c) => {
    const content = getCityContent(c.slug);
    return {
      url: url(routes.city(c.slug)),
      ...(content?.lastUpdated ? { lastModified: new Date(content.lastUpdated) } : {}),
    };
  });

  const districtPages: MetadataRoute.Sitemap = districts
    .filter((d) => getCity(d.citySlug)?.published)
    .map((d) => {
      const content = getDistrictContent(d.citySlug, d.slug);
      return {
        url: url(routes.district(d.citySlug, d.slug)),
        ...(content?.lastUpdated ? { lastModified: new Date(content.lastUpdated) } : {}),
      };
    });

  const blog: MetadataRoute.Sitemap = (await getPublicBlogPosts())
    .filter((p) => !p.robots?.includes("noindex"))
    .map((p) => ({
      url: url(routes.blogPost(p.slug)),
      lastModified: new Date(p.date),
    }));

  const guidePages: MetadataRoute.Sitemap = guides.map((g) => ({
    url: url(routes.guide(g.slug)),
    lastModified: new Date(g.lastReviewed),
  }));

  const legal: MetadataRoute.Sitemap = [
    routes.privacy,
    routes.kvkk,
    routes.cookies,
    routes.terms,
    routes.legalNotice,
  ].map((p) => ({ url: url(p) }));

  return [
    ...core,
    ...servicePages,
    ...clusterPageEntries,
    ...cityPages,
    ...districtPages,
    ...blog,
    ...guidePages,
    ...legal,
  ];
}
