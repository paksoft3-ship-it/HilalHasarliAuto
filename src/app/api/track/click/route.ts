import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { isDbConfigured, requireDb } from "@/db";
import { criticalEvents } from "@/db/schema";

export const runtime = "nodejs";

const NO_CONTENT = new Response(null, { status: 204 });

/** CTA click events we count first-party. Mirrors FIRST_PARTY_CLICK_EVENTS. */
const ALLOWED = new Set(["phone_click", "whatsapp_click", "quote_click"]);

/**
 * Lightweight, anonymous CTA-click counter. The public site beacons here when a
 * visitor taps Ara / WhatsApp / Hemen Teklif Al, so the admin can see raw click
 * counts (Analytics → Kritik Olaylar) without depending on GTM/GA4. No PII, no
 * IP, no cookie is stored — only the event name + location + path.
 */
export async function POST(req: NextRequest) {
  if (!isDbConfigured) return NO_CONTENT;

  let body: Record<string, unknown>;
  try {
    const text = await req.text();
    body = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    return NO_CONTENT;
  }

  const event = String(body.event ?? "").trim();
  if (!ALLOWED.has(event)) return NO_CONTENT;

  try {
    await requireDb().insert(criticalEvents).values({
      name: event,
      dedupeId: `click_${randomUUID()}`, // unique → every click counts
      pageUrl: typeof body.path === "string" ? body.path.slice(0, 500) : null,
      sessionId: typeof body.sessionId === "string" ? body.sessionId.slice(0, 100) : null,
      payload: {
        location: typeof body.location === "string" ? body.location.slice(0, 100) : null,
      },
    });
  } catch (err) {
    console.error("[track/click]", err instanceof Error ? err.message : err);
  }
  return NO_CONTENT;
}
