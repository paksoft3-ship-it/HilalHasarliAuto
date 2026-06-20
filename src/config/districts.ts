/**
 * District seed data. A district page is published only when it has unique
 * approved content (master prompt) — so we seed a curated set for major cities
 * rather than auto-generating all districts.
 */
export interface District {
  slug: string;
  name: string;
  citySlug: string;
}

export const districts: District[] = [
  // İstanbul
  { slug: "kadikoy", name: "Kadıköy", citySlug: "istanbul" },
  { slug: "umraniye", name: "Ümraniye", citySlug: "istanbul" },
  { slug: "basaksehir", name: "Başakşehir", citySlug: "istanbul" },
  { slug: "pendik", name: "Pendik", citySlug: "istanbul" },
  { slug: "bagcilar", name: "Bağcılar", citySlug: "istanbul" },
  { slug: "esenyurt", name: "Esenyurt", citySlug: "istanbul" },
  // Ankara
  { slug: "cankaya", name: "Çankaya", citySlug: "ankara" },
  { slug: "kecioren", name: "Keçiören", citySlug: "ankara" },
  { slug: "yenimahalle", name: "Yenimahalle", citySlug: "ankara" },
  { slug: "etimesgut", name: "Etimesgut", citySlug: "ankara" },
  // İzmir
  { slug: "bornova", name: "Bornova", citySlug: "izmir" },
  { slug: "karsiyaka", name: "Karşıyaka", citySlug: "izmir" },
  { slug: "buca", name: "Buca", citySlug: "izmir" },
  { slug: "konak", name: "Konak", citySlug: "izmir" },
  // Bursa
  { slug: "nilufer", name: "Nilüfer", citySlug: "bursa" },
  { slug: "osmangazi", name: "Osmangazi", citySlug: "bursa" },
];

export function districtsOfCity(citySlug: string): District[] {
  return districts.filter((d) => d.citySlug === citySlug);
}

export function getDistrict(citySlug: string, districtSlug: string): District | undefined {
  return districts.find((d) => d.citySlug === citySlug && d.slug === districtSlug);
}
