import type { Block } from "./blog";

export interface GuideChapter {
  title: string;
  blocks: Block[];
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: string;
  estimatedTime: string;
  difficulty: "Kolay" | "Orta" | "İleri";
  lastReviewed: string; // ISO
  image: string;
  imageAlt: string;
  chapters: GuideChapter[];
  sample: boolean;
}

export const guideCategories = [
  "Araç durumuna göre",
  "Satış sürecine göre",
  "Belge ve hazırlık",
  "Konum ve taşıma",
];

export const guides: Guide[] = [
  {
    slug: "hasarli-arac-satisi-bastan-sona",
    title: "Hasarlı Araç Satışı: Başvurudan Teslime Kadar Tüm Süreç",
    description:
      "Hasarlı aracınızı satarken izleyeceğiniz adımları başvurudan teslime kadar adım adım anlatan kapsamlı rehber.",
    category: "Satış sürecine göre",
    estimatedTime: "10 dk",
    difficulty: "Kolay",
    lastReviewed: "2026-05-20",
    image: "/images/photos/2.png",
    imageAlt: "Değerlendirme için hazırlanmış hasarlı araç",
    chapters: [
      {
        title: "Süreç genel bakış",
        blocks: [
          { type: "p", text: "Hasarlı araç satışı; bilgi paylaşımı, değerlendirme, teklif, noter ve teslim adımlarından oluşur. Bu rehberde her adımı sırasıyla ele alıyoruz." },
        ],
      },
      {
        title: "Araç bilgilerini hazırlayın",
        blocks: [
          { type: "p", text: "Marka, model, yıl, kilometre ve hasar durumu gibi temel bilgileri hazırlayın." },
          { type: "ul", items: ["Ruhsat bilgileri", "Hasar/arıza açıklaması", "Varsa servis veya ekspertiz kayıtları"] },
        ],
      },
      {
        title: "Aracı fotoğraflayın",
        blocks: [
          { type: "p", text: "Net ve aydınlık fotoğraflar değerlendirmeyi hızlandırır." },
          { type: "ul", items: ["Dört yönden genel görünüm", "Hasarlı bölgelerin yakın çekimi", "Motor bölmesi ve iç mekân"] },
        ],
      },
      {
        title: "Değerlendirme talebi gönderin",
        blocks: [
          { type: "p", text: "Bilgileri ve fotoğrafları paylaşarak değerlendirme talebi oluşturun. Bu adım ücretsizdir ve sizi bağlamaz." },
        ],
      },
      {
        title: "Noter ve teslim",
        blocks: [
          { type: "p", text: "Anlaşma sağlandığında noter devri ve ödeme adımları planlanır; ardından teslim veya taşıma gerçekleştirilir." },
          { type: "note", text: "Bu rehber genel bilgilendirme amaçlıdır; hukuki tavsiye niteliği taşımaz." },
        ],
      },
    ],
    sample: true,
  },
  {
    slug: "arac-fotografi-nasil-cekilir",
    title: "Değerlendirme İçin Araç Fotoğrafı Nasıl Çekilir?",
    description:
      "Aracınızın değerini doğru yansıtan fotoğraflar çekmek için pratik bir kontrol listesi.",
    category: "Belge ve hazırlık",
    estimatedTime: "5 dk",
    difficulty: "Kolay",
    lastReviewed: "2026-05-02",
    image: "/images/photos/22.png",
    imageAlt: "Hasarlı aracın telefonla fotoğraflanması",
    chapters: [
      {
        title: "Doğru ışık ve açı",
        blocks: [
          { type: "p", text: "Gün ışığında, gölgesiz ve net fotoğraflar tercih edin. Aracın tamamı kadraja girsin." },
        ],
      },
      {
        title: "Çekilmesi gereken fotoğraflar",
        blocks: [
          { type: "ol", items: [
            "Ön, arka ve her iki yan görünüm",
            "Hasarlı bölgelerin yakın çekimi",
            "Motor bölmesi",
            "Gösterge paneli (kilometre görünecek şekilde)",
            "Şase numarası ve ruhsat",
          ] },
        ],
      },
    ],
    sample: true,
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
