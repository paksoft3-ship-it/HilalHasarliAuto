import { createHmac, randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { isDbConfigured, requireDb } from "@/db";
import { criticalEvents } from "@/db/schema";
import { clientIp } from "@/lib/click-protection/request";
import { isInternalIp } from "@/lib/click-protection/config";

export const runtime = "nodejs";

const NO_CONTENT = new Response(null, { status: 204 });

/** CTA click events we count first-party. Mirrors FIRST_PARTY_CLICK_EVENTS. */
const ALLOWED = new Set(["phone_click", "whatsapp_click", "quote_click"]);

/** Pseudonymous IP fingerprint: salted HMAC, not the raw IP (KVKK-friendly).
 *  Equal IPs → equal hash (so the admin can count unique IPs and spot repeats)
 *  but the value is not reversible without the secret pepper. */
function hashIp(ip: string): string {
  const pepper = process.env.CRON_SECRET || "oto-nakit-click-pepper";
  return createHmac("sha256", pepper).update(ip).digest("hex").slice(0, 16);
}

/**
 * Lightweight first-party CTA-click counter. The public site beacons here when
 * a visitor taps Ara / WhatsApp / Hemen Teklif Al, so the admin can see raw
 * counts + unique/repeat visitors without depending on GTM/GA4. We store the
 * shared visitor session id and a *hashed* IP — never the raw IP or a cookie.
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

  const ip = clientIp((k) => req.headers.get(k));
  const ipHash = ip && ip !== "0.0.0.0" && !isInternalIp(ip) ? hashIp(ip) : null;

  try {
    await requireDb().insert(criticalEvents).values({
      name: event,
      dedupeId: `click_${randomUUID()}`, // unique → every click counts
      pageUrl: typeof body.path === "string" ? body.path.slice(0, 500) : null,
      sessionId: typeof body.sessionId === "string" ? body.sessionId.slice(0, 100) : null,
      payload: {
        location: typeof body.location === "string" ? body.location.slice(0, 100) : null,
        ipHash,
      },
    });
  } catch (err) {
    console.error("[track/click]", err instanceof Error ? err.message : err);
  }
  return NO_CONTENT;
}
