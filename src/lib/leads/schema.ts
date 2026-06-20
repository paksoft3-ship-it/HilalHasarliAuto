import { z } from "zod";

/** Normalize a Turkish phone to digits (strip spaces, +90, leading 0). */
export function normalizePhone(raw: string): string {
  let d = raw.replace(/[^\d]/g, "");
  if (d.startsWith("90")) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  return d; // expected 10 digits: 5XXXXXXXXX or area code
}

const phoneField = z
  .string()
  .trim()
  .min(1, "Telefon numarası gereklidir.")
  .refine((v) => normalizePhone(v).length === 10, {
    message: "Geçerli bir telefon numarası girin.",
  });

/** Homepage / service hero quick-offer form. */
export const quickOfferSchema = z.object({
  fullName: z.string().trim().min(2, "Adınızı ve soyadınızı girin."),
  phone: phoneField,
  brand: z.string().trim().min(1, "Araç markasını girin."),
  model: z.string().trim().min(1, "Araç modelini girin."),
  damage: z.string().trim().min(1, "Hasar durumunu seçin."),
  city: z.string().trim().min(1, "Bulunduğunuz ili seçin."),
  consent: z
    .union([z.literal("on"), z.literal(true), z.boolean()])
    .refine((v) => v === "on" || v === true, {
      message: "Devam etmek için aydınlatma metnini onaylayın.",
    }),
  // Anti-spam — must stay empty (honeypot).
  company: z.string().max(0).optional().or(z.literal("")),
  // Source context (non-sensitive).
  source: z.string().optional(),
});

export type QuickOfferInput = z.infer<typeof quickOfferSchema>;

export const damageOptions = [
  "Kazalı / Hasarlı",
  "Pert",
  "Ağır Hasarlı",
  "Motor Arızalı",
  "Mekanik Arızalı",
  "Çalışmıyor",
  "Yanmış",
  "Sel Hasarlı",
  "Hurda",
  "Çekme Belgeli",
  "Diğer",
] as const;
