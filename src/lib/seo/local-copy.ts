/**
 * Varied copy for city/district pages so each is genuinely unique (avoids
 * near-duplicate meta descriptions, titles and H1s that hurt SEO). A stable
 * per-slug index picks a variant deterministically.
 */
import type { City } from "@/config/cities";
import type { District } from "@/config/districts";

function pick<T>(slug: string, arr: T[]): T {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return arr[h % arr.length];
}

// ---- Cities ----
export function cityTitle(city: City): string {
  return pick(city.slug, [
    `${city.name} Hasarlı Araç Alımı`,
    `${city.name} Kazalı ve Hasarlı Araç Alan`,
    `${city.name} Hasarlı, Arızalı ve Hurda Araç Alımı`,
  ]);
}

export function cityDescription(city: City, districts: string[]): string {
  const d = districts.slice(0, 3).join(", ");
  return pick(city.slug, [
    `${city.locative} hasarlı, kazalı, pert ve çalışmayan araçlar için ücretsiz değerlendirme talebi oluşturun. ${city.region} bölgesinde konum ve araç durumuna göre süreç planlanır.`,
    `${city.name} ve çevresindeki hasarlı, motor arızalı, yanmış veya hurda araçlarınızı bulunduğunuz yerden değerlendiriyoruz. Fotoğraf gönderin, teklifinizi alın.`,
    d
      ? `${d} başta olmak üzere ${city.name} genelinde kazalı, ağır hasarlı ve çekme belgeli araçlar için değerleme. Güvenli devir ve ödeme süreci.`
      : `${city.name} genelinde kazalı, ağır hasarlı ve çekme belgeli araçlar için değerleme. Güvenli devir ve ödeme süreci.`,
    `${city.locative} aracınızı satmadan önce ücretsiz değerleme alın. ${city.region} için hızlı geri dönüş ve noter destekli güvenli işlem.`,
  ]);
}

export function cityH1(city: City): string {
  return pick(city.slug, [
    `${city.locative} Hasarlı ve Çalışmayan Araçlar İçin Teklif Alın`,
    `${city.name} Hasarlı Araç Alımında Güvenilir Çözüm`,
    `${city.locative} Kazalı, Arızalı ve Hurda Araç Alımı`,
  ]);
}

export function cityIntro(city: City): string {
  return pick(city.slug, [
    `${city.name} ve çevresindeki araçlar için değerlendirme talebi oluşturabilirsiniz. Konum ve araç durumuna göre hizmet planlaması yapılır.`,
    `${city.region} bölgesinde, ${city.name} içindeki hasarlı ve çalışmayan araçlar için fotoğraf paylaşarak hızlıca değerleme alabilirsiniz.`,
    `${city.locative} aracınızı uğraşmadan satmak için bilgilerinizi paylaşın; uzman ekibimiz değerlendirip sizinle iletişime geçsin.`,
  ]);
}

// ---- Districts ----
export function districtTitle(district: District, cityName: string): string {
  return pick(district.slug, [
    `${district.name} Hasarlı Araç Alımı (${cityName})`,
    `${cityName} ${district.name} Kazalı ve Hasarlı Araç Alan`,
    `${district.name} Arızalı ve Hurda Araç Alımı — ${cityName}`,
  ]);
}

export function districtDescription(district: District, cityName: string): string {
  return pick(district.slug, [
    `${cityName} ${district.name} bölgesinde hasarlı, kazalı ve çalışmayan araçlar için değerlendirme talebi oluşturun. Konuma göre teslim veya taşıma planlanır.`,
    `${district.name} ve çevresindeki motor arızalı, ağır hasarlı veya hurda araçlarınızı değerlendiriyoruz. Fotoğraf gönderin, ücretsiz teklif alın.`,
    `${district.name} (${cityName}) içinde aracınızı satmadan önce ücretsiz değerleme alın; güvenli devir ve ödeme süreci sunuyoruz.`,
  ]);
}

export function districtH1(district: District): string {
  return pick(district.slug, [
    `${district.name}’de Hasarlı ve Çalışmayan Araçlar İçin Teklif Alın`,
    `${district.name} Hasarlı Araç Alımı — Ücretsiz Değerlendirme`,
    `${district.name}’de Kazalı, Arızalı ve Hurda Araç Alımı`,
  ]);
}
