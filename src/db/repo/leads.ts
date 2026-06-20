import { requireDb, type Database } from "@/db";
import {
  leads, vehicles, formSubmissions, leadNotes, attributionTouches, criticalEvents,
} from "@/db/schema";
import type { QuickOfferInput } from "@/lib/leads/schema";
import type { FullQuoteInput } from "@/lib/leads/full-quote";
import { normalizePhone } from "@/lib/leads/schema";
import type { AttributionData, Touch } from "@/lib/tracking/attribution";

/** Recent lead with the same phone (duplicate-submit guard). */
export async function findRecentLeadByPhone(
  phoneNormalizedValue: string,
  withinMinutes = 10,
): Promise<{ id: string; leadNumber: string } | null> {
  const { eq, and, gte, isNull } = await import("drizzle-orm");
  const since = new Date(Date.now() - withinMinutes * 60_000);
  const [row] = await requireDb()
    .select({ id: leads.id, leadNumber: leads.leadNumber })
    .from(leads)
    .where(and(eq(leads.phoneNormalized, phoneNormalizedValue), gte(leads.createdAt, since), isNull(leads.deletedAt)))
    .limit(1);
  return row ?? null;
}

interface RequestMeta {
  reference: string;
  source?: string;
  ip?: string | null;
  userAgent?: string | null;
  attribution?: AttributionData | null;
}

function touchValues(leadId: string, touchType: "first" | "last", t: Touch, sessionId?: string) {
  return {
    leadId,
    touchType,
    gclid: t.gclid, gbraid: t.gbraid, wbraid: t.wbraid,
    fbclid: t.fbclid, ttclid: t.ttclid, msclkid: t.msclkid,
    utmSource: t.utm_source, utmMedium: t.utm_medium, utmCampaign: t.utm_campaign,
    utmTerm: t.utm_term, utmContent: t.utm_content,
    landingPage: t.landingPage, referrer: t.referrer, sessionId,
  };
}

/** Persist first/last attribution touches + the lead_created critical event.
 *  Best-effort: the lead is already saved, so an attribution failure here must
 *  never throw away the lead. */
async function writeAttributionAndEvent(
  db: Database,
  leadId: string,
  meta: RequestMeta,
) {
  try {
    const a = meta.attribution;
    if (a?.first) await db.insert(attributionTouches).values(touchValues(leadId, "first", a.first, a.sessionId));
    if (a?.last) await db.insert(attributionTouches).values(touchValues(leadId, "last", a.last, a.sessionId));
    await db.insert(criticalEvents).values({
    name: "lead_created",
    leadId,
    dedupeId: meta.reference,
    sessionId: a?.sessionId,
    pageUrl: a?.last?.landingPage,
    referrer: a?.last?.referrer,
    source: (a?.last ?? null) as Record<string, unknown> | null,
    payload: { source: meta.source ?? null },
    });
  } catch (err) {
    console.error("[lead] attribution/event write failed", err instanceof Error ? err.message : err);
  }
}

type Tri = "yes" | "no" | "unknown";
const tri = (v: string | undefined): Tri | null =>
  v === "yes" || v === "no" || v === "unknown" ? v : null;

