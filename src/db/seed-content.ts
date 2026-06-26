/**
 * Import the config-seeded blog posts (src/config/blog.ts) into the CMS
 * (content_items) so they become editable in /admin/content and are managed
 * by the database instead of the static config.
 *
 *  - Non-sample posts  → status "published" (stay live; DB copy wins the merge).
 *  - Sample posts      → status "draft"     (editable in admin; public still
 *                        falls back to the config seed until you publish them).
 *
 * Idempotent: existing (type, slug, locale) rows are left untouched, so editor
 * changes are never clobbered on re-run.
 *
 * Usage: DATABASE_URL in .env.local, then `pnpm db:seed:content`.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { eq } from "drizzle-orm";

async function main() {
  const { requireDb, isDbConfigured } = await import("./index");
  if (!isDbConfigured) {
    console.error("✗ DATABASE_URL is not set. Add it to .env.local and retry.");
    process.exit(1);
  }
  const db = requireDb();
  const { contentItems, users } = await import("./schema");
  const { blogPosts } = await import("../config/blog");

  // Attribute authorship to the first (oldest) user — the seeded super-admin.
  const [author] = await db.select({ id: users.id }).from(users).orderBy(users.createdAt).limit(1);
  if (!author) {
    console.error("✗ No users found. Run `pnpm db:seed` first.");
    process.exit(1);
  }

  let created = 0;
  let skipped = 0;
  for (const p of blogPosts) {
    const publishedAt = new Date(`${p.date}T09:00:00.000Z`);
    const inserted = await db
      .insert(contentItems)
      .values({
        type: "blog_post",
        slug: p.slug,
        locale: "tr",
        internalTitle: p.title,
        title: p.title,
        excerpt: p.excerpt,
        category: p.category,
        body: p.body,
        imageUrl: p.image,
        imageAlt: p.imageAlt,
        seoTitle: p.title,
        seoDescription: p.metaDescription ?? p.excerpt,
        seoKeywords: p.metaKeywords ?? null,
        faqs: p.faqs ?? [],
        status: p.sample ? "draft" : "published",
        authorId: author.id,
        version: 1,
        publishedAt: p.sample ? null : publishedAt,
      })
      .onConflictDoNothing({
        target: [contentItems.type, contentItems.slug, contentItems.locale],
      })
      .returning({ id: contentItems.id });

    if (inserted.length > 0) {
      created++;
      console.log(`  + ${p.sample ? "draft    " : "published"}  ${p.slug}`);
    } else {
      skipped++;
      console.log(`  · exists (skipped)   ${p.slug}`);
    }
  }

  console.log(`\n✓ Content import done — ${created} created, ${skipped} skipped.`);
  process.exit(0);
}

main().catch((e) => {
  console.error("✗ Import failed:", e instanceof Error ? e.message : e);
  process.exit(1);
});
