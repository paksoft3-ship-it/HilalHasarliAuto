import { isDbConfigured } from "@/db";
import { listPublishedByType, getPublishedByTypeSlug } from "@/db/repo/content";
import { blogPosts as seedPosts, getBlogPost as getSeedPost, type BlogPost, type Block } from "@/config/blog";
import { readingMinutes } from "./blocks";

interface DbItem {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  body: Block[];
  imageUrl: string | null;
  imageAlt: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
}

function mapItem(item: DbItem): BlogPost {
  return {
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt ?? "",
    category: item.category ?? "Genel",
    date: (item.publishedAt ?? item.updatedAt).toISOString(),
    readingMinutes: readingMinutes(item.body),
    image: item.imageUrl ?? "/images/photos/2.png",
    imageAlt: item.imageAlt ?? item.title,
    body: item.body,
    sample: false,
  };
}

/** Published blog posts from the CMS, merged with config seeds (DB wins). */
export async function getPublicBlogPosts(): Promise<BlogPost[]> {
  if (!isDbConfigured) return seedPosts;
  const dbPosts = (await listPublishedByType("blog_post")).map((i) => mapItem(i as DbItem));
  const dbSlugs = new Set(dbPosts.map((p) => p.slug));
  const merged = [...dbPosts, ...seedPosts.filter((p) => !dbSlugs.has(p.slug))];
  return merged.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPublicBlogPost(slug: string): Promise<BlogPost | undefined> {
  if (isDbConfigured) {
    const item = await getPublishedByTypeSlug("blog_post", slug);
    if (item) return mapItem(item as DbItem);
  }
  return getSeedPost(slug);
}
