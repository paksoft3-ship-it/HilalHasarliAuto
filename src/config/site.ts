/**
 * Central site configuration.
 *
 * Per the master prompt, brand & contact information must never be hardcoded
 * across components and must be editable later from Admin → Settings.
 *
 * For now these resolve from environment variables with typed placeholder
 * fallbacks. In a later phase this module is replaced/hydrated by the
 * `site_settings` database table (same shape), so callers never change.
 */

function env(key: string, fallback: string): string {
  const v = process.env[key];
  return v && v.trim() ? v.trim() : fallback;
}

export const siteConfig = {
  brandName: env("NEXT_PUBLIC_BRAND_NAME", "Hasarlı Araç Alan"),
  brandTagline: "Hasarlı Araç Alım Merkezi",
  domain: env("NEXT_PUBLIC_DOMAIN", "https://hasarliaracalan.com"),

  // Contact — placeholders until confirmed. 0850 call number and WhatsApp
  // are intentionally separate settings (master prompt §2).
  phoneDisplay: env("NEXT_PUBLIC_PHONE_DISPLAY", "0555 198 06 40"),
  phoneE164: env("NEXT_PUBLIC_PHONE_E164", "+905551980640"),
  whatsappE164: env("NEXT_PUBLIC_WHATSAPP_E164", "+905551980640"),
  email: env("NEXT_PUBLIC_EMAIL", "info@hasarliaracalan.com"),
  workingHours: env("NEXT_PUBLIC_WORKING_HOURS", "7/24 İletişim"),

  // Social profiles — empty string = not active yet (shown disabled in footer).
  social: {
    instagram: env("NEXT_PUBLIC_INSTAGRAM", "https://www.instagram.com/hasarliaracalan/"),
    facebook: env("NEXT_PUBLIC_FACEBOOK", ""),
    x: env("NEXT_PUBLIC_X", ""),
    youtube: env("NEXT_PUBLIC_YOUTUBE", ""),
    linkedin: env("NEXT_PUBLIC_LINKEDIN", ""),
  },

  // Legal / company — shown only where real data exists.
  legalCompanyName: env("NEXT_PUBLIC_LEGAL_COMPANY_NAME", "[ŞİRKET ÜNVANI]"),
  companyAddress: env("NEXT_PUBLIC_COMPANY_ADDRESS", "[ŞİRKET ADRESİ]"),
  taxInfo: env("NEXT_PUBLIC_TAX_INFO", "[VERGİ DAİRESİ / NO]"),
  mersisNumber: env("NEXT_PUBLIC_MERSIS", "[MERSİS NO]"),
  kepAddress: env("NEXT_PUBLIC_KEP", "[KEP ADRESİ]"),
} as const;

export type SiteConfig = typeof siteConfig;

/** wa.me deep link with a prefilled, context-aware (non-sensitive) message. */
export function whatsappLink(message?: string): string {
  const num = siteConfig.whatsappE164.replace(/[^\d]/g, "");
  const base = `https://wa.me/${num}`;
  const text =
    message ??
    `Merhaba, aracım için değerlendirme talep etmek istiyorum.`;
  return `${base}?text=${encodeURIComponent(text)}`;
}

/** tel: link from the configured 0850 number. */
export function telLink(): string {
  return `tel:${siteConfig.phoneE164.replace(/[^\d+]/g, "")}`;
}
