"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution } from "@/lib/tracking/attribution";
import { readConsent } from "@/lib/consent/consent";
import { applyConsentMode, pushEvent, CLICK_EVENT_VALUE, FIRST_PARTY_CLICK_EVENTS, type TrackEvent } from "@/lib/tracking/events";
import { beaconTrack } from "@/lib/tracking/beacon";

/** Fire-and-forget first-party CTA-click count (survives navigation). */
function beaconClick(event: TrackEvent, location: string | null) {
  beaconTrack(event, { location });
}

/** First-party page-view count so the admin sees ALL visitors, not just clickers. */
function beaconPageView() {
  beaconTrack("page_view");
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
