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
