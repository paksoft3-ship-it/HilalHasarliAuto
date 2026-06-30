/** Typed dataLayer event layer + Google Consent Mode v2 helpers. */

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/** Conversion/event taxonomy (master prompt §12). */
export type TrackEvent =
  | "phone_click"
  | "whatsapp_click"
  | "quote_click"
  | "quote_form_start"
  | "quote_form_submit"
  | "service_page_engaged"
  | "guide_engaged";

/** Click events we also persist first-party (independent of GTM/GA4) so the
 *  admin can see raw counts before the detailed analytics layer is wired. */
export const FIRST_PARTY_CLICK_EVENTS = new Set<TrackEvent>([
  "phone_click",
  "whatsapp_click",
  "quote_click",
]);

/** Conversion value (TRY) per click event — used by GTM for value-based bidding. */
export const CLICK_EVENT_VALUE: Partial<Record<TrackEvent, number>> = {
  phone_click: 150,
  whatsapp_click: 120,
};

/** Events that count as a conversion for click-fraud lead-protection. */
const CONVERSION_EVENTS = new Set<TrackEvent>([
  "phone_click",
  "whatsapp_click",
  "quote_form_submit",
]);

export function pushEvent(event: TrackEvent, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });

  // Notify the click-protection tracker so it can flag the visit as converted
  // (real-lead protection). Decoupled via a DOM event — no import cycle.
  if (CONVERSION_EVENTS.has(event)) {
    window.dispatchEvent(new CustomEvent("cp:conversion", { detail: { event } }));
  }
}

export interface ConsentState {
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

/** Map our consent categories → Google Consent Mode v2 signals and push. */
export function applyConsentMode(c: ConsentState): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  const granted = "granted" as const;
  const denied = "denied" as const;
  // gtag() is just a dataLayer push with the arguments object.
  window.dataLayer.push([
    "consent",
    "update",
    {
      analytics_storage: c.analytics ? granted : denied,
      ad_storage: c.marketing ? granted : denied,
      ad_user_data: c.marketing ? granted : denied,
      ad_personalization: c.marketing ? granted : denied,
      functionality_storage: c.functional ? granted : denied,
      personalization_storage: c.functional ? granted : denied,
    },
  ]);
}
