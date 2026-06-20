/** Public site route map (Turkish slugs for Turkish SEO; locale-ready). */
export const routes = {
  home: "/",
  getOffer: "/teklif-al",
  vehiclesWeBuy: "/hangi-araclari-aliyoruz",
  service: (slug: string) => `/arac-alimi/${slug}`,
  howItWorks: "/nasil-calisir",
  about: "/hakkimizda",
  faq: "/sss",
  contact: "/iletisim",
  serviceAreas: "/hizmet-bolgeleri",
  city: (slug: string) => `/hizmet-bolgeleri/${slug}`,
  district: (city: string, district: string) =>
    `/hizmet-bolgeleri/${city}/${district}`,
  blog: "/blog",
  blogPost: (slug: string) => `/blog/${slug}`,
  guides: "/rehberler",
  guide: (slug: string) => `/rehberler/${slug}`,
  thankYou: "/tesekkurler",
  search: "/arama",
  // Legal
  privacy: "/gizlilik-politikasi",
  kvkk: "/kvkk-aydinlatma-metni",
  cookies: "/cerez-politikasi",
  terms: "/kullanim-kosullari",
  legalNotice: "/yasal-uyari",
} as const;

export interface NavItem {
  label: string;
  href: string;
}

/** Primary header navigation (design.md §13). */
export const mainNav: NavItem[] = [
  { label: "Ana Sayfa", href: routes.home },
  { label: "Hangi Araçları Alıyoruz?", href: routes.vehiclesWeBuy },
  { label: "Nasıl Çalışır?", href: routes.howItWorks },
  { label: "Hakkımızda", href: routes.about },
  { label: "İletişim", href: routes.contact },
];

export const footerNav = {
  quickLinks: [
    { label: "Ana Sayfa", href: routes.home },
    { label: "Teklif Al", href: routes.getOffer },
    { label: "Nasıl Çalışır?", href: routes.howItWorks },
    { label: "Hakkımızda", href: routes.about },
    { label: "Sık Sorulan Sorular", href: routes.faq },
    { label: "Blog", href: routes.blog },
    { label: "Araç Satış Rehberleri", href: routes.guides },
  ] satisfies NavItem[],
  legal: [
    { label: "Gizlilik Politikası", href: routes.privacy },
    { label: "KVKK Aydınlatma Metni", href: routes.kvkk },
    { label: "Çerez Politikası", href: routes.cookies },
    { label: "Kullanım Koşulları", href: routes.terms },
    { label: "Yasal Uyarı", href: routes.legalNotice },
  ] satisfies NavItem[],
};
