/**
 * Data access for the click-fraud system: visit capture (server + client +
 * engagement), dashboard aggregations, flagged-IP / visit listings, and exports.
 * All reads guard on `isDbConfigured`; writes assume the caller already did.
 */
import {
  and,
  desc,
  eq,
  gte,
  ilike,
  isNotNull,
  isNull,
  lte,
  sql,
} from "drizzle-orm";
import { isDbConfigured, requireDb } from "@/db";
import { adVisits, flaggedIps, siteSettings } from "@/db/schema";
import { FRAUD_THRESHOLDS } from "@/lib/click-protection/config";
import type { FlaggedStatus } from "@/lib/click-protection/types";

const FLAGGED = FRAUD_THRESHOLDS.flagged;

// ─────────────────────────── capture ───────────────────────────

export interface ServerVisitInput {
  sessionId: string;
  ipAddress: string;
  gclid?: string | null;
  gbraid?: string | null;
  wbraid?: string | null;
  userAgent?: string | null;
  referrer?: string | null;
  landingPage?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
}

/** Server-side first touch (no JS required). Creates the session's row; never
 *  clobbers richer client data if the client got there first. */
export async function captureServerVisit(v: ServerVisitInput): Promise<void> {
  if (!isDbConfigured || !v.sessionId) return;
  await requireDb()
    .insert(adVisits)
    .values({
      sessionId: v.sessionId,
      ipAddress: v.ipAddress,
      gclid: v.gclid ?? null,
      gbraid: v.gbraid ?? null,
      wbraid: v.wbraid ?? null,
      userAgent: v.userAgent ?? null,
      referrer: v.referrer ?? null,
      landingPage: v.landingPage ?? null,
      utmSource: v.utmSource ?? null,
      utmMedium: v.utmMedium ?? null,
      utmCampaign: v.utmCampaign ?? null,
      utmTerm: v.utmTerm ?? null,
      utmContent: v.utmContent ?? null,
    })
    .onConflictDoNothing({ target: adVisits.sessionId });
}

export interface ClientVisitInput {
  sessionId: string;
  ipAddress: string;
  userAgent?: string | null;
  gclid?: string | null;
  gbraid?: string | null;
  wbraid?: string | null;
  referrer?: string | null;
  landingPage?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  fingerprintHash?: string | null;
  screen?: string | null;
  timezone?: string | null;
  language?: string | null;
  platform?: string | null;
  hardwareConcurrency?: number | null;
  hasCanvas?: boolean | null;
}

/** Client enrichment (fingerprint + device). Upserts on the session row,
 *  filling in source/utm only if the server touch didn't already set them. */
export async function recordClientVisit(v: ClientVisitInput): Promise<void> {
  if (!isDbConfigured || !v.sessionId) return;
  await requireDb()
    .insert(adVisits)
    .values({
      sessionId: v.sessionId,
      ipAddress: v.ipAddress,
      userAgent: v.userAgent ?? null,
      gclid: v.gclid ?? null,
      gbraid: v.gbraid ?? null,
      wbraid: v.wbraid ?? null,
      referrer: v.referrer ?? null,
      landingPage: v.landingPage ?? null,
      utmSource: v.utmSource ?? null,
      utmMedium: v.utmMedium ?? null,
      utmCampaign: v.utmCampaign ?? null,
      utmTerm: v.utmTerm ?? null,
      utmContent: v.utmContent ?? null,
      fingerprintHash: v.fingerprintHash ?? null,
      screen: v.screen ?? null,
      timezone: v.timezone ?? null,
      language: v.language ?? null,
      platform: v.platform ?? null,
      hardwareConcurrency: v.hardwareConcurrency ?? null,
      hasCanvas: v.hasCanvas ?? null,
    })
    .onConflictDoUpdate({
      target: adVisits.sessionId,
      set: {
        userAgent: sql`coalesce(${adVisits.userAgent}, excluded.user_agent)`,
        gclid: sql`coalesce(${adVisits.gclid}, excluded.gclid)`,
        gbraid: sql`coalesce(${adVisits.gbraid}, excluded.gbraid)`,
        wbraid: sql`coalesce(${adVisits.wbraid}, excluded.wbraid)`,
        landingPage: sql`coalesce(${adVisits.landingPage}, excluded.landing_page)`,
        fingerprintHash: sql`excluded.fingerprint_hash`,
        screen: sql`excluded.screen`,
        timezone: sql`excluded.timezone`,
        language: sql`excluded.language`,
        platform: sql`excluded.platform`,
        hardwareConcurrency: sql`excluded.hardware_concurrency`,
        hasCanvas: sql`excluded.has_canvas`,
        updatedAt: new Date(),
      },
    });
}

export interface EngagementInput {
  sessionId: string;
  timeOnPage?: number | null;
  mouseMoved?: boolean | null;
  maxScrollDepth?: number | null;
  clickCount?: number | null;
  converted?: boolean | null;
}

/** Behavioral update. The client reports cumulative session metrics; we keep the
 *  strongest engagement seen (max time/scroll, OR'd mouse/converted). */
