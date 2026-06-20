"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/tracking/attribution";
import { readConsent } from "@/lib/consent/consent";
import { applyConsentMode, pushEvent, type TrackEvent } from "@/lib/tracking/events";

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
      const ev = el?.getAttribute("data-track");
      if (ev) pushEvent(ev as TrackEvent);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
