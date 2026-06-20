import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, BookOpen, Layers } from "lucide-react";
import { guides } from "@/config/guides";
import { routes } from "@/config/navigation";
import { Section, SectionHeading } from "@/components/ui/section";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHero } from "@/components/ui/page-hero";
import { FinalCta } from "@/components/sections/final-cta";

export const metadata: Metadata = {
  title: "Araç Satış Rehberleri",
  description:
    "Aracınızın durumuna uygun adım adım satış rehberleri: hazırlık, değerleme, noter ve teslim süreçleri.",
  alternates: { canonical: routes.guides },
};

export default function GuidesListingPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Araç Satış Rehberleri", href: routes.guides }]} />

      <PageHero
        image="/images/heroes/6.png"
        size="sm"
        eyebrow="Adım Adım Araç Satış Rehberleri"
        title="Aracınızın Durumuna Uygun Rehberi Bulun"
        description="Hasarlı, arızalı ve çalışmayan araç satışına dair pratik, uygulanabilir rehberler."
      />

      <Section tone="white">
        <SectionHeading title="Tüm Rehberler" align="left" />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <Link
              key={g.slug}
              href={routes.guide(g.slug)}
              className="group flex flex-col overflow-hidden rounded-[14px] border border-line bg-white"
            >
              <div className="relative aspect-[16/10] bg-cream-100">
                <Image src={g.image} alt={g.imageAlt} fill sizes="(max-width:768px) 100vw, 380px" className="object-cover" />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-burgundy-700">
                  <BookOpen size={12} /> Rehber
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="text-xs font-bold uppercase tracking-wide text-gold-700">{g.category}</span>
                <h3 className="mt-2 text-lg font-semibold leading-snug text-ink">{g.title}</h3>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-muted">{g.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-ink-muted">
                  <span className="flex items-center gap-1"><Layers size={13} /> {g.chapters.length} bölüm</span>
                  <span className="flex items-center gap-1"><Clock size={13} /> {g.estimatedTime}</span>
                  <span>{g.difficulty}</span>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-burgundy-700">
                  Rehbere Başla <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
