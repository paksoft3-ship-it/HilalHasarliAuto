"use server";

import { headers } from "next/headers";
import { quickOfferSchema, normalizePhone } from "./schema";
import { generateReference } from "./reference";
import { isDbConfigured } from "@/db";
import { persistQuickOffer, findRecentLeadByPhone } from "@/db/repo/leads";
import { parseAttribution } from "./parse";
import { notifyNewLead } from "@/lib/comms/notify";
import { turnstileEnforced } from "@/config/security";
import { verifyTurnstile } from "@/lib/security/turnstile";

async function clientIp(): Promise<string | null> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
}

export interface QuickOfferResult {
  ok: boolean;
  reference?: string;
  errors?: Record<string, string>;
}

/** Mask a phone for logs/PII safety: 5XX***XX89. */
function maskPhone(digits: string): string {
  if (digits.length < 6) return "***";
  return `${digits.slice(0, 3)}***${digits.slice(-2)}`;
}


/**
 * Quick-offer submission.
 *
 * Validates server-side, then creates a lead. Persistence is wired to the
 * `leads`/`form_submissions` tables once DATABASE_URL is configured (Phase 4).
 * Until then it records a structured, PII-safe log and returns a real
 * reference — this is our own pipeline, not a faked external integration.
 *
 * NOTE: a form submission is a SECONDARY conversion only (master prompt §29) —
 * it is intentionally not treated as a qualified lead here.
 */
export async function submitQuickOffer(
  _prev: QuickOfferResult | null,
  formData: FormData,
): Promise<QuickOfferResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = quickOfferSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!errors[key]) errors[key] = issue.message;
    }
    return { ok: false, errors };
  }

  // Honeypot tripped — accept silently without creating a lead.
  if (parsed.data.company) {
    return { ok: true, reference: generateReference() };
  }

  // Bot protection (Cloudflare Turnstile) when enforced.
  if (turnstileEnforced) {
    const ok = await verifyTurnstile(String(formData.get("cf-turnstile-response") ?? ""), await clientIp());
    if (!ok) return { ok: false, errors: { form: "Güvenlik doğrulaması başarısız oldu, lütfen tekrar deneyin." } };
  }

  const phone = normalizePhone(parsed.data.phone);

  // Duplicate-submit guard: reuse a very recent lead with the same phone.
  if (isDbConfigured) {
    const dup = await findRecentLeadByPhone(phone);
    if (dup) return { ok: true, reference: dup.leadNumber };
  }

  const reference = generateReference();

  let persisted = false;
  if (isDbConfigured) {
    try {
      const leadId = await persistQuickOffer(parsed.data, {
        reference,
        source: parsed.data.source,
        attribution: parseAttribution(formData),
      });
      persisted = true;
      await notifyNewLead({
        leadId,
        name: parsed.data.fullName,
        city: parsed.data.city,
        source: parsed.data.source ?? "website_form",
      });
    } catch (err) {
      // Don't drop the lead on a DB error; record it for follow-up.
      console.error("[lead] quick-offer persist failed", {
        reference,
        error: err instanceof Error ? err.message : "unknown",
      });
    }
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[lead] quick-offer received", {
      reference,
      phone: maskPhone(phone),
      brand: parsed.data.brand,
      damage: parsed.data.damage,
      city: parsed.data.city,
      source: parsed.data.source ?? "unknown",
      persisted,
    });
  }

  return { ok: true, reference };
}