const toInt = (v: string | undefined): number | null => {
  if (!v) return null;
  const n = parseInt(v.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : null;
};

/** Simple, explainable lead score (0–100). */
function scoreLead(opts: {
  hasPhone: boolean;
  vehicleFields: number; // count of provided vehicle fields
  hasLocation: boolean;
  photoCount: number;
}): number {
  let s = 0;
  if (opts.hasPhone) s += 40;
  if (opts.hasLocation) s += 15;
  s += Math.min(opts.vehicleFields, 5) * 6; // up to 30
  s += Math.min(opts.photoCount, 5) * 3; // up to 15
  return Math.min(s, 100);
}

/** Persist a homepage/service quick-offer lead (lead + vehicle + submission). */
export async function persistQuickOffer(input: QuickOfferInput, meta: RequestMeta) {
  const db = requireDb();
  const phoneNormalized = normalizePhone(input.phone);
  const score = scoreLead({
    hasPhone: phoneNormalized.length === 10,
    vehicleFields: [input.brand, input.model, input.damage].filter(Boolean).length,
    hasLocation: Boolean(input.city),
    photoCount: 0,
  });

  const [lead] = await db
    .insert(leads)
    .values({
      leadNumber: meta.reference,
      source: "website_form",
      fullName: input.fullName,
      phone: input.phone,
      phoneNormalized,
      city: input.city,
      score,
      firstTouchAt: new Date(),
    })
    .returning({ id: leads.id });

  await db.insert(vehicles).values({
    leadId: lead.id,
    brand: input.brand,
    model: input.model,
    category: input.damage,
  });

  await db.insert(formSubmissions).values({
    leadId: lead.id,
    type: "quick_offer",
    referenceNumber: meta.reference,
    source: meta.source ?? input.source,
    ip: meta.ip ?? undefined,
    userAgent: meta.userAgent ?? undefined,
    payload: {
      fullName: input.fullName,
      phone: input.phone,
      brand: input.brand,
      model: input.model,
      damage: input.damage,
      city: input.city,
    },
  });

  await writeAttributionAndEvent(db, lead.id, meta);
  return lead.id;
}

/** Persist a full multi-step quote lead (lead + detailed vehicle + submission). */
export async function persistFullQuote(input: FullQuoteInput, meta: RequestMeta) {
  const db = requireDb();
  const phoneNormalized = normalizePhone(input.phone);
  const photoCount = toInt(input.photoCount) ?? 0;
  const score = scoreLead({
    hasPhone: phoneNormalized.length === 10,
    vehicleFields: [input.brand, input.model, input.year, input.fuel, input.transmission, input.category].filter(Boolean).length,
    hasLocation: Boolean(input.city),
    photoCount,
  });

  const [lead] = await db
    .insert(leads)
    .values({
      leadNumber: meta.reference,
      source: "website_form",
      fullName: input.fullName,
      phone: input.phone,
      phoneNormalized,
      email: input.email || null,
      preferredContact: input.preferredContact,
      city: input.city,
      district: input.district || null,
      score,
      firstTouchAt: new Date(),
    })
    .returning({ id: leads.id });

  await db.insert(vehicles).values({
    leadId: lead.id,
    brand: input.brand,
    model: input.model,
    year: toInt(input.year),
    mileage: toInt(input.mileage),
    fuel: input.fuel || null,
    transmission: input.transmission || null,
    category: input.category,
    damageDescription: input.damageDescription,
    running: tri(input.running),
    starts: tri(input.starts),
    registrationStatus: input.registrationStatus || null,
    hasTowDoc: tri(input.hasTowDoc),
    photoCount,
  });

  await db.insert(formSubmissions).values({
    leadId: lead.id,
    type: "full_quote",
    referenceNumber: meta.reference,
    source: meta.source ?? input.source,
    ip: meta.ip ?? undefined,
    userAgent: meta.userAgent ?? undefined,
    payload: {
      brand: input.brand,
      model: input.model,
      year: input.year,
      category: input.category,
      running: input.running,
      city: input.city,
      district: input.district,
      photoCount,
    },
  });

  await writeAttributionAndEvent(db, lead.id, meta);
  return lead.id;
}

interface ContactInput {
  fullName: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  preferredContact?: "phone" | "whatsapp" | "email";
}

/** Persist a contact-form submission as a lead + note. */
export async function persistContact(input: ContactInput, meta: RequestMeta) {
  const db = requireDb();
  const phoneNormalized = normalizePhone(input.phone);

  const [lead] = await db
    .insert(leads)
    .values({
      leadNumber: meta.reference,
      source: "website_form",
      fullName: input.fullName,
      phone: input.phone,
      phoneNormalized,
      email: input.email || null,
      preferredContact: input.preferredContact,
      firstTouchAt: new Date(),
    })
    .returning({ id: leads.id });

  await db.insert(leadNotes).values({
    leadId: lead.id,
    body: `Konu: ${input.subject}\n\n${input.message}`,
  });

  await db.insert(formSubmissions).values({
    leadId: lead.id,
    type: "contact",
    referenceNumber: meta.reference,
    source: meta.source,
    ip: meta.ip ?? undefined,
    userAgent: meta.userAgent ?? undefined,
    payload: { subject: input.subject, preferredContact: input.preferredContact },
  });

  await writeAttributionAndEvent(db, lead.id, meta);
  return lead.id;
}
