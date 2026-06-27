/** Tracking IDs — all configuration values (master prompt §12). Empty = off. */
export const tracking = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "",
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID ?? "",
  googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "",
  clarityId: process.env.NEXT_PUBLIC_CLARITY_ID ?? "",
} as const;

/** GTM/GA4 layer is loaded only when an ID is configured. */
export const analyticsConfigured = Boolean(tracking.gtmId || tracking.ga4Id);
