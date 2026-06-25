import { headers } from "next/headers";
import { captureServerVisit } from "@/db/repo/click-protection";
import { isInternalIp } from "@/lib/click-protection/config";
import { clientIp } from "@/lib/click-protection/request";

/**
 * Server-side first-touch capture (Part 1 + no-JS-bot signal). Renders nothing.
 * Only does work on ad-landing requests that middleware tagged with x-adv-*
 * (a Google click id was present), so organic page renders pay zero cost.
 * Captures gclid + IP + UA even when the visitor never runs JS — a later visit
 * row with no client engagement becomes the no_client_engagement signal.
 */
export async function AdVisitCapture() {
  const h = await headers();
  if (h.get("x-adv-capture") !== "1") return null;

  const sid = h.get("x-adv-sid");
  if (!sid) return null;

  const ip = clientIp((k) => h.get(k));
  if (isInternalIp(ip)) return null;

  try {
    await captureServerVisit({
      sessionId: sid,
      ipAddress: ip,
      gclid: h.get("x-adv-gclid"),
      gbraid: h.get("x-adv-gbraid"),
      wbraid: h.get("x-adv-wbraid"),
      userAgent: h.get("user-agent"),
      referrer: h.get("referer"),
      landingPage: h.get("x-adv-landing"),
      utmSource: h.get("x-adv-utm_source"),
      utmMedium: h.get("x-adv-utm_medium"),
      utmCampaign: h.get("x-adv-utm_campaign"),
      utmTerm: h.get("x-adv-utm_term"),
      utmContent: h.get("x-adv-utm_content"),
    });
  } catch (err) {
    console.error("[click-protection] server capture", err instanceof Error ? err.message : err);
  }
  return null;
}
