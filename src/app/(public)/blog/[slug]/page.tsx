import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { blogPosts, blogMetaKeywords } from "@/config/blog";
import { getPublicBlogPosts, getPublicBlogPost } from "@/lib/cms/public-content";
import { routes } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { formatTrDate } from "@/lib/utils";
import { Section, SectionHeading } from "@/components/ui/section";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ArticleBody } from "@/components/ui/article-body";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { JsonLd } from "@/components/ui/json-ld";
import { FinalCta } from "@/components/sections/final-cta";
import { faqPageLd } from "@/lib/seo/jsonld";

// Allow CMS-published slugs (not known at build) to render on demand.
export const dynamicParams = true;
export const revalidate = 300;

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicBlogPost(slug);
  if (!post) return {};
  const description = post.metaDescription ?? post.excerpt;
  return {
    title: post.title,
    description,
    keywords: blogMetaKeywords,
    alternates: { canonical: routes.blogPost(slug) },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: routes.blogPost(slug),
      images: [{ url: post.image }],
      publishedTime: post.date,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublicBlogPost(slug);
  if (!post) notFound();

  const related = (await getPublicBlogPosts()).filter((p) => p.slug !== slug).slice(0, 3);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: `${siteConfig.domain}${post.image}`,
    datePublished: post.date,
    author: { "@type": "Organization", name: siteConfig.brandName },
    publisher: { "@type": "Organization", name: siteConfig.brandName },
    mainEntityOfPage: `${siteConfig.domain}${routes.blogPost(slug)}`,
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Blog", href: routes.blog },
          { label: post.title, href: routes.blogPost(slug) },
        ]}
      />

      <article>
        {/* Header */}
        <Section tone="cream" className="!pb-8">
          <div className="mx-auto max-w-[820px]">
            <span className="text-xs font-bold uppercase tracking-wide text-gold-700">
              {post.category}
            </span>
            <h1 className="mt-3 text-[30px] font-bold leading-tight text-ink md:text-[40px]">
              {post.title}
            </h1>
            <p className="mt-4 text-[17px] leading-relaxed text-ink-secondary">{post.excerpt}</p>
            <div className="mt-5 flex items-center gap-4 text-sm text-ink-muted">
              <span>{formatTrDate(post.date)}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {post.readingMinutes} dk okuma</span>
              <span>Editör: {siteConfig.brandName} Ekibi</span>
            </div>
          </div>
        </Section>

        {/* Feature image */}
        <div className="container-page">
          <div className="relative mx-auto aspect-[16/9] max-w-[920px] overflow-hidden rounded-[18px] border border-line">
            <Image src={post.image} alt={post.imageAlt} fill priority sizes="920px" className="object-cover" />
          </div>
        </div>

        {/* Body */}
        <Section tone="white">
          <div className="mx-auto max-w-[820px]">
            {post.sample && (
              <p className="mb-6 rounded-[10px] border border-warning/30 bg-warning-surface px-4 py-2 text-xs font-medium text-ink-secondary">
                Bu yazı örnek içeriktir ve yayın öncesi güncellenecektir.
              </p>
            )}
            <ArticleBody blocks={post.body} />

            {post.faqs && post.faqs.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-5 text-[24px] font-bold text-ink">Sık Sorulan Sorular</h2>
                <FaqAccordion items={post.faqs} />
                <JsonLd data={faqPageLd(post.faqs)} />
              </div>
            )}
          </div>
        </Section>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <Section tone="cream">
          <SectionHeading title="İlgili Yazılar" align="left" />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((p) => (
              <Link key={p.slug} href={routes.blogPost(p.slug)} className="group flex flex-col overflow-hidden rounded-[14px] border border-line bg-white">
                <div className="relative aspect-[16/10] bg-cream-100">
                  <Image src={p.image} alt={p.imageAlt} fill sizes="380px" className="object-cover" />
                </div>
                <div className="p-5">
                  <span className="text-xs font-bold uppercase tracking-wide text-gold-700">{p.category}</span>
                  <h3 className="mt-2 text-base font-semibold leading-snug text-ink">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      <FinalCta />
      <JsonLd data={articleLd} />
    </>
  );
}
