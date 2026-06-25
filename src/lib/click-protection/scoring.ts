/**
 * Click-fraud scoring engine (pure). Two entry points:
 *   - `scoreVisit`        — per-visit signals (run after engagement is reported)
 *   - `scoreIpAggregate`  — per-IP signals (run by the hourly aggregate job)
 *
 * Both return a 0-100 score, the contributing reasons, and a suggested status.
 * Neither touches the DB; callers pass plain signal objects. Thresholds and
 * weights live in `config.ts`.
 *
 * v1 policy: NO auto-exclusion. The highest auto status is "flagged (needs
 * review)"; "excluded" is only ever set by a human in the admin review queue.
 */
import {
  FRAUD_WEIGHTS as W,
  FRAUD_THRESHOLDS as T,
  SIGNAL_PARAMS as P,
  CONVERTED_SCORE_CAP,
  BOT_UA_PATTERNS,
} from "./config";
import type {
  FraudReason,
  IpAggregateInput,
  IpIntel,
  ScoreResult,
  SuggestedStatus,
  VisitSignals,
} from "./types";

/** Turkish admin-facing labels for each reason code. */
const REASON_LABELS: Record<string, string> = {
  zero_engagement: "Etkileşimsiz ziyaret (süre < 3 sn, fare yok, kaydırma yok)",
  bot_user_agent: "Bilinen bot / otomasyon tarayıcı imzası",
  suspicious_fingerprint: "Eksik veya şüpheli cihaz parmak izi (canvas yok)",
  datacenter_ip: "Veri merkezi / hosting IP adresi",
  anonymizer_ip: "VPN / proxy IP adresi",
  impossible_behavior: "Tutarsız davranış (tıklama var, fare hareketi yok)",
  no_client_engagement: "Sunucuda kayıtlı reklam tıklaması, istemci yanıtı yok (JS çalışmadı)",
  many_clicks_no_conversion: "24 saatte 5+ reklam tıklaması, hiç dönüşüm yok",
  fingerprint_ip_rotation: "Aynı parmak izi birden çok IP'de (IP rotasyonu)",
  click_velocity: "Saniyeler içinde art arda çoklu tıklama",
  aggregate_zero_engagement: "Bu IP'nin tüm ziyaretlerinde sıfır etkileşim",
};

function reason(code: string, weight: number): FraudReason {
  return { code, label: REASON_LABELS[code] ?? code, weight };
}

function isBotUserAgent(ua?: string | null): boolean {
  if (!ua) return false;
  return BOT_UA_PATTERNS.some((re) => re.test(ua));
}

/**
 * Reduce reasons to a final result.
 * @param protect real-lead protection (converted, or converted within the
 *   protection window). Caps the score and forces "watching".
 */
function finalize(reasons: FraudReason[], protect: boolean): ScoreResult {
  let score = reasons.reduce((sum, r) => sum + r.weight, 0);
  let protectedLead = false;

  if (protect) {
    if (score > CONVERTED_SCORE_CAP) score = CONVERTED_SCORE_CAP;
    protectedLead = true;
  }
  score = Math.max(0, Math.min(100, score));

  const suggestedStatus: SuggestedStatus =
    !protect && score >= T.flagged ? "flagged" : "watching";
  const suggestsExclusion = !protect && score >= T.excluded;

  return { score, reasons, suggestedStatus, suggestsExclusion, protectedLead };
}

/** Shared datacenter / VPN-proxy signal (applies at both visit and IP level). */
function ipIntelReasons(intel?: IpIntel | null): FraudReason[] {
  if (!intel) return [];
  if (intel.isDatacenter) return [reason("datacenter_ip", W.datacenterIp)];
  if ((intel.isVpn || intel.isProxy) && W.anonymizerIp > 0) {
    return [reason("anonymizer_ip", W.anonymizerIp)];
  }
  return [];
}

/**
 * Score a single visit. Behavioral signals only fire once their data has been
 * reported (non-null), so the initial hit isn't penalised before the user has
 * had a chance to engage.
 */
export function scoreVisit(v: VisitSignals, intel?: IpIntel | null): ScoreResult {
  const reasons: FraudReason[] = [];

  // Zero engagement — only evaluable once time-on-page has been measured.
  if (
    v.timeOnPage != null &&
    v.timeOnPage < P.zeroEngagementMaxSeconds &&
    v.mouseMoved === false &&
    (v.maxScrollDepth ?? 0) === 0
  ) {
    reasons.push(reason("zero_engagement", W.zeroEngagement));
  }

  if (isBotUserAgent(v.userAgent)) {
    reasons.push(reason("bot_user_agent", W.botUserAgent));
  }

  // Suspicious fingerprint: client ran but produced no canvas, or an empty hash.
  if (v.hasCanvas === false || v.fingerprintHash === "") {
    reasons.push(reason("suspicious_fingerprint", W.suspiciousFingerprint));
  }

  reasons.push(...ipIntelReasons(intel));

  // Impossible behavior: clicks recorded but the mouse never moved.
  if (
    v.clickCount != null &&
    v.clickCount >= P.impossibleMinClicks &&
    v.mouseMoved === false
  ) {
    reasons.push(reason("impossible_behavior", W.impossibleBehavior));
  }

  // No-JS bot: paid click captured server-side, no client engagement in window.
  if (v.gclid && v.serverLoggedNoClient === true) {
    reasons.push(reason("no_client_engagement", W.noClientEngagement));
  }

  const protect = v.converted === true || v.ipConvertedRecently === true;
  return finalize(reasons, protect);
}

/**
 * Score an IP from windowed aggregates (hourly job). Mirrors the per-visit
 * datacenter signal so an IP's standing reflects both its behavior and network.
 */
export function scoreIpAggregate(a: IpAggregateInput, intel?: IpIntel | null): ScoreResult {
  const reasons: FraudReason[] = [];

  if (a.adClicks > P.manyClicksMin && a.conversions === 0) {
    reasons.push(reason("many_clicks_no_conversion", W.manyClicksNoConversion));
  }

  if (a.fingerprintMaxIpSpread >= P.fingerprintRotationMinIps) {
    reasons.push(reason("fingerprint_ip_rotation", W.fingerprintIpRotation));
  }

  if (a.maxClicksInVelocityWindow >= P.velocityMinClicks) {
    reasons.push(reason("click_velocity", W.clickVelocity));
  }

  if (
    a.adClicks >= P.aggregateZeroEngagementMinClicks &&
    a.totalVisits > 0 &&
    a.zeroEngagementVisits === a.totalVisits
  ) {
    reasons.push(reason("aggregate_zero_engagement", W.aggregateZeroEngagement));
  }

  reasons.push(...ipIntelReasons(intel));

  // Hard real-lead protection: converted within the protection window.
  return finalize(reasons, a.convertedInProtectionWindow);
}
