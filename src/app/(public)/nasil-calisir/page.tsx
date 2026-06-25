import type { Metadata } from "next";
import {
  FileText,
  Camera,
  SearchCheck,
  ClipboardCheck,
  Handshake,
  Landmark,
  Truck,
  Archive,
} from "lucide-react";
import { routes } from "@/config/navigation";
import { Section, SectionHeading } from "@/components/ui/section";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHero } from "@/components/ui/page-hero";
import { IconList } from "@/components/ui/icon-list";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { JsonLd } from "@/components/ui/json-ld";
import { CtaGroup } from "@/components/sections/cta-buttons";
import { OfferExplainer } from "@/components/sections/offer-explainer";
import { FinalCta } from "@/components/sections/final-cta";
import { faqPageLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Nasıl Çalışır? | 3 Adımda Araç Satışı",
  description:
    "Aracınızı 3 adımda satın: fotoğraf gönderin, ücretsiz teklifinizi alın, anlaşınca ücretsiz çekici ile alalım ve aynı gün nakit ödeyelim.",
  keywords:
    "araç nasıl satılır, hasarlı araç satış süreci, araç değerleme, ücretsiz çekici",
  alternates: { canonical: routes.howItWorks },
};

const steps = [
  { icon: FileText, title: "Araç bilgilerini paylaşın", desc: "Marka, model, yıl, hasar/arıza durumu ve konum gibi temel bilgileri iletin.", user: "Temel araç bilgilerini girersiniz.", us: "Bilgileri inceleriz." },
  { icon: Camera, title: "Güncel fotoğrafları gönderin", desc: "Aracın dış, iç ve hasarlı bölgelerinin fotoğraflarını paylaşın.", user: "Fotoğrafları form veya WhatsApp ile yüklersiniz.", us: "Görselleri değerlendiririz." },
  { icon: SearchCheck, title: "İlk değerlendirme yapılır", desc: "Paylaştığınız bilgilere göre bir ön değerlendirme oluşturulur.", user: "Sorularımızı yanıtlarsınız.", us: "Ön değerlendirmeyi iletiriz." },
  { icon: ClipboardCheck, title: "Gerekirse araç ve belge kontrolü", desc: "Bazı durumlarda aracın veya belgelerin kontrolü gerekebilir.", user: "Belgeleri hazırlarsınız.", us: "Kontrolü planlarız." },
  { icon: Handshake, title: "Nihai teklif paylaşılır", desc: "Kontrol sonrası netleşen teklif sizinle paylaşılır.", user: "Teklifi değerlendirirsiniz.", us: "Net teklifi sunarız." },
  { icon: Landmark, title: "Noter ve ödeme planı", desc: "Anlaşma sağlandığında noter devri ve ödeme adımları planlanır.", user: "Devir için hazır olursunuz.", us: "Süreci yönlendiririz." },
  { icon: Truck, title: "Teslim veya taşıma", desc: "Konum ve araç durumuna göre teslim ya da taşıma planlanır.", user: "Teslim için uygunluk verirsiniz.", us: "Taşımayı koordine ederiz." },
  { icon: Archive, title: "Satış sonrası kayıtların saklanması", desc: "İşlem kayıtları güvenli biçimde saklanır.", user: "—", us: "Kayıtları muhafaza ederiz." },
];

const processFaqs = [
  { q: "Süreç ne kadar sürer?", a: "Süre; aracın durumuna, belgelere ve konuma göre değişir. Net bir süre taahhüt etmiyoruz, ancak her adımda sizi bilgilendiririz." },
  { q: "Teklifi kabul etmek zorunda mıyım?", a: "Hayır. Değerlendirme talebi oluşturmak ve teklif almak sizi bağlamaz; kararı siz verirsiniz." },
  { q: "Aracım şehir dışındaysa ne olur?", a: "Konuma göre teslim veya taşıma seçenekleri planlanır ve süreç sizinle netleştirilir." },
];

export default function HowItWorksPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Nasıl Çalışır?", href: routes.howItWorks }]} />

      <PageHero
        image="/images/heroes/6.png"
        eyebrow="Şeffaf ve Kolay Süreç"
        title="Aracınızı Satma Süreci Nasıl İlerler?"
        description="Bilgilerinizi paylaşmaktan teslime kadar her adım açık ve anlaşılırdır. Süreç boyunca sizi bilgilendiririz."
      >
        <CtaGroup />
      </PageHero>

      {/* Detailed timeline */}
      <Section tone="white">
        <SectionHeading eyebrow="Adım Adım" title="Sürecin Tüm Aşamaları" />
        <ol className="mx-auto mt-10 max-w-3xl space-y-5">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="flex gap-5 rounded-[14px] border border-line bg-cream-50 p-5 md:p-6"
            >
              <div className="flex flex-col items-center">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-burgundy-700 text-white">
                  <s.icon size={22} strokeWidth={1.9} />
                </span>
                {i < steps.length - 1 && <span className="mt-2 w-px flex-1 bg-line-strong" />}
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gold-700">ADIM {i + 1}</span>
                </div>
                <h3 className="mt-1 text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-secondary">{s.desc}</p>
                <div className="mt-3 grid gap-2 text-[13px] sm:grid-cols-2">
                  <p className="rounded-[8px] bg-white px-3 py-2 text-ink-muted">
                    <span className="font-semibold text-ink">Siz:</span> {s.user}
                  </p>
                  <p className="rounded-[8px] bg-white px-3 py-2 text-ink-muted">
                    <span className="font-semibold text-ink">Biz:</span> {s.us}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Prepare checklist */}
      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading title="Sizin Hazırlamanız Gerekenler" align="left" />
            <IconList
              className="mt-6"
              items={[
                "Araç ruhsatı ve temel araç bilgileri",
                "Aracın güncel fotoğrafları",
                "Hasar veya arıza hakkında kısa açıklama",
                "Varsa ekspertiz / servis kayıtları",
                "Varsa çekme belgesi veya hasar kaydı",
              ]}
            />
          </div>
          <div>
            <SectionHeading title="Bizim Üstlendiğimiz Adımlar" align="left" />
            <IconList
              className="mt-6"
              items={[
                "Araç bilgilerinin ve fotoğrafların değerlendirilmesi",
                "Gerçekçi ve şeffaf değerlendirme",
                "Noter ve devir sürecinde yönlendirme",
                "Ödeme adımlarının güvenli planlanması",
                "Teslim veya taşımanın koordinasyonu",
              ]}
            />
          </div>
        </div>
      </Section>

      {/* Offer explainer */}
      <Section tone="white">
        <SectionHeading
          eyebrow="Beklenti Yönetimi"
          title="İlk Değerlendirme ve Nihai Teklif"
        />
        <div className="mt-10">
          <OfferExplainer />
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="alt">
        <SectionHeading eyebrow="Sık Sorulan Sorular" title="Süreç Hakkında Sorular" />
        <div className="mt-10">
          <FaqAccordion items={processFaqs} />
        </div>
        <JsonLd data={faqPageLd(processFaqs)} />
      </Section>

      <FinalCta />
    </>
  );
}
