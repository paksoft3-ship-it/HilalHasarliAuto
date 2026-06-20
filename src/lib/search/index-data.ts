import { services } from "@/config/services";
import { publishedCities } from "@/config/cities";
import { districts, getDistrict } from "@/config/districts";
import { getCity } from "@/config/cities";
import { blogPosts } from "@/config/blog";
import { guides } from "@/config/guides";
import { faqCategories } from "@/config/faq";
import { routes } from "@/config/navigation";

export type SearchType =
  | "Hizmet"
  | "Hizmet Bölgesi"
  | "İlçe"
  | "Rehber"
  | "Blog"
  | "SSS"
  | "Kurumsal";

export interface SearchEntry {
  type: SearchType;
  title: string;
  description: string;
  href: string;
  keywords: string;
}

/** Flat, static search index built from config (no private/admin content). */
export const searchIndex: SearchEntry[] = [
  ...services.map<SearchEntry>((s) => ({
    type: "Hizmet",
    title: s.title,
    description: s.short,
    href: routes.service(s.slug),
    keywords: `${s.title} ${s.name} ${s.short}`,
  })),
  ...publishedCities.map<SearchEntry>((c) => ({
    type: "Hizmet Bölgesi",
    title: `${c.name} Hasarlı Araç Alımı`,
    description: `${c.locative} araç değerlendirme hizmeti.`,
    href: routes.city(c.slug),
    keywords: `${c.name} ${c.region} araç alımı`,
  })),
  ...districts
    .filter((d) => getCity(d.citySlug)?.published)
    .map<SearchEntry>((d) => {
      const district = getDistrict(d.citySlug, d.slug)!;
      const city = getCity(d.citySlug)!;
      return {
        type: "İlçe",
        title: `${district.name} (${city.name})`,
        description: `${city.name} ${district.name} bölgesinde araç alımı.`,
        href: routes.district(d.citySlug, d.slug),
        keywords: `${district.name} ${city.name}`,
      };
    }),
  ...guides.map<SearchEntry>((g) => ({
    type: "Rehber",
    title: g.title,
    description: g.description,
    href: routes.guide(g.slug),
    keywords: `${g.title} ${g.category} ${g.description}`,
  })),
  ...blogPosts.map<SearchEntry>((p) => ({
    type: "Blog",
    title: p.title,
    description: p.excerpt,
    href: routes.blogPost(p.slug),
    keywords: `${p.title} ${p.category} ${p.excerpt}`,
  })),
  ...faqCategories.flatMap((cat) =>
    cat.items.map<SearchEntry>((f) => ({
      type: "SSS",
      title: f.q,
      description: f.a,
      href: routes.faq,
      keywords: `${f.q} ${f.a}`,
    })),
  ),
  {
    type: "Kurumsal",
    title: "Hakkımızda",
    description: "Profesyonel araç değerlendirme ve satın alma süreci.",
    href: routes.about,
    keywords: "hakkımızda kurumsal şirket",
  },
  {
    type: "Kurumsal",
    title: "Nasıl Çalışır?",
    description: "Başvurudan teslime kadar tüm süreç.",
    href: routes.howItWorks,
    keywords: "nasıl çalışır süreç adımlar",
  },
  {
    type: "Kurumsal",
    title: "İletişim",
    description: "Telefon, WhatsApp ve e-posta ile bize ulaşın.",
    href: routes.contact,
    keywords: "iletişim telefon whatsapp",
  },
];

export const searchTypes: SearchType[] = [
  "Hizmet",
  "Hizmet Bölgesi",
  "İlçe",
  "Rehber",
  "Blog",
  "SSS",
  "Kurumsal",
];
