import { siteConfig } from "@/config/site";
import { routes } from "@/config/navigation";
import { blogPosts } from "@/config/blog";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** RSS 2.0 feed for blog content. */
export function GET() {
  const base = siteConfig.domain;
  const items = blogPosts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${base}${routes.blogPost(p.slug)}</link>
      <guid>${base}${routes.blogPost(p.slug)}</guid>
      <description>${esc(p.excerpt)}</description>
      <category>${esc(p.category)}</category>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(siteConfig.brandName)} Blog</title>
    <link>${base}${routes.blog}</link>
    <description>Hasarlı araç satışı, değerleme ve devir hakkında yazılar.</description>
    <language>tr-TR</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
