/**
 * Location SEO copy — thin adapter over the hand-written unique content in
 * config/local-data.ts. Every published city/district has its own metaTitle,
 * metaDescription, H1 and body there, so no two location pages share copy.
 * The generic fallbacks below only guard against a missing content entry.
 */
import type { City } from "@/config/cities";
import { getCityContent } from "@/config/local-data";

export function cityMetaTitle(city: City): string {
  return getCityContent(city.slug)?.metaTitle ?? `${city.name} Hasarlı Araç Alımı`;
}

export function cityMetaDescription(city: City): string {
  return (
    getCityContent(city.slug)?.metaDescription ??
    `${city.locative} hasarlı, kazalı, pert ve hurda araç alımı. Ücretsiz çekici, hızlı değerlendirme ve devirde nakit ödeme.`
  );
}

/** Meta keywords — uses the proper display name, not the ASCII slug. */
export function locationMetaKeywords(displayName: string): string {
  const n = displayName.toLocaleLowerCase("tr-TR");
  return [
    `${n} hasarlı araç alan`,
    `${n} kazalı araç alan`,
    `${n} pert araç alan`,
    `${n} hurda araç alımı`,
    `${n} araç alan`,
  ].join(", ");
}