export async function recordEngagement(e: EngagementInput): Promise<void> {
  if (!isDbConfigured || !e.sessionId) return;
  await requireDb()
    .update(adVisits)
    .set({
      timeOnPage: sql`greatest(coalesce(${adVisits.timeOnPage}, 0), ${e.timeOnPage ?? 0})`,
      mouseMoved: sql`coalesce(${adVisits.mouseMoved}, false) or ${e.mouseMoved ?? false}`,
      maxScrollDepth: sql`greatest(coalesce(${adVisits.maxScrollDepth}, 0), ${e.maxScrollDepth ?? 0})`,
      clickCount: sql`greatest(${adVisits.clickCount}, ${e.clickCount ?? 0})`,
      converted: sql`${adVisits.converted} or ${e.converted ?? false}`,
      updatedAt: new Date(),
    })
    .where(eq(adVisits.sessionId, e.sessionId));
}

// ─────────────────────────── dashboard ───────────────────────────

export interface DashboardStats {
  adClicks: { d1: number; d7: number; d30: number };
  flaggedClicks: number; // last 30d
  estimatedWastedSpend: number; // flagged30 * avgCpc
  adConversionRate: number; // 0-100, last 30d
  pctFlagged: number; // 0-100, last 30d
  flaggedIpsCount: number;
}

const adClick = isNotNull(adVisits.gclid);

export async function getDashboardStats(avgCpc: number): Promise<DashboardStats | null> {
  if (!isDbConfigured) return null;
  const db = requireDb();

  const [counts] = await db
    .select({
      d1: sql<number>`count(*) filter (where ${adVisits.createdAt} >= now() - interval '1 day')::int`,
      d7: sql<number>`count(*) filter (where ${adVisits.createdAt} >= now() - interval '7 days')::int`,
      d30: sql<number>`count(*) filter (where ${adVisits.createdAt} >= now() - interval '30 days')::int`,
      flagged30: sql<number>`count(*) filter (where ${adVisits.createdAt} >= now() - interval '30 days' and ${adVisits.fraudScore} >= ${FLAGGED})::int`,
      converted30: sql<number>`count(*) filter (where ${adVisits.createdAt} >= now() - interval '30 days' and ${adVisits.converted})::int`,
    })
    .from(adVisits)
    .where(adClick);

  const [{ flaggedIpsCount }] = await db
    .select({ flaggedIpsCount: sql<number>`count(*)::int` })
    .from(flaggedIps)
    .where(sql`${flaggedIps.status} in ('flagged','excluded')`);

  const d30 = counts?.d30 ?? 0;
  const flagged30 = counts?.flagged30 ?? 0;
  return {
    adClicks: { d1: counts?.d1 ?? 0, d7: counts?.d7 ?? 0, d30 },
    flaggedClicks: flagged30,
    estimatedWastedSpend: Math.round(flagged30 * avgCpc),
    adConversionRate: d30 ? Math.round(((counts?.converted30 ?? 0) / d30) * 1000) / 10 : 0,
    pctFlagged: d30 ? Math.round((flagged30 / d30) * 1000) / 10 : 0,
    flaggedIpsCount: flaggedIpsCount ?? 0,
  };
}

export async function getClicksVsFlaggedSeries(days = 30) {
  if (!isDbConfigured) return [];
  return requireDb()
    .select({
      day: sql<string>`to_char(date_trunc('day', ${adVisits.createdAt}), 'YYYY-MM-DD')`,
      clicks: sql<number>`count(*)::int`,
      flagged: sql<number>`count(*) filter (where ${adVisits.fraudScore} >= ${FLAGGED})::int`,
    })
    .from(adVisits)
    .where(and(adClick, sql`${adVisits.createdAt} >= now() - (${days} || ' days')::interval`))
    .groupBy(sql`1`)
    .orderBy(sql`1`);
}

export async function getClicksByHour(days = 7) {
  if (!isDbConfigured) return [];
  return requireDb()
    .select({
      hour: sql<number>`extract(hour from ${adVisits.createdAt})::int`,
      clicks: sql<number>`count(*)::int`,
      flagged: sql<number>`count(*) filter (where ${adVisits.fraudScore} >= ${FLAGGED})::int`,
    })
    .from(adVisits)
    .where(and(adClick, sql`${adVisits.createdAt} >= now() - (${days} || ' days')::interval`))
    .groupBy(sql`1`)
    .orderBy(sql`1`);
}

export async function getTopFlaggedIps(limit = 10) {
  if (!isDbConfigured) return [];
  return requireDb()
    .select()
    .from(flaggedIps)
    .where(sql`${flaggedIps.status} in ('watching','flagged','excluded')`)
    .orderBy(desc(flaggedIps.fraudScore), desc(flaggedIps.lastSeen))
    .limit(limit);
}

// ─────────────────────────── flagged IPs ───────────────────────────

export interface FlaggedFilters {
  status?: FlaggedStatus;
  minScore?: number;
  hasConverted?: boolean;
  datacenterOnly?: boolean;
  page?: number;
  pageSize?: number;
}

