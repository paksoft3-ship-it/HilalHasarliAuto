"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/tracking/attribution";
import { readConsent } from "@/lib/consent/consent";
import { applyConsentMode, pushEvent, CLICK_EVENT_VALUE, type TrackEvent } from "@/lib/tracking/events";

/**
 * Public-site tracking bootstrap: capture attribution, re-apply stored consent
 * (Consent Mode), and delegate clicks on [data-track] elements to dataLayer
 * events (phone_click / whatsapp_click). Renders nothing.
 */
export function TrackingProvider() {
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
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
