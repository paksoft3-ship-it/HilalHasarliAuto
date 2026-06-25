/**
 * ── TUNING SURFACE ───────────────────────────────────────────────────────────
 * Every weight, threshold and signal parameter lives here. Adjust these and
 * redeploy to retune detection without touching `scoring.ts`. This is the file
 * to review/iterate on first.
 */

/** Points added per signal. Set any weight to 0 to disable that signal. */
export const FRAUD_WEIGHTS = {
  // ── per-visit ──
  zeroEngagement: 30, // <3s AND no mouse AND no scroll
  botUserAgent: 40, // headless / HTTP-lib / crawler UA
  suspiciousFingerprint: 20, // no canvas / headless signature
  datacenterIp: 40, // hosting / datacenter IP
  anonymizerIp: 20, // VPN / proxy (beyond the spec — set 0 to ignore)
  impossibleBehavior: 25, // clicks recorded but mouse never moved
  noClientEngagement: 30, // gclid server-logged but no client record within window (no-JS bot)
  // ── per-IP aggregate ──
  manyClicksNoConversion: 30, // >5 ad clicks / 24h, 0 conversions
  fingerprintIpRotation: 35, // one fingerprint across many IPs
  clickVelocity: 30, // burst of clicks within seconds
  aggregateZeroEngagement: 40, // every visit from the IP is zero-engagement
} as const;

/**
 * Score → status. `gclid` present + flagged = highest priority (paid clicks).
 * v1 NEVER auto-excludes: `excluded` is only a high-confidence review hint
 * (`suggestsExclusion`). Moving an IP to "excluded" is a manual admin action.
 */
export const FRAUD_THRESHOLDS = {
  flagged: 75, // >= → status "flagged (needs review)"
  excluded: 85, // >= → high-confidence hint only (no auto-action in v1)
} as const;

/** Signal trigger parameters. */
export const SIGNAL_PARAMS = {
  zeroEngagementMaxSeconds: 3,
  impossibleMinClicks: 3, // "high" click count with no mouse
  manyClicksMin: 5, // strictly greater than this triggers (i.e. 6+)
  manyClicksWindowHours: 24,
  velocityWindowSeconds: 10,
  velocityMinClicks: 3, // >= this many clicks inside the velocity window
  fingerprintRotationMinIps: 3, // same fingerprint on >= this many IPs
  aggregateZeroEngagementMinClicks: 5,
  /** A server-captured ad hit with no client engagement after this many seconds
   *  is treated as a no-JS bot. */
  noClientEngagementSeconds: 10,
} as const;

/**
 * Real-lead protection. Any IP/visit protected by a (recent) conversion can
 * never exceed this score and is never auto-flagged — forced to "watching" for
 * manual review. Keep below FRAUD_THRESHOLDS.flagged.
 */
export const CONVERTED_SCORE_CAP = 30;

/**
 * Hard protection window: an IP that converted within this many days is NEVER
 * flagged, regardless of new visit behavior (real-lead protection).
 */
export const CONVERSION_PROTECTION_DAYS = 90;

/** IP-intelligence re-lookup TTL — cached results older than this are refreshed. */
export const IP_INTEL_TTL_DAYS = 30;

/** Visit-log retention (Part 5 / KVKK). Rows older than this are auto-purged. */
export const VISIT_RETENTION_DAYS = 90;

/**
 * Known non-human user agents: headless browsers, automation, HTTP libraries,
 * and crawlers. A legitimate ad click never carries these.
 */
export const BOT_UA_PATTERNS: RegExp[] = [
  /headless/i,
  /phantomjs/i,
  /electron/i,
  /puppeteer/i,
  /playwright/i,
  /selenium/i,
  /webdriver/i,
  /python-requests/i,
  /aiohttp/i,
  /httpx/i,
  /\bcurl\//i,
  /\bwget\b/i,
  /libwww/i,
  /scrapy/i,
  /node-fetch/i,
  /\baxios\//i,
  /go-http-client/i,
  /okhttp/i,
  /java\//i,
  /\bbot\b/i,
  /crawler/i,
  /spider/i,
  /slurp/i,
  /bingbot/i,
  /yandexbot/i,
  /ahrefsbot/i,
  /semrushbot/i,
  /mj12bot/i,
  /dotbot/i,
  /facebookexternalhit/i,
];

/**
 * Your own / internal IPs — never logged or scored (Part 5). Comma-separated
 * env list, e.g. CLICK_PROTECTION_INTERNAL_IPS="1.2.3.4,5.6.7.8".
 */
export function internalIps(): string[] {
  return (process.env.CLICK_PROTECTION_INTERNAL_IPS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** True for traffic that must be excluded from logging/scoring entirely. */
export function isInternalIp(ip: string): boolean {
  return internalIps().includes(ip);
}
