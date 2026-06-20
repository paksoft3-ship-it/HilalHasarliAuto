import { cache } from "react";
import { isDbConfigured, requireDb } from "@/db";
import { siteSettings } from "@/db/schema";
import { defaultPublicSettings, type PublicSettings } from "./shared";

const KEY_MAP: Record<string, keyof PublicSettings> = {
  "brand.name": "brandName",
  "brand.tagline": "brandTagline",
  "contact.phoneDisplay": "phoneDisplay",
  "contact.phoneE164": "phoneE164",
  "contact.whatsappE164": "whatsappE164",
  "contact.email": "email",
  "contact.workingHours": "workingHours",
  "contact.address": "address",
};

/**
 * Resolved public settings = env defaults overlaid with DB site_settings.
 * React-cached per request; falls back to env defaults if DB is unavailable.
 */
export const getPublicSettings = cache(async (): Promise<PublicSettings> => {
  if (!isDbConfigured) return defaultPublicSettings;
  try {
    const rows = await requireDb().select().from(siteSettings);
    const out: PublicSettings = { ...defaultPublicSettings };
    for (const r of rows) {
      const field = KEY_MAP[r.key];
      if (!field) continue;
      const val = typeof r.value === "string" ? r.value : r.value == null ? "" : String(r.value);
      if (val.trim()) out[field] = val.trim();
    }
    return out;
  } catch {
    return defaultPublicSettings;
  }
});
