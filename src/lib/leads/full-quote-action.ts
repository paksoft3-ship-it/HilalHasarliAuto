"use server";

import { fullQuoteSchema } from "./full-quote";
import { generateReference } from "./reference";
import { normalizePhone } from "./schema";
import { isDbConfigured } from "@/db";
import { persistFullQuote } from "@/db/repo/leads";
import { parseAttribution } from "./parse";
import { notifyNewLead } from "@/lib/comms/notify";

export interface FullQuoteResult {
  ok: boolean;
  reference?: string;
  errors?: Record<string, string>;
}

function maskPhone(d: string) {
  return d.length < 6 ? "***" : `${d.slice(0, 3)}***${d.slice(-2)}`;
}

export async function submitFullQuote(
  _prev: FullQuoteResult | null,
  formData: FormData,
): Promise<FullQuoteResult> {
  const parsed = fullQuoteSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) {
      const k = String(i.path[0] ?? "form");
      if (!errors[k]) errors[k] = i.message;
    }
    return { ok: false, errors };
  }
  if (parsed.data.company) return { ok: true, reference: generateReference() };

  const reference = generateReference();

  let persisted = false;
  if (isDbConfigured) {
    try {
      const leadId = await persistFullQuote(parsed.data, {
        reference,
        source: parsed.data.source,
        attribution: parseAttribution(formData),
      });
      persisted = true;
      await notifyNewLead({
        leadId,
        name: parsed.data.fullName,
        city: parsed.data.city,
        source: parsed.data.source ?? "get_offer",
      });
    } catch (err) {
      console.error("[lead] full-quote persist failed", {
        reference,
        error: err instanceof Error ? err.message : "unknown",
      });
    }
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[lead] full-quote received", {
      reference,
      phone: maskPhone(normalizePhone(parsed.data.phone)),
      brand: parsed.data.brand,
      category: parsed.data.category,
      running: parsed.data.running,
      city: parsed.data.city,
      photoCount: parsed.data.photoCount ?? "0",
      source: parsed.data.source ?? "get_offer",
      persisted,
    });
  }
  return { ok: true, reference };
}
