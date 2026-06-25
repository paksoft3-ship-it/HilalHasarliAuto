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
  | "quote_form_start"
  | "quote_form_submit"
  | "contact_form_submit"
  | "service_page_engaged"
  | "guide_engaged";

/** Conversion value (TRY) per click event — used by GTM for value-based bidding. */
export const CLICK_EVENT_VALUE: Partial<Record<TrackEvent, number>> = {
  phone_click: 150,
  whatsapp_click: 120,
};

export function pushEvent(event: TrackEvent, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
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
