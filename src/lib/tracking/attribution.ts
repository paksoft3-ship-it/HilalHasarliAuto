/**
 * First-party attribution capture (master prompt §12). Stores first-touch and
 * last-touch click IDs + UTMs in a cookie, survives navigation, and is attached
 * to lead submissions. Click IDs are never written into canonical URLs.
 */

export const CLICK_PARAMS = [
  "gclid", "gbraid", "wbraid", "dclid", "fbclid", "ttclid", "msclkid",
] as const;
export const UTM_PARAMS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
] as const;

export interface Touch {
  [key: string]: string | undefined;
  landingPage?: string;
  referrer?: string;
  ts?: string;
}

export interface AttributionData {
  first?: Touch;
  last?: Touch;
  sessionId?: string;
}

const COOKIE = "on_attr";
const MAX_AGE = 60 * 60 * 24 * 90; // 90 days

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}
function writeCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${MAX_AGE}; samesite=lax`;
}

function touchFromLocation(): Touch {
  const t: Touch = {};
  const params = new URLSearchParams(window.location.search);
  for (const k of [...CLICK_PARAMS, ...UTM_PARAMS]) {
    const v = params.get(k);
    if (v) t[k] = v;
  }
  t.landingPage = window.location.pathname + window.location.search;
  t.referrer = document.referrer || undefined;
  t.ts = new Date().toISOString();
  return t;
}

function hasSignal(t: Touch): boolean {
  return [...CLICK_PARAMS, ...UTM_PARAMS].some((k) => t[k]);
}

/** Run on each page load: set first-touch once, refresh last-touch on new signals. */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  let data: AttributionData = {};
  try {
    const raw = readCookie(COOKIE);
    if (raw) data = JSON.parse(raw);
  } catch {
    data = {};
  }
  const current = touchFromLocation();
  if (!data.sessionId) {
    data.sessionId =
      (crypto.randomUUID && crypto.randomUUID()) ||
      Math.random().toString(36).slice(2);
  }
  if (!data.first) data.first = current;
  // Update last-touch only when the new visit carries attribution signals.
  if (hasSignal(current) || !data.last) data.last = current;
  writeCookie(COOKIE, JSON.stringify(data));
}

export function getAttribution(): AttributionData | null {
  const raw = readCookie(COOKIE);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AttributionData;
  } catch {
    return null;
  }
}
