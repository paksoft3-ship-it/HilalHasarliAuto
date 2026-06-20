import type { Metadata } from "next";
import { Suspense } from "react";
import { routes } from "@/config/navigation";
import { Section } from "@/components/ui/section";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SearchClient } from "@/components/forms/search-client";

// Internal search results must not be indexed (master prompt §10).
export const metadata: Metadata = {
  title: "Arama",
  description: "Sitede hizmet, şehir, rehber ve sık sorulan sorular arasında arama yapın.",
  robots: { index: false, follow: true },
  alternates: { canonical: routes.search },
};

export default function SearchPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Arama", href: routes.search }]} />
      <section className="bg-cream-50">
        <div className="container-page py-10 text-center md:py-12">
          <p className="eyebrow mb-3 justify-center">Site İçi Arama</p>
          <h1 className="mx-auto max-w-2xl text-[28px] font-bold leading-[1.1] text-ink md:text-[38px]">
            Aradığınız Bilgiye Hızlıca Ulaşın
          </h1>
        </div>
      </section>
      <Section tone="white">
        <Suspense fallback={<p className="text-center text-ink-muted">Yükleniyor…</p>}>
          <SearchClient />
        </Suspense>
      </Section>
    </>
  );
}
