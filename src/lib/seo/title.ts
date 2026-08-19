import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/**
 * Title budget. Google truncates the SERP title around 580–600px, which for
 * Turkish text (wide diacritics: ğ, ş, ı, İ, ç, ö, ü) lands near 60 characters.
 * 62 is the last length that reliably survives.
 */
export const TITLE_MAX = 62;

/**
 * The root layout sets `template: "%s | Hasarlı Araç Alan"`, which appends the
 * brand to every page. That is normally right — the brand string is also the
 * primary keyword ("hasarlı araç alan", 390/mo) — but it creates two problems
 * the crawl surfaced:
 *
 *   1. 52 of 80 live titles exceeded the budget and truncate in results.
 *   2. 15 carried the brand twice, e.g.
 *      "Samsun Hasarlı Araç Alan — Karadeniz'de Kazalı Araç Alımı | Hasarlı Araç Alan"
 *      because the page title legitimately contains the phrase already.
 *
 * `seoTitle` decides per page whether the suffix earns its 21 characters:
 *
 *   - already contains the brand  -> absolute, no suffix (kills the repeat)
 *   - fits inside the budget      -> plain string, template appends as usual
 *   - would overflow              -> absolute, no suffix, so the words that
 *                                    carry the query survive instead of the brand
 *
 * Returning `{ absolute }` is what stops Next from applying the template.
 */
export function seoTitle(core: string): Metadata["title"] {
  const title = core.trim();
  const brand = siteConfig.brandName;
  const withSuffix = `${title} | ${brand}`;

  const alreadyBranded = title.toLocaleLowerCase("tr").includes(brand.toLocaleLowerCase("tr"));
  if (alreadyBranded) return { absolute: title };
  if (withSuffix.length <= TITLE_MAX) return title;

  return { absolute: title };
}

/**
 * Meta descriptions truncate near 155–160 characters. Anything longer is
 * silently cut mid-sentence, so trim on a word boundary instead.
 */
export const DESCRIPTION_MAX = 158;

export function seoDescription(text: string): string {
  const d = text.trim().replace(/\s+/g, " ");
  if (d.length <= DESCRIPTION_MAX) return d;
  const cut = d.slice(0, DESCRIPTION_MAX);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : DESCRIPTION_MAX).replace(/[.,;:—-]$/, "")}…`;
}
