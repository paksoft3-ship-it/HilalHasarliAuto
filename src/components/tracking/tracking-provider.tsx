"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution } from "@/lib/tracking/attribution";
import { readConsent } from "@/lib/consent/consent";
import { applyConsentMode, pushEvent, CLICK_EVENT_VALUE, FIRST_PARTY_CLICK_EVENTS, type TrackEvent } from "@/lib/tracking/events";

/** Shared visitor/session id — same one the click-protection capture uses
 *  (adv_sid cookie, else the cp_sid session-storage id). Lets the admin count
 *  unique vs repeat visitors without any new identifier. */
function visitorId(): string | undefined {
  try {
    const m = document.cookie.match(/(?:^|; )adv_sid=([^;]*)/);
    if (m) return decodeURIComponent(m[1]!);
    return sessionStorage.getItem("cp_sid") ?? undefined;
  } catch {
    return undefined;
  }
}

/** Fire-and-forget first-party CTA-click count (survives navigation). */
function beaconClick(event: TrackEvent, location: string | null) {
  if (typeof navigator === "undefined") return;
  const payload = JSON.stringify({ event, location, path: window.location.pathname, sessionId: visitorId() });
  try {
    if (navigator.sendBeacon) navigator.sendBeacon("/api/track/click", payload);
    else void fetch("/api/track/click", { method: "POST", body: payload, keepalive: true });
  } catch {
    /* never block the click */
  }
}

/** First-party page-view count so the admin sees ALL visitors, not just clickers. */
function beaconPageView() {
  if (typeof navigator === "undefined") return;
  const payload = JSON.stringify({ event: "page_view", path: window.location.pathname, sessionId: visitorId() });
  try {
    if (navigator.sendBeacon) navigator.sendBeacon("/api/track/click", payload);
    else void fetch("/api/track/click", { method: "POST", body: payload, keepalive: true });
  } catch {
    /* never block navigation */
  }
}

/**
 * Public-site tracking bootstrap: capture attribution, re-apply stored consent
 * (Consent Mode), and delegate clicks on [data-track] elements to dataLayer
 * events (phone_click / whatsapp_click) + a first-party click counter.
 * Renders nothing.
 */
export function TrackingProvider() {
  const pathname = usePathname();

  // Record a page view on first load and every client-side route change.
  useEffect(() => {
    beaconPageView();
  }, [pathname]);

  useEffect(() => {
    captureAttribution();

    const consent = readConsent();
    if (consent) {
      applyConsentMode({
        functional: consent.functional,
        analytics: consent.analytics,
        marketing: consent.marketing,
      });
    }

    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]");
      const ev = el?.getAttribute("data-track") as TrackEvent | null;
      if (!ev) return;
      const params: Record<string, unknown> = {};
      const value = CLICK_EVENT_VALUE[ev];
      if (value !== undefined) {
        params.value = value;
        params.currency = "TRY";
      }
      const location = el?.getAttribute("data-track-location");
      if (location) params.location = location;
      pushEvent(ev, params);

      // Persist a first-party count for the key CTAs, independent of GTM/GA4.
      if (FIRST_PARTY_CLICK_EVENTS.has(ev)) beaconClick(ev, location ?? null);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
