/**
 * Public site settings shape + pure helpers. Client-safe (no DB import).
 * Defaults come from env-backed siteConfig; the DB (site_settings) overrides
 * them at request time via getPublicSettings() (server.ts).
 */
import { siteConfig } from "@/config/site";

export interface PublicSettings {
  brandName: string;
  brandTagline: string;
  phoneDisplay: string;
  phoneE164: string;
  whatsappE164: string;
  email: string;
  workingHours: string;
  address: string;
}

export const defaultPublicSettings: PublicSettings = {
  brandName: siteConfig.brandName,
  brandTagline: siteConfig.brandTagline,
  phoneDisplay: siteConfig.phoneDisplay,
  phoneE164: siteConfig.phoneE164,
  whatsappE164: siteConfig.whatsappE164,
  email: siteConfig.email,
  workingHours: siteConfig.workingHours,
  address: siteConfig.companyAddress,
};

export function telHref(s: Pick<PublicSettings, "phoneE164">): string {
  return `tel:${s.phoneE164.replace(/[^\d+]/g, "")}`;
}

export function whatsappHref(s: Pick<PublicSettings, "whatsappE164">, message?: string): string {
  const num = s.whatsappE164.replace(/[^\d]/g, "");
  const text = message ?? "Merhaba, aracım için değerlendirme talep etmek istiyorum.";
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
}
