/**
 * Priority service-area cities (master prompt §2 Geography).
 * A city page is only "published" once it has unique approved content —
 * the `published` flag gates routing/sitemap inclusion. For now all are
 * config-seeded; the CMS will own this later.
 */

export interface City {
  slug: string;
  name: string;
  /** Possessive form for Turkish copy, e.g. "İstanbul'da". */
  locative: string;
  region: string;
  featured: boolean;
  published: boolean;
}

export const cities: City[] = [
  { slug: "istanbul", name: "İstanbul", locative: "İstanbul'da", region: "Marmara", featured: true, published: true },
  { slug: "ankara", name: "Ankara", locative: "Ankara'da", region: "İç Anadolu", featured: true, published: true },
  { slug: "izmir", name: "İzmir", locative: "İzmir'de", region: "Ege", featured: true, published: true },
  { slug: "bursa", name: "Bursa", locative: "Bursa'da", region: "Marmara", featured: true, published: true },
  { slug: "antalya", name: "Antalya", locative: "Antalya'da", region: "Akdeniz", featured: true, published: true },
  { slug: "adana", name: "Adana", locative: "Adana'da", region: "Akdeniz", featured: true, published: true },
  { slug: "konya", name: "Konya", locative: "Konya'da", region: "İç Anadolu", featured: true, published: true },
  { slug: "gaziantep", name: "Gaziantep", locative: "Gaziantep'te", region: "Güneydoğu Anadolu", featured: true, published: true },
  { slug: "kocaeli", name: "Kocaeli", locative: "Kocaeli'nde", region: "Marmara", featured: true, published: true },
  { slug: "mersin", name: "Mersin", locative: "Mersin'de", region: "Akdeniz", featured: true, published: true },
  { slug: "kayseri", name: "Kayseri", locative: "Kayseri'de", region: "İç Anadolu", featured: true, published: true },
  { slug: "samsun", name: "Samsun", locative: "Samsun'da", region: "Karadeniz", featured: true, published: true },
  { slug: "eskisehir", name: "Eskişehir", locative: "Eskişehir'de", region: "İç Anadolu", featured: false, published: false },
  { slug: "diyarbakir", name: "Diyarbakır", locative: "Diyarbakır'da", region: "Güneydoğu Anadolu", featured: false, published: false },
  { slug: "sanliurfa", name: "Şanlıurfa", locative: "Şanlıurfa'da", region: "Güneydoğu Anadolu", featured: false, published: false },
  { slug: "denizli", name: "Denizli", locative: "Denizli'de", region: "Ege", featured: false, published: false },
  { slug: "sakarya", name: "Sakarya", locative: "Sakarya'da", region: "Marmara", featured: false, published: false },
  { slug: "tekirdag", name: "Tekirdağ", locative: "Tekirdağ'da", region: "Marmara", featured: false, published: false },
  { slug: "manisa", name: "Manisa", locative: "Manisa'da", region: "Ege", featured: false, published: false },
  { slug: "balikesir", name: "Balıkesir", locative: "Balıkesir'de", region: "Marmara", featured: false, published: false },
];

export const featuredCities = cities.filter((c) => c.featured);
export const publishedCities = cities.filter((c) => c.published);

export function getCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}
