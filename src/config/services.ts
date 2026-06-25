/**
 * Vehicle acquisition services — the primary organic & paid conversion pages.
 * Each maps to /arac-alimi/[slug].
 *
 * - `icon` (lucide-react name) drives the burgundy line-icon category cards
 *   (homepage / overview / related), matching design 5.png.
 * - `image` is a real scene photo (with a genuine background) used for the
 *   service-page hero and feature imagery. The original transparent-looking
 *   category PNGs were discarded — they had a checkerboard baked into the
 *   pixels (no real alpha), so they are not used anywhere.
 *
 * This is seed/config data; the CMS will later own the long-form body content.
 */

export interface VehicleService {
  slug: string;
  /** Short label for category cards & nav. */
  name: string;
  /** H1 / page title form. */
  title: string;
  /** 1–2 line description for cards. */
  short: string;
  /** Real scene photo for hero/feature use (object-cover). */
  image: string;
  imageAlt: string;
  icon: string; // lucide-react name (line icon)
  /** Show on the homepage category grid. */
  featured: boolean;
  /** SEO <title> without brand (the layout template appends " | <brand>"). Falls back to `title`. */
  metaTitle?: string;
  /** SEO meta description. Falls back to the service hero lead. */
  metaDescription?: string;
  /** SEO meta keywords (comma-separated). */
  metaKeywords?: string;
}

const P = "/images/photos";

