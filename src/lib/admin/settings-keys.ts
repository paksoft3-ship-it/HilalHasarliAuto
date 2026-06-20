/** Editable site-settings keys (brand & contact). Plain module — importable by
 *  both the "use server" action and the settings page. */
export const SETTING_KEYS = [
  "brand.name",
  "brand.tagline",
  "contact.phoneDisplay",
  "contact.phoneE164",
  "contact.whatsappE164",
  "contact.email",
  "contact.workingHours",
  "contact.address",
] as const;
