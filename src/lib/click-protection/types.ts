/** Click-fraud detection contracts. Scoring is pure: it consumes plain signal
 *  objects (no DB access) so it is trivially testable and tunable. */

/** A single scored fraud signal. `label` is the Turkish admin-facing reason. */
export interface FraudReason {
  code: string;
  label: string;
  weight: number;
}

/** Lifecycle status of a tracked IP (mirrors the flagged_ip_status enum). */
export type FlaggedStatus = "watching" | "flagged" | "excluded" | "whitelisted";

/**
 * What the engine *suggests*. v1 never auto-excludes: the highest auto status is
 * "flagged" (needs review). "excluded" is a manual admin decision only.
 */
export type SuggestedStatus = "watching" | "flagged";

/** IP-intelligence result from the swappable adapter (cached in `ip_intel`). */
export interface IpIntel {
  isDatacenter: boolean;
  isVpn: boolean;
  isProxy: boolean;
  country?: string | null;
  isp?: string | null;
}

/**
 * Per-visit signals fed to {@link scoreVisit}. Behavioral fields are `null`
 * until the engagement endpoint reports them, so a freshly-landed visit is
 * never penalised for "zero engagement".
 */
export interface VisitSignals {
  gclid?: string | null;
  ipAddress: string;
  userAgent?: string | null;
  fingerprintHash?: string | null;
  /** Did the client's canvas/webgl fingerprint produce a value? */
  hasCanvas?: boolean | null;
  timeOnPage?: number | null; // seconds
  mouseMoved?: boolean | null;
  maxScrollDepth?: number | null; // 0-100
  clickCount?: number | null;
  converted?: boolean | null;
  /** Server captured this ad hit but no client engagement arrived in the window. */
  serverLoggedNoClient?: boolean | null;
  /** This IP converted within the protection window (last N days) — real lead. */
  ipConvertedRecently?: boolean | null;
}

/**
 * Per-IP facts aggregated over a window. The hourly job computes these via SQL
 * and passes them to {@link scoreIpAggregate} — keeping the math out of the DB
 * layer and the scoring pure.
 */
export interface IpAggregateInput {
  ipAddress: string;
  windowHours: number;
  /** Visits with a gclid (paid clicks) in the window. */
  adClicks: number;
  conversions: number;
  totalVisits: number;
  zeroEngagementVisits: number;
  /** Most clicks observed from this IP within `velocityWindowSeconds`. */
  maxClicksInVelocityWindow: number;
  /** Max distinct IPs sharing a fingerprint that this IP also used (rotation). */
  fingerprintMaxIpSpread: number;
  /** This IP converted within CONVERSION_PROTECTION_DAYS — hard real-lead protection. */
  convertedInProtectionWindow: boolean;
}

export interface ScoreResult {
  /** 0-100, clamped. */
  score: number;
  reasons: FraudReason[];
  /** v1: "watching" or "flagged" — never auto-"excluded". */
  suggestedStatus: SuggestedStatus;
  /** Score reached the high-confidence band (>= excluded threshold). Review hint
   *  only — surfaced in the admin queue, never auto-actioned. */
  suggestsExclusion: boolean;
  /** Score was held down / forced to "watching" by (recent) real-lead conversion. */
  protectedLead: boolean;
}
