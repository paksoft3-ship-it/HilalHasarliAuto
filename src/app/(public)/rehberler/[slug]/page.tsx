import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, Layers, BarChart3, CalendarCheck } from "lucide-react";
import { guides, getGuide } from "@/config/guides";
import { routes } from "@/config/navigation";
import { formatTrDate } from "@/lib/utils";
import { Section } from "@/components/ui/section";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ArticleBody } from "@/components/ui/article-body";
import { JsonLd } from "@/components/ui/json-ld";
import { buttonClasses } from "@/components/ui/button";
import { FinalCta } from "@/components/sections/final-cta";

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: routes.guide(slug) },
    openGraph: { title: g.title, description: g.description, type: "article", images: [{ url: g.image }] },
  };
}

const anchor = (i: number) => `bolum-${i + 1}`;

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();

  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: g.title,
    description: g.description,
    step: g.chapters.map((c, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: c.title,
    })),
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Araç Satış Rehberleri", href: routes.guides },
          { label: g.title, href: routes.guide(slug) },
        ]}
      />

      {/* Header */}
      <Section tone="cream" className="!pb-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-wide text-gold-700">{g.category}</span>
            <h1 className="mt-3 text-[30px] font-bold leading-tight text-ink md:text-[40px]">{g.title}</h1>
            <p className="mt-4 text-[17px] leading-relaxed text-ink-secondary">{g.description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-ink-muted">
              <span className="flex items-center gap-1.5"><Layers size={15} /> {g.chapters.length} bölüm</span>
              <span className="flex items-center gap-1.5"><Clock size={15} /> {g.estimatedTime}</span>
              <span className="flex items-center gap-1.5"><BarChart3 size={15} /> {g.difficulty}</span>
              <span className="flex items-center gap-1.5"><CalendarCheck size={15} /> Son güncelleme: {formatTrDate(g.lastReviewed)}</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`#${anchor(0)}`} className={buttonClasses({ variant: "primary" })}>Rehbere Başla</a>
              <Link href={routes.getOffer} className={buttonClasses({ variant: "outline" })}>Teklif Al</Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] border border-line">
              <Image src={g.image} alt={g.imageAlt} fill priority sizes="(max-width:1024px) 100vw, 480px" className="object-cover" />
            </div>
          </div>
        </div>
      </Section>

      {/* Body + chapter nav */}
      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Chapter nav */}
          <aside className="lg:col-span-3">
            <nav aria-label="Bölümler" className="lg:sticky lg:top-24">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-muted">Bölümler</p>
              <ol className="space-y-1.5 border-l border-line">
                {g.chapters.map((c, i) => (
                  <li key={i}>
                    <a href={`#${anchor(i)}`} className="block border-l-2 border-transparent -ml-px py-1.5 pl-3 text-sm text-ink-secondary hover:border-burgundy-700 hover:text-burgundy-700">
                      {i + 1}. {c.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          {/* Chapters */}
          <div className="lg:col-span-9">
            {g.sample && (
              <p className="mb-6 rounded-[10px] border border-warning/30 bg-warning-surface px-4 py-2 text-xs font-medium text-ink-secondary">
                Bu rehber örnek içeriktir ve yayın öncesi gözden geçirilecektir.
              </p>
            )}
            <div className="max-w-[820px] space-y-12">
              {g.chapters.map((c, i) => (
                <section key={i} id={anchor(i)} className="scroll-mt-24">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-burgundy-700 text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <h2 className="text-[24px] font-bold leading-tight text-ink">{c.title}</h2>
                  </div>
                  <div className="mt-4 pl-12">
                    <ArticleBody blocks={c.blocks} />
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <FinalCta />
      <JsonLd data={howToLd} />
    </>
  );
}
