import type { FaqItem } from "@/config/faq";

/**
 * One FAQ per line, "Question | Answer". Keeps FAQ editing in a plain textarea
 * (no rich-text dependency) while still feeding the FAQPage schema + accordion.
 */
export function faqsToText(faqs: FaqItem[]): string {
  return faqs.map((f) => `${f.q} | ${f.a}`).join("\n");
}

export function textToFaqs(text: string): FaqItem[] {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const i = line.indexOf("|");
      if (i === -1) return null;
      const q = line.slice(0, i).trim();
      const a = line.slice(i + 1).trim();
      return q && a ? { q, a } : null;
    })
    .filter((f): f is FaqItem => f !== null);
}
