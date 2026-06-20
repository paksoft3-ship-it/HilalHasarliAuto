import { applyConsentMode } from "@/lib/tracking/events";

/** Cookie consent model + storage, wired to Google Consent Mode v2. */
export const CONSENT_VERSION = 1;
export const CONSENT_KEY = "on-cookie-consent";
export const OPEN_PREFS_EVENT = "on:open-cookie-preferences";

export interface ConsentState {
  necessary: true; // always on
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  version: number;
  timestamp: string;
  source: string;
}

export const CONSENT_CATEGORIES = [
  { id: "necessary", label: "Zorunlu", desc: "Sitenin çalışması için gereklidir; her zaman aktiftir.", locked: true },
  { id: "functional", label: "İşlevsel", desc: "Tercihlerinizi hatırlar ve deneyimi iyileştirir.", locked: false },
  { id: "analytics", label: "Analitik", desc: "Site kullanımını anonim olarak ölçmemize yardımcı olur.", locked: false },
  { id: "marketing", label: "Pazarlama", desc: "Reklam ölçümü ve kişiselleştirme için kullanılır.", locked: false },
] as const;

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(
  partial: Pick<ConsentState, "functional" | "analytics" | "marketing">,
  source: string,
): ConsentState {
  const state: ConsentState = {
    necessary: true,
    ...partial,
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    source,
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
  // Push Google Consent Mode v2 update.
  applyConsentMode({
    functional: state.functional,
    analytics: state.analytics,
    marketing: state.marketing,
  });
  window.dispatchEvent(new CustomEvent("on:consent-updated", { detail: state }));
  return state;
}

export function openCookiePreferences() {
  window.dispatchEvent(new Event(OPEN_PREFS_EVENT));
}
