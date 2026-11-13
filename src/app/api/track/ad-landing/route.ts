import type { NextRequest } from "next/server";
import { isDbConfigured } from "@/db";
import { captureServerVisit } from "@/db/repo/click-protection";
import { isInternalIp } from "@/lib/click-protection/config";

export const runtime = "nodejs";

const NO_CONTENT = new Response(null, { status: 204 });
const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim().slice(0, 2048) : null);

/**
 * Server-side first-touch capture for Google Ads landings (gclid/gbraid/wbraid).
 * Called only by middleware (in the background, via waitUntil) so it also records
 * visitors that never run JavaScript — the no_client_engagement signal.
 *
 * It used to run inside the public layout (headers()), which forced EVERY public
 * page to render on every request. Moving it here lets the pages be cached.
 * The body carries the visitor IP, so the endpoint only accepts calls signed with
 * CRON_SECRET (known to middleware, never sent to browsers).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!isDbConfigured || !secret || req.headers.get("x-capture-secret") !== secret) return NO_CONTENT;

  let b: Record<string, unknown>;
  try {
    b = (await req.json()) as Record<string, unknown>;
  } catch {
    return NO_CONTENT;
  }
  const sessionId = str(b.sessionId);
  const ip = str(b.ip) ?? "0.0.0.0";
  if (!sessionId || isInternalIp(ip)) return NO_CONTENT;

  try {
    await captureServerVisit({
      sessionId,
      ipAddress: ip,
      gclid: str(b.gclid),
      gbraid: str(b.gbraid),
      wbraid: str(b.wbraid),
      userAgent: str(b.userAgent),
      referrer: str(b.referrer),
      landingPage: str(b.landingPage),
      utmSource: str(b.utm_source),
      utmMedium: str(b.utm_medium),
      utmCampaign: str(b.utm_campaign),
      utmTerm: str(b.utm_term),
      utmContent: str(b.utm_content),
    });
  } catch (err) {
    console.error("[click-protection] server capture", err instanceof Error ? err.message : err);
  }
  return NO_CONTENT;
}
