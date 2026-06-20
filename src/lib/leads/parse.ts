import type { AttributionData } from "@/lib/tracking/attribution";

/** Safely parse the client-supplied attribution hidden field. */
export function parseAttribution(formData: FormData): AttributionData | null {
  try {
    const raw = String(formData.get("attribution") ?? "");
    return raw ? (JSON.parse(raw) as AttributionData) : null;
  } catch {
    return null;
  }
}
