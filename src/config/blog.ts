import type { FaqItem } from "./faq";

/** Simple structured content block (avoids a markdown dependency). */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "note"; text: string };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** ISO date — editable; sample content for development. */
  date: string;
  readingMinutes: number;
  image: string;
  imageAlt: string;
  body: Block[];
  faqs?: FaqItem[];
  /** Mark sample content so it is clearly non-production. */
  sample: boolean;
}

export const blogCategories = [
  "Hasarlı Araç",
  "Pert ve Ağır Hasar",
  "Araç Değerleme",
  "Noter ve Devir",
  "Hurda ve Çekme Belgeli",
];

export const blogPosts: BlogPost[] = [
  {
    slug: "hasarli-arac-satarken-dikkat-edilmesi-gerekenler",
    title: "Hasarlı Araç Satarken Nelere Dikkat Edilmelidir?",
    excerpt:
      "Hasarlı aracınızı satmadan önce bilmeniz gereken hazırlık, değerleme ve devir adımlarını derledik.",
    category: "Hasarlı Araç",
    date: "2026-05-12",
    readingMinutes: 6,
    image: "/images/photos/2.png",
    imageAlt: "Ön tarafı hasarlı siyah SUV",
    body: [
      { type: "p", text: "Hasarlı bir aracı satmak, sağlam bir aracı satmaktan farklı bir süreçtir. Aracın gerçek durumunu doğru aktarmak hem değerlemeyi hem de devir sürecini hızlandırır." },
      { type: "h2", text: "1. Aracın durumunu net belirleyin" },
      { type: "p", text: "Hasarın kapsamını, aracın çalışıp çalışmadığını ve varsa hasar kayıtlarını önceden netleştirin. Bu bilgiler değerlendirmenin temelini oluşturur." },
      { type: "h2", text: "2. Doğru fotoğrafları hazırlayın" },
      { type: "ul", items: [
        "Aracın dört bir yönden genel görünümü",
        "Hasarlı bölgelerin yakın çekimi",
        "Motor bölmesi ve iç mekân",
        "Kilometre ve ruhsat bilgileri",
      ] },
      { type: "h2", text: "3. İlk değerlendirme ile nihai teklifi ayırın" },
      { type: "p", text: "Fotoğraf ve bilgilere göre yapılan ilk değerlendirme bağlayıcı değildir. Nihai teklif, aracın ve belgelerin kontrolünden sonra netleşir." },
      { type: "note", text: "Bu içerik genel bilgilendirme amaçlıdır; hukuki veya mali tavsiye niteliği taşımaz." },
      { type: "h2", text: "4. Noter ve ödeme adımlarını planlayın" },
      { type: "p", text: "Anlaşma sağlandığında noter devri ve ödeme adımları açık şekilde planlanmalı ve güvenli biçimde tamamlanmalıdır." },
    ],
    faqs: [
      { q: "Hasarlı aracı ekspertizsiz satabilir miyim?", a: "Evet. Ekspertiz zorunlu değildir; ancak varsa süreci hızlandırır." },
    ],
    sample: true,
  },
  {
    slug: "pert-arac-nedir-nasil-degerlenir",
    title: "Pert Araç Nedir ve Nasıl Değerlenir?",
    excerpt:
      "Pert kaydı, ağır hasarlı araçların değerlemesini nasıl etkiler? Pert araç satışında dikkat edilmesi gerekenler.",
    category: "Pert ve Ağır Hasar",
    date: "2026-04-28",
    readingMinutes: 5,
    image: "/images/photos/4.png",
    imageAlt: "Ön tarafı ağır hasarlı, pert durumundaki sedan",
    body: [
      { type: "p", text: "Pert araç, onarım maliyetinin aracın değerine yakın veya üzerinde olması nedeniyle ekonomik onarımı uygun görülmeyen araçtır." },
      { type: "h2", text: "Pert kaydının değerlemeye etkisi" },
      { type: "p", text: "Pert kaydı, aracın değerini etkileyen önemli bir faktördür. Ancak nihai değer, aracın bütünü ve kullanılabilir parçaları dikkate alınarak belirlenir." },
      { type: "h2", text: "Pert araç satışında belge süreci" },
      { type: "p", text: "Pert kayıt durumuna göre devir adımları değişebilir. Doğru ve resmi sürecin nasıl ilerleyeceği değerlendirme sırasında açıklanır." },
    ],
    sample: true,
  },
  {
    slug: "calismayan-araci-satmanin-yollari",
    title: "Çalışmayan Aracı Satmanın Yolları",
    excerpt:
      "Marş almayan veya uzun süredir çalışmayan aracınızı değerlendirmek için izleyebileceğiniz adımlar.",
    category: "Araç Değerleme",
    date: "2026-04-10",
    readingMinutes: 4,
    image: "/images/photos/10.png",
    imageAlt: "Hareket etmeyen, hasarlı koyu renkli sedan",
    body: [
      { type: "p", text: "Çalışmayan araçlar da değerlendirilebilir. Önemli olan aracın mevcut durumunu doğru aktarmaktır." },
      { type: "h2", text: "Arıza kaynağını bilmiyorsanız" },
      { type: "p", text: "Aracın neden çalışmadığını bilmeseniz dahi değerlendirme talebi oluşturabilirsiniz. Gerektiğinde taşıma seçenekleri planlanır." },
    ],
    sample: true,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
