import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { getPublicBlogPosts } from "@/lib/cms/public-content";
import { blogMetaKeywords } from "@/config/blog";
import { routes } from "@/config/navigation";
import { formatTrDate } from "@/lib/utils";
import { Section, SectionHeading } from "@/components/ui/section";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHero } from "@/components/ui/page-hero";
import { FinalCta } from "@/components/sections/final-cta";

export const metadata: Metadata = {
  title: "Blog — Araç Değerleme ve Satış Rehberi",
  description:
    "Hasarlı araç satışı, pert ve ağır hasar, değerleme, noter ve devir konularında güncel yazılar.",
  keywords: blogMetaKeywords,
  alternates: { canonical: routes.blog },
};

// Revalidate so newly published CMS posts appear (also revalidated on publish).
export const revalidate = 300;

export default async function BlogListingPage() {
  const posts = await getPublicBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <Breadcrumb items={[{ label: "Blog", href: routes.blog }]} />

      <PageHero
        image="/images/heroes/3.png"
        size="sm"
        eyebrow="Araç Satış ve Değerleme Rehberi"
        title="Hasarlı Araç Satışı Hakkında Bilmeniz Gerekenler"
        description="Değerleme, devir ve satış sürecine dair pratik bilgiler."
      />

      {/* Featured */}
      {featured && (
        <Section tone="white" className="!pb-0">
          <Link
            href={routes.blogPost(featured.slug)}
            className="group grid overflow-hidden rounded-[18px] border border-line bg-cream-50 md:grid-cols-2"
          >
            <div className="relative aspect-[16/10] md:aspect-auto">
              <Image src={featured.image} alt={featured.imageAlt} fill sizes="(max-width:768px) 100vw, 600px" className="object-cover" />
            </div>
            <div className="flex flex-col justify-center p-7 md:p-10">
              <span className="text-xs font-bold uppercase tracking-wide text-gold-700">
                {featured.category}
              </span>
              <h2 className="mt-3 text-[24px] font-bold leading-tight text-ink md:text-[28px]">
                {featured.title}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-secondary">{featured.excerpt}</p>
              <div className="mt-5 flex items-center gap-4 text-xs text-ink-muted">
                <span>{formatTrDate(featured.date)}</span>
                <span className="flex items-center gap-1"><Clock size={13} /> {featured.readingMinutes} dk</span>
              </div>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-burgundy-700">
                Yazıyı Oku <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </Section>
      )}

      {/* Grid */}
      <Section tone="white">
        <SectionHeading title="Son Yazılar" align="left" />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={routes.blogPost(post.slug)}
              className="group flex flex-col overflow-hidden rounded-[14px] border border-line bg-white"
            >
              <div className="relative aspect-[16/10] bg-cream-100">
                <Image src={post.image} alt={post.imageAlt} fill sizes="(max-width:768px) 100vw, 380px" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="text-xs font-bold uppercase tracking-wide text-gold-700">{post.category}</span>
                <h3 className="mt-2 text-lg font-semibold leading-snug text-ink">{post.title}</h3>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-muted">{post.excerpt}</p>
                <div className="mt-4 flex items-center gap-4 text-xs text-ink-muted">
                  <span>{formatTrDate(post.date)}</span>
                  <span className="flex items-center gap-1"><Clock size={13} /> {post.readingMinutes} dk</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