export async function listFlaggedIps(f: FlaggedFilters = {}) {
  if (!isDbConfigured) return { rows: [], total: 0 };
  const db = requireDb();
  const page = Math.max(1, f.page ?? 1);
  const pageSize = f.pageSize ?? 50;

  const conds = [];
  if (f.status) conds.push(eq(flaggedIps.status, f.status));
  if (f.minScore != null) conds.push(gte(flaggedIps.fraudScore, f.minScore));
  if (f.hasConverted) conds.push(sql`${flaggedIps.totalConversions} > 0`);
  if (f.datacenterOnly) conds.push(eq(flaggedIps.isDatacenter, true));
  const where = conds.length ? and(...conds) : undefined;

  const rows = await db
    .select()
    .from(flaggedIps)
    .where(where)
    .orderBy(desc(flaggedIps.fraudScore), desc(flaggedIps.lastSeen))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(flaggedIps)
    .where(where);

  return { rows, total: total ?? 0, page, pageSize };
}

export async function getFlaggedIp(ip: string) {
  if (!isDbConfigured) return null;
  const [row] = await requireDb()
    .select()
    .from(flaggedIps)
    .where(eq(flaggedIps.ipAddress, ip))
    .limit(1);
  return row ?? null;
}

// ─────────────────────────── visits log ───────────────────────────

export interface VisitFilters {
  ip?: string;
  gclid?: string;
  convertedOnly?: boolean;
  minScore?: number;
  page?: number;
  pageSize?: number;
}

export async function listVisits(f: VisitFilters = {}) {
  if (!isDbConfigured) return { rows: [], total: 0 };
  const db = requireDb();
  const page = Math.max(1, f.page ?? 1);
  const pageSize = f.pageSize ?? 50;

  const conds = [];
  if (f.ip) conds.push(ilike(adVisits.ipAddress, `%${f.ip}%`));
  if (f.gclid) conds.push(ilike(adVisits.gclid, `%${f.gclid}%`));
  if (f.convertedOnly) conds.push(eq(adVisits.converted, true));
  if (f.minScore != null) conds.push(gte(adVisits.fraudScore, f.minScore));
  const where = conds.length ? and(...conds) : undefined;

  const rows = await db
    .select()
    .from(adVisits)
    .where(where)
    .orderBy(desc(adVisits.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(adVisits)
    .where(where);

  return { rows, total: total ?? 0, page, pageSize };
}

export async function getVisit(id: string) {
  if (!isDbConfigured) return null;
  const [row] = await requireDb().select().from(adVisits).where(eq(adVisits.id, id)).limit(1);
  return row ?? null;
}

// ─────────────────────────── exports ───────────────────────────

/** IPs eligible for a Google Ads exclusion list (manually flagged/excluded,
 *  never whitelisted). Capped to Google's 500-per-list limit by the caller. */
export async function getExclusionIps(): Promise<string[]> {
  if (!isDbConfigured) return [];
  const rows = await requireDb()
    .select({ ip: flaggedIps.ipAddress })
    .from(flaggedIps)
    .where(sql`${flaggedIps.status} = 'excluded'`)
    .orderBy(desc(flaggedIps.fraudScore));
  return rows.map((r) => r.ip);
}

export interface RefundRow {
  createdAt: Date;
  ipAddress: string;
  gclid: string | null;
  fraudScore: number;
  reasons: { code: string; label: string; weight: number }[] | null;
  country: string | null;
  landingPage: string | null;
}

/** Flagged ad clicks formatted as invalid-click refund evidence. */
export async function getRefundRows(days = 30): Promise<RefundRow[]> {
  if (!isDbConfigured) return [];
  return requireDb()
    .select({
      createdAt: adVisits.createdAt,
      ipAddress: adVisits.ipAddress,
      gclid: adVisits.gclid,
      fraudScore: adVisits.fraudScore,
      reasons: adVisits.fraudReasons,
      country: adVisits.country,
      landingPage: adVisits.landingPage,
    })
    .from(adVisits)
    .where(
      and(
        adClick,
        gte(adVisits.fraudScore, FLAGGED),
        sql`${adVisits.createdAt} >= now() - (${days} || ' days')::interval`,
      ),
    )
    .orderBy(desc(adVisits.createdAt));
}

// ─────────────────────────── settings (avg CPC) ───────────────────────────

const AVG_CPC_KEY = "clickProtection.avgCpc";

export async function getAvgCpc(): Promise<number> {
  if (!isDbConfigured) return 0;
  const [row] = await requireDb()
    .select({ value: siteSettings.value })
    .from(siteSettings)
    .where(eq(siteSettings.key, AVG_CPC_KEY))
    .limit(1);
  const n = Number(row?.value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export async function setAvgCpc(value: number, userId: string): Promise<void> {
  if (!isDbConfigured) return;
  await requireDb()
    .insert(siteSettings)
    .values({ key: AVG_CPC_KEY, value, updatedBy: userId })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value, updatedBy: userId, updatedAt: new Date() },
    });
}

export { adClick, FLAGGED, isNull };