export const services: VehicleService[] = [
  {
    slug: "hasarli-arac-alimi",
    name: "Hasarlı Araç",
    title: "Hasarlı Araç Alımı",
    short: "Her seviyede hasarlı aracınız için değerlendirme talebi oluşturun.",
    image: `${P}/1.png`,
    imageAlt: "Yan tarafı hasarlı gümüş renkli sedan otomobil",
    icon: "TriangleAlert",
    featured: true,
    metaTitle: "Hasarlı Araç Alımı | En Yüksek Fiyat",
    metaDescription:
      "Hasarlı aracınızı her durumda alıyoruz. Ücretsiz ekspertiz, aynı gün nakit ödeme, ücretsiz çekici. Fotoğraf gönderin, 30 dakikada teklif alın.",
    metaKeywords:
      "hasarlı araç alan, hasarlı araç alımı, hasarlı araba alan, hasarlı oto alım, hasarlı araç satmak",
  },
  {
    slug: "kazali-arac-alimi",
    name: "Kazalı Araç",
    title: "Kazalı Araç Alımı",
    short: "Trafik kazası geçirmiş araçlarınız profesyonelce değerlendirilir.",
    image: `${P}/66.png`,
    imageAlt: "Ön ve yan tarafı kaza nedeniyle hasar görmüş siyah sedan",
    icon: "CarFront",
    featured: true,
    metaTitle: "Kazalı Araç Alımı | Anında Nakit",
    metaDescription:
      "Kaza geçirmiş aracınızı değerinde alıyoruz. Hızlı ve şeffaf değerlendirme, ücretsiz çekici, aynı gün nakit ödeme. Hemen ücretsiz teklif alın.",
    metaKeywords:
      "kazalı araç alan, kazalı araç alımı, kazalı araba alan, kaza yapmış araç alan, kazalı oto satmak",
  },
  {
    slug: "pert-arac-alimi",
    name: "Pert Araç",
    title: "Pert Araç Alımı",
    short: "Pert kayıtlı veya ağır hasarlı araçlar için değerlendirme.",
    image: `${P}/4.png`,
    imageAlt: "Ön tarafı ağır hasarlı, pert durumundaki sedan",
    icon: "FileWarning",
    featured: true,
    metaTitle: "Pert Araç Alımı | En İyi Fiyat",
    metaDescription:
      "Pert kayıtlı veya pert muhtemel araçlarınız için özel değerlendirme. En yüksek fiyat, hızlı işlem, ücretsiz çekici, anında ödeme. Teklif alın.",
    metaKeywords:
      "pert araç alan, pert araç alımı, pert kayıtlı araç, sigorta pertli araç, pert oto satmak",
  },
  {
    slug: "agir-hasarli-arac-alimi",
    name: "Ağır Hasarlı Araç",
    title: "Ağır Hasarlı Araç Alımı",
    short: "Ağır hasarlı araçlarınızı bulunduğu yerden değerlendiriyoruz.",
    image: `${P}/2.png`,
    imageAlt: "Ön tarafı ağır hasarlı siyah SUV",
    icon: "AlertOctagon",
    featured: false,
    metaTitle: "Ağır Hasarlı Araç Alımı | Nakit",
    metaDescription:
      "Ağır hasarlı aracınızı bulunduğu yerden değerlendiriyoruz. Ücretsiz çekici, en yüksek fiyat, aynı gün nakit ödeme. Hemen ücretsiz teklif alın.",
    metaKeywords:
      "ağır hasarlı araç alan, ağır hasarlı araç alımı, ağır hasarlı araba alan, pert araç alan",
  },
  {
    slug: "motor-arizali-arac-alimi",
    name: "Motor Arızalı Araç",
    title: "Motor Arızalı Araç Alımı",
    short: "Motor arızası olan araçlar için süreç planlaması yapılır.",
    image: `${P}/5.png`,
    imageAlt: "Motor bölmesi kontrol edilen, motor kaputu açık araç",
    icon: "Wrench",
    featured: true,
    metaTitle: "Motor Arızalı Araç Alımı",
    metaDescription:
      "Motor arızası bulunan aracınızı değerinde alıyoruz. Ücretsiz ekspertiz, ücretsiz çekici, aynı gün nakit ödeme. Fotoğraf gönderin, teklif alın.",
    metaKeywords:
      "motor arızalı araç alan, motor arızalı araç alımı, motoru arızalı araba alan, arızalı araç alan",
  },
  {
    slug: "mekanik-arizali-arac-alimi",
    name: "Arızalı Araç",
    title: "Mekanik Arızalı Araç Alımı",
    short: "Mekanik arızalı, ekonomik onarımı zor araçlar değerlendirilir.",
    image: `${P}/6.png`,
    imageAlt: "Lift üzerinde mekanik kontrolü yapılan araç",
    icon: "Settings",
    featured: false,
    metaTitle: "Mekanik Arızalı Araç Alımı",
    metaDescription:
      "Mekanik arızalı, ekonomik onarımı zor araçlar için değerlendirme alın. Ücretsiz çekici, en yüksek fiyat, anında nakit ödeme. Hemen arayın.",
    metaKeywords:
      "mekanik arızalı araç alan, mekanik arızalı araç alımı, arızalı araç alan, çalışmayan araç alan",
  },
  {
    slug: "calismayan-arac-alimi",
    name: "Çalışmayan Araç",
    title: "Çalışmayan Araç Alımı",
    short: "Çalışmayan veya marş almayan araçlar için teklif alın.",
    image: `${P}/10.png`,
    imageAlt: "Hareket etmeyen, hasarlı koyu renkli sedan",
    icon: "BatteryWarning",
    featured: false,
    metaTitle: "Çalışmayan Araç Alımı | Nakit",
    metaDescription:
      "Çalışmayan veya marş almayan aracınız için teklif alın. Ücretsiz çekici ile bulunduğu yerden alım, aynı gün nakit ödeme. Hemen teklif alın.",
    metaKeywords:
      "çalışmayan araç alan, çalışmayan araç alımı, marş almayan araç alan, hareket etmeyen araç alan",
  },
  {
    slug: "yanmis-arac-alimi",
    name: "Yanmış Araç",
    title: "Yanmış Araç Alımı",
    short: "Yangın hasarı görmüş araçlarınız için değerlendirme talebi.",
    image: `${P}/8.png`,
    imageAlt: "Yangın sonucu tamamen yanmış sedan otomobil",
    icon: "Flame",
    featured: true,
    metaTitle: "Yanmış Araç Alımı | Nakit Ödeme",
    metaDescription:
      "Yangın hasarı görmüş aracınızı değerlendiriyoruz. Ücretsiz çekici, en yüksek fiyat, aynı gün nakit ödeme. Fotoğraf gönderin, teklif alın.",
    metaKeywords:
      "yanmış araç alan, yanmış araç alımı, yangın hasarlı araç alan, yanık araç alan",
  },
  {
    slug: "sel-hasarli-arac-alimi",
    name: "Selde Kalmış Araç",
    title: "Selde Kalmış Araç Alımı",
    short: "Sel ve su hasarı görmüş, selde kalmış araçlar için süreç desteği.",
    image: `${P}/9.png`,
    imageAlt: "Sel ve çamur hasarı görmüş gri sedan",
    icon: "Waves",
    featured: true,
    metaTitle: "Sel Hasarlı Araç Alımı | Teklif",
    metaDescription:
      "Sel ve su hasarı görmüş aracınız için süreç desteği ve değerlendirme. Ücretsiz çekici, en yüksek fiyat, anında nakit ödeme. Hemen arayın.",
    metaKeywords:
      "sel hasarlı araç alan, sel hasarlı araç alımı, su basmış araç alan, suya giren araç alan",
  },
  {
    slug: "hurda-arac-alimi",
    name: "Hurda Araç",
    title: "Hurda Araç Alımı",
    short: "Hurda ve ekonomik ömrünü tamamlamış araçlar değerlendirilir.",
    image: `${P}/1010.png`,
    imageAlt: "Hurda durumundaki eski, paslı beyaz araç",
    icon: "Recycle",
    featured: true,
    metaTitle: "Hurda Araç Alımı | Hurda Belgeli",
    metaDescription:
      "Hurda ve ekonomik ömrünü tamamlamış aracınızı alıyoruz. Hurda belgeli işlem, ücretsiz çekici, anında nakit ödeme. Hemen ücretsiz teklif alın.",
    metaKeywords:
      "hurda araç alan, hurda araç alımı, hurda belgeli araç, hurdaya araç satmak, hurda oto alan",
  },
  {
    slug: "cekme-belgeli-arac-alimi",
    name: "Çekme Belgeli Araç",
    title: "Çekme Belgeli Araç Alımı",
    short: "Çekme belgeli ve trafikten çekilmiş araçlar için teklif.",
    image: `${P}/7.png`,
    imageAlt: "Çekici üzerinde taşınan çekme belgeli araç",
    icon: "FileText",
    featured: true,
    metaTitle: "Çekme Belgeli Araç Alımı",
    metaDescription:
      "Çekme belgeli ve trafikten çekilmiş aracınız için teklif alın. Ücretsiz çekici, en yüksek fiyat, aynı gün nakit ödeme. Hemen ücretsiz teklif.",
    metaKeywords:
      "çekme belgeli araç alan, çekme belgeli araç alımı, trafikten çekik araç alan, çekme belgeli oto",
  },
];

export const featuredServices = services.filter((s) => s.featured);

export function getService(slug: string): VehicleService | undefined {
  return services.find((s) => s.slug === slug);
}

/**
 * Transparent cut-out car image used as the category "icon"
 * (generated from icons-source by scripts/remove_checkerboard.py).
 */
const ICON_IMG: Record<string, string> = {
  "hasarli-arac-alimi": "hasarli",
  "kazali-arac-alimi": "kazali",
  "pert-arac-alimi": "agir-hasarli",
  "agir-hasarli-arac-alimi": "agir-hasarli",
  "motor-arizali-arac-alimi": "motor-arizali",
  "mekanik-arizali-arac-alimi": "motor-arizali",
  "calismayan-arac-alimi": "motor-arizali",
  "yanmis-arac-alimi": "yanmis",
  "sel-hasarli-arac-alimi": "sel-hasarli",
  "hurda-arac-alimi": "hurda",
  "cekme-belgeli-arac-alimi": "cekme-belgeli",
};

export function serviceIconImage(slug: string): string {
  return `/images/categories/${ICON_IMG[slug] ?? "hasarli"}.png`;
}
