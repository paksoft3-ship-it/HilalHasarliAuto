import { ArticleBody } from "./article-body";
import { Breadcrumb } from "./breadcrumb";
import { PrintButton } from "./print-button";
import type { Block } from "@/config/blog";

export interface LegalSection {
  id: string;
  heading: string;
  blocks: Block[];
}

export interface LegalDoc {
  eyebrow: string;
  title: string;
  intro: string;
  lastUpdated: string;
  href: string;
  breadcrumbLabel: string;
  sections: LegalSection[];
}

/** Calm legal-document layout: sticky TOC + reading column + print mode. */
export function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <Breadcrumb items={[{ label: doc.breadcrumbLabel, href: doc.href }]} />

      <section className="bg-cream-50 print:bg-white">
        <div className="container-page py-10 md:py-12">
          <p className="eyebrow mb-3">{doc.eyebrow}</p>
          <h1 className="max-w-3xl text-[28px] font-bold leading-tight text-ink md:text-[38px]">
            {doc.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-secondary">
            {doc.intro}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <span className="text-sm text-ink-muted">Son güncelleme: {doc.lastUpdated}</span>
            <span className="print:hidden">
              <PrintButton />
            </span>
          </div>
        </div>
      </section>

      <div className="container-page py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* TOC */}
          <aside className="lg:col-span-4 xl:col-span-3 print:hidden">
            <nav aria-label="İçindekiler" className="lg:sticky lg:top-24">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-muted">İçindekiler</p>
              <ol className="space-y-1 border-l border-line text-sm">
                {doc.sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="block -ml-px border-l-2 border-transparent py-1.5 pl-3 text-ink-secondary hover:border-burgundy-700 hover:text-burgundy-700">
                      {i + 1}. {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          {/* Content */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="max-w-[840px] space-y-10">
              {doc.sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-24">
                  <h2 className="text-[22px] font-bold text-ink">
                    {i + 1}. {s.heading}
                  </h2>
                  <div className="mt-4">
                    <ArticleBody blocks={s.blocks} />
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
