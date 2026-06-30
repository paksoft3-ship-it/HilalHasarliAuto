"use client";

/** Shared visitor/session id — same one the click-protection capture uses
 *  (adv_sid cookie, else the cp_sid session-storage id). Lets the admin count
 *  unique vs repeat visitors without any new identifier. */
export function visitorId(): string | undefined {
  try {
    const m = document.cookie.match(/(?:^|; )adv_sid=([^;]*)/);
    if (m) return decodeURIComponent(m[1]!);
    return sessionStorage.getItem("cp_sid") ?? undefined;
  } catch {
    return undefined;
  }
}

/**
 * Fire-and-forget first-party event beacon to the click counter. Survives
 * navigation (sendBeacon / keepalive). Used both for CTA clicks and for form
 * submissions so the admin Button-Clicks report can count them first-party,
 * independent of GTM/GA4.
 */
export function beaconTrack(event: string, extra: Record<string, unknown> = {}): void {
  if (typeof navigator === "undefined") return;
  const payload = JSON.stringify({
    event,
    path: window.location.pathname,
    sessionId: visitorId(),
    ...extra,
  });
  try {
    if (navigator.sendBeacon) navigator.sendBeacon("/api/track/click", payload);
    else void fetch("/api/track/click", { method: "POST", body: payload, keepalive: true });
  } catch {
    /* never block the user action */
  }
}
