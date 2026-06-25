import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { pk, timestamps } from "./shared";
import { flaggedIpStatus } from "./enums";

/** Stored shape of a scored fraud signal (mirrors lib/click-protection FraudReason). */
type FraudReasonRecord = { code: string; label: string; weight: number };

/**
 * One row per Google-Ads / landing visit. The visit is created on first hit
 * (source + network + fingerprint); the behavioral columns are filled in later
 * by the engagement endpoint, after which the detection engine (re)computes
 * `fraud_score` / `fraud_reasons`. IP-intelligence columns are denormalized from
 * `ip_intel` for fast filtering.
 *
 * KEY FILTER: `gclid` present ⇒ the visitor came from a paid Google Ads click.
 */
export const adVisits = pgTable(
  "ad_visits",
  {
    id: pk(),

    // --- Google Ads click identifiers ---
    gclid: text("gclid"),
    gbraid: text("gbraid"), // iOS web-to-app
    wbraid: text("wbraid"), // iOS app-to-web

    // --- network ---
    ipAddress: text("ip_address").notNull(),
    userAgent: text("user_agent"),
    referrer: text("referrer"),
    landingPage: text("landing_page"),

    // --- campaign ---
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmTerm: text("utm_term"),
    utmContent: text("utm_content"),

    // --- session + device fingerprint ---
    sessionId: text("session_id"),
    fingerprintHash: text("fingerprint_hash"),
    screen: text("screen"), // "1920x1080"
    timezone: text("timezone"),
    language: text("language"),
    platform: text("platform"),
    hardwareConcurrency: integer("hardware_concurrency"),
    hasCanvas: boolean("has_canvas"), // canvas/webgl fingerprint produced a value

    // --- behavioral (updated by the engagement endpoint) ---
    timeOnPage: integer("time_on_page"), // seconds
    mouseMoved: boolean("mouse_moved"),
    maxScrollDepth: integer("max_scroll_depth"), // 0-100
    clickCount: integer("click_count").default(0).notNull(),
    converted: boolean("converted").default(false).notNull(),

    // --- IP intelligence snapshot (denormalized from ip_intel) ---
    isDatacenter: boolean("is_datacenter"),
    isVpn: boolean("is_vpn"),
    isProxy: boolean("is_proxy"),
    country: text("country"),
    isp: text("isp"),

    // --- scoring ---
    fraudScore: integer("fraud_score").default(0).notNull(),
    fraudReasons: jsonb("fraud_reasons").$type<FraudReasonRecord[]>(),

    ...timestamps,
  },
  (t) => [
    index("ad_visits_ip_idx").on(t.ipAddress),
    index("ad_visits_gclid_idx").on(t.gclid),
    // One row per session (the ad landing). Capture + client + engagement upsert
    // onto this key; cumulative behavioral metrics are merged in.
    uniqueIndex("ad_visits_session_uniq").on(t.sessionId),
    index("ad_visits_fingerprint_idx").on(t.fingerprintHash),
    index("ad_visits_created_idx").on(t.createdAt),
    index("ad_visits_score_idx").on(t.fraudScore),
  ],
);

/**
 * Aggregated, reviewable record — one row per IP. Maintained by the hourly
 * aggregate job and by manual admin actions. `status = whitelisted` (or any IP
 * with conversions) is protected from auto-exclusion.
 */
export const flaggedIps = pgTable(
  "flagged_ips",
  {
    id: pk(),
    ipAddress: text("ip_address").notNull(),
    totalClicks: integer("total_clicks").default(0).notNull(), // ad clicks (gclid)
    totalConversions: integer("total_conversions").default(0).notNull(),
    fraudScore: integer("fraud_score").default(0).notNull(),
    reasons: jsonb("reasons").$type<FraudReasonRecord[]>(),
    firstSeen: timestamp("first_seen", { withTimezone: true }),
    lastSeen: timestamp("last_seen", { withTimezone: true }),
    status: flaggedIpStatus("status").default("watching").notNull(),
    manuallyReviewed: boolean("manually_reviewed").default(false).notNull(),
    notes: text("notes"),

    // IP intelligence snapshot
    isDatacenter: boolean("is_datacenter"),
    isVpn: boolean("is_vpn"),
    isProxy: boolean("is_proxy"),
    country: text("country"),
    isp: text("isp"),

    ...timestamps,
  },
  (t) => [
    uniqueIndex("flagged_ips_ip_idx").on(t.ipAddress),
    index("flagged_ips_status_idx").on(t.status),
    index("flagged_ips_score_idx").on(t.fraudScore),
    index("flagged_ips_last_seen_idx").on(t.lastSeen),
  ],
);

/**
 * Per-IP intelligence cache (Part 3). Looked up once per IP and reused so the
 * provider (IPinfo / ip-api / ...) is never queried twice for the same address.
 * `fetched_at` drives TTL re-lookups; `raw` keeps the full provider response.
 */
export const ipIntel = pgTable(
  "ip_intel",
  {
    id: pk(),
    ipAddress: text("ip_address").notNull(),
    provider: text("provider").notNull(), // ipinfo | ip-api | ...
    isDatacenter: boolean("is_datacenter").default(false).notNull(),
    isVpn: boolean("is_vpn").default(false).notNull(),
    isProxy: boolean("is_proxy").default(false).notNull(),
    country: text("country"),
    isp: text("isp"),
    raw: jsonb("raw").$type<Record<string, unknown>>(),
    fetchedAt: timestamp("fetched_at", { withTimezone: true }).defaultNow().notNull(),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("ip_intel_ip_idx").on(t.ipAddress),
    index("ip_intel_fetched_idx").on(t.fetchedAt),
  ],
);
