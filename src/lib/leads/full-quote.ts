import { z } from "zod";
import { normalizePhone } from "./schema";

/** Full multi-step quote form (design.md §16 / page 02). */
export const fullQuoteSchema = z.object({
  // Step 1 — Araç Bilgileri
  brand: z.string().trim().min(1, "Marka gereklidir."),
  model: z.string().trim().min(1, "Model gereklidir."),
  year: z
    .string()
    .trim()
    .regex(/^(19|20)\d{2}$/, "Geçerli bir model yılı girin."),
  mileage: z.string().trim().optional().or(z.literal("")),
  fuel: z.string().trim().optional().or(z.literal("")),
  transmission: z.string().trim().optional().or(z.literal("")),

  // Step 2 — Hasar ve Durum
  category: z.string().trim().min(1, "Araç durumunu seçin."),
  damageDescription: z.string().trim().min(5, "Kısa bir açıklama girin."),
  running: z.enum(["yes", "no", "unknown"]),
  starts: z.enum(["yes", "no", "unknown"]).optional(),
  registrationStatus: z.string().trim().optional().or(z.literal("")),
  hasTowDoc: z.enum(["yes", "no", "unknown"]).optional(),

  // Step 3 — photos handled client-side / WhatsApp (no storage yet); count only.
  photoCount: z.string().optional(),

  // Step 4 — Konum ve İletişim
  city: z.string().trim().min(1, "İl seçin."),
  district: z.string().trim().optional().or(z.literal("")),
  fullName: z.string().trim().min(2, "Adınızı ve soyadınızı girin."),
  phone: z
    .string()
    .trim()
    .refine((v) => normalizePhone(v).length === 10, "Geçerli bir telefon girin."),
  email: z.string().trim().email("Geçerli bir e-posta girin.").optional().or(z.literal("")),
  preferredContact: z.enum(["phone", "whatsapp", "email"]).optional(),

  // Step 5 — consents
  consent: z
    .union([z.literal("on"), z.boolean()])
    .refine((v) => v === "on" || v === true, "Aydınlatma metnini onaylayın."),
  marketing: z.union([z.literal("on"), z.boolean()]).optional(),

  company: z.string().max(0).optional().or(z.literal("")), // honeypot
  source: z.string().optional(),
});

export type FullQuoteInput = z.infer<typeof fullQuoteSchema>;

/** Field groups per step — used for per-step client validation. */
export const stepFields: (keyof FullQuoteInput)[][] = [
  ["brand", "model", "year", "mileage", "fuel", "transmission"],
  ["category", "damageDescription", "running", "starts", "registrationStatus", "hasTowDoc"],
  ["photoCount"],
  ["city", "district", "fullName", "phone", "email", "preferredContact"],
  ["consent", "marketing"],
];

export const fuelOptions = ["Benzin", "Dizel", "LPG", "Hibrit", "Elektrik", "Diğer"];
export const transmissionOptions = ["Manuel", "Otomatik", "Yarı Otomatik"];
export const yesNoUnknown = [
  { v: "yes", l: "Evet" },
  { v: "no", l: "Hayır" },
  { v: "unknown", l: "Emin değilim" },
] as const;
