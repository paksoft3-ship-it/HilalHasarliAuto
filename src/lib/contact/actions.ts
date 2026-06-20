"use server";

import { z } from "zod";
import { normalizePhone } from "@/lib/leads/schema";
import { generateReference } from "@/lib/leads/reference";
import { headers } from "next/headers";
import { isDbConfigured } from "@/db";
import { persistContact } from "@/db/repo/leads";
import { parseAttribution } from "@/lib/leads/parse";
import { notifyNewLead } from "@/lib/comms/notify";
import { turnstileEnforced } from "@/config/security";
import { verifyTurnstile } from "@/lib/security/turnstile";

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Adınızı ve soyadınızı girin."),
  phone: z
    .string()
    .trim()
    .min(1, "Telefon numarası gereklidir.")
    .refine((v) => normalizePhone(v).length === 10, {
      message: "Geçerli bir telefon numarası girin.",
    }),
  email: z
    .string()
    .trim()
    .email("Geçerli bir e-posta girin.")
    .optional()
    .or(z.literal("")),
  subject: z.string().trim().min(2, "Konu girin."),
  message: z.string().trim().min(10, "Mesajınızı biraz daha ayrıntılı yazın."),
  preferredContact: z.enum(["phone", "whatsapp", "email"]).optional(),
  consent: z
    .union([z.literal("on"), z.boolean()])
    .refine((v) => v === "on" || v === true, {
      message: "Devam etmek için aydınlatma metnini onaylayın.",
    }),
  company: z.string().max(0).optional().or(z.literal("")), // honeypot
});

export interface ContactResult {
  ok: boolean;
  reference?: string;
  errors?: Record<string, string>;
}

export async function submitContact(
  _prev: ContactResult | null,
  formData: FormData,
): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) {
      const k = String(i.path[0] ?? "form");
      if (!errors[k]) errors[k] = i.message;
    }
    return { ok: false, errors };
  }
  if (parsed.data.company) return { ok: true, reference: generateReference("CT") };

  if (turnstileEnforced) {
    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const ok = await verifyTurnstile(String(formData.get("cf-turnstile-response") ?? ""), ip);
    if (!ok) return { ok: false, errors: { form: "Güvenlik doğrulaması başarısız oldu, lütfen tekrar deneyin." } };
  }

  const reference = generateReference("CT");

  let persisted = false;
  if (isDbConfigured) {
    try {
      const leadId = await persistContact(
        {
          fullName: parsed.data.fullName,
          phone: parsed.data.phone,
          email: parsed.data.email || undefined,
          subject: parsed.data.subject,
          message: parsed.data.message,
          preferredContact: parsed.data.preferredContact,
        },
        { reference, source: "contact", attribution: parseAttribution(formData) },
      );
      persisted = true;
      await notifyNewLead({
        leadId,
        name: parsed.data.fullName,
        source: "contact",
      });
    } catch (err) {
      console.error("[contact] persist failed", {
        reference,
        error: err instanceof Error ? err.message : "unknown",
      });
    }
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[contact] message received", {
      reference,
      subject: parsed.data.subject,
      preferredContact: parsed.data.preferredContact ?? "unset",
      persisted,
    });
  }
  return { ok: true, reference };
}
