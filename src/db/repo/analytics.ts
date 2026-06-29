import { and, desc, gte, inArray, isNotNull, isNull, lt, sql } from "drizzle-orm";
import { requireDb } from "@/db";
import { criticalEvents, leads, adVisits } from "@/db/schema";
import type { ResolvedRange } from "@/lib/admin/date-range";

/** The three CTA click events surfaced in the Button Clicks report. */
export const CLICK_EVENT_NAMES = ["phone_click", "whatsapp_click", "quote_click"] as const;
export type ClickEventName = (typeof CLICK_EVENT_NAMES)[number];

export interface ClickBreakdownRow {
  key: string;
  phone_click: number;
  whatsapp_click: number;
  quote_click: number;
  total: number;
}

/**
 * Per-placement and per-page breakdown of CTA clicks (phone / WhatsApp / quote)
 * within a date range, from first-party critical_events. No GA4 dependency.
 */
export async function getClickBreakdown(range: ResolvedRange) {
  const db = requireDb();
  const { from, to } = range;
  const where = and(
    inArray(criticalEvents.name, CLICK_EVENT_NAMES as unknown as string[]),
    gte(criticalEvents.occurredAt, from),
    lt(criticalEvents.occurredAt, to),
  );
  const locExpr = sql<string>`coalesce(nullif(${criticalEvents.payload} ->> 'location', ''), '—')`;
  const pageExpr = sql<string>`coalesce(nullif(${criticalEvents.pageUrl}, ''), '/')`;

  const [byLoc, byPg] = await Promise.all([
    db
      .select({ name: criticalEvents.name, key: locExpr, count: sql<number>`count(*)::int` })
      .from(criticalEvents).where(where).groupBy(criticalEvents.name, locExpr),
    db
      .select({ name: criticalEvents.name, key: pageExpr, count: sql<number>`count(*)::int` })
      .from(criticalEvents).where(where).groupBy(criticalEvents.name, pageExpr),
  ]);

  const pivot = (rows: { name: string; key: string; count: number }[]): ClickBreakdownRow[] => {
    const map = new Map<string, ClickBreakdownRow>();
    for (const r of rows) {
      const row = map.get(r.key) ?? { key: r.key, phone_click: 0, whatsapp_click: 0, quote_click: 0, total: 0 };
      if (r.name === "phone_click" || r.name === "whatsapp_click" || r.name === "quote_click") {
        row[r.name] = Number(r.count);
        row.total += Number(r.count);
      }
      map.set(r.key, row);
    }
    return [...map.values()].sort((a, b) => b.total - a.total);
  };

  const byLocation = pivot(byLoc);
  const totals = byLocation.reduce(
    (acc, r) => ({
      phone_click: acc.phone_click + r.phone_click,
      whatsapp_click: acc.whatsapp_click + r.whatsapp_click,
      quote_click: acc.quote_click + r.quote_click,
    }),
    { phone_click: 0, whatsapp_click: 0, quote_click: 0 },
  );

  return { totals, byLocation, byPage: pivot(byPg) };
}

export interface ClickVisitorStats {
  totalClicks: number;
  identified: number; // clicks with a known visitor session
  uniqueVisitors: number;
  repeatVisitors: number;
  uniqueIps: number;
  multiClickIps: number;
  clicksFromMultiClickIps: number;
}

/**
 * Unique vs repeat visitors and same-IP signal for CTA clicks in a date range.
 * Visitors are counted by the shared session id; IPs by a salted hash (the raw
 * IP is never stored). Aggregated in JS over grouped rows — fine at click volume.
 */
export async function getClickVisitorStats(range: ResolvedRange): Promise<ClickVisitorStats> {
  const db = requireDb();
  const { from, to } = range;
  const base = and(
    inArray(criticalEvents.name, CLICK_EVENT_NAMES as unknown as string[]),
    gte(criticalEvents.occurredAt, from),
    lt(criticalEvents.occurredAt, to),
  );
  const ipExpr = sql<string>`${criticalEvents.payload} ->> 'ipHash'`;

  const [totalRow, sessions, ips] = await Promise.all([
    db.select({ c: sql<number>`count(*)::int` }).from(criticalEvents).where(base),
    db
      .select({ sid: criticalEvents.sessionId, c: sql<number>`count(*)::int` })
      .from(criticalEvents)
      .where(and(base, isNotNull(criticalEvents.sessionId)))
      .groupBy(criticalEvents.sessionId),
    db
      .select({ h: ipExpr, c: sql<number>`count(*)::int` })
      .from(criticalEvents)
      .where(and(base, sql`${criticalEvents.payload} ->> 'ipHash' is not null`))
      .groupBy(ipExpr),
  ]);

  const num = (v: unknown) => Number(v ?? 0);
  const totalClicks = num(totalRow[0]?.c);
  const identified = sessions.reduce((a, s) => a + num(s.c), 0);
  const repeatVisitors = sessions.filter((s) => num(s.c) > 1).length;
  const multi = ips.filter((i) => num(i.c) > 1);

  return {
    totalClicks,
    identified,
    uniqueVisitors: sessions.length,
    repeatVisitors,
    uniqueIps: ips.length,
    multiClickIps: multi.length,
    clicksFromMultiClickIps: multi.reduce((a, i) => a + num(i.c), 0),
  };
}

export interface TopClickIp {
  ipHash: string;
  total: number;
  phone_click: number;
  whatsapp_click: number;
  quote_click: number;
  visitors: number; // distinct sessions on this IP
  pages: number; // distinct pages clicked from this IP
}

/**
 * IPs (salted-hash) with the most clicks in the range — to eyeball repeated
 * clickers. Only IPs with >1 click are returned; `visitors` > 1 on a single IP
 * is a classic shared-IP / automation signal.
 */
export async function getTopClickIps(range: ResolvedRange, limit = 10): Promise<TopClickIp[]> {
  const db = requireDb();
  const { from, to } = range;
  const ipExpr = sql<string>`${criticalEvents.payload} ->> 'ipHash'`;
  const filt = (name: ClickEventName) => sql<number>`count(*) filter (where ${criticalEvents.name} = ${name})::int`;

  const rows = await db
    .select({
      ipHash: ipExpr,
      total: sql<number>`count(*)::int`,
      phone_click: filt("phone_click"),
      whatsapp_click: filt("whatsapp_click"),
      quote_click: filt("quote_click"),
      visitors: sql<number>`count(distinct ${criticalEvents.sessionId})::int`,
      pages: sql<number>`count(distinct ${criticalEvents.pageUrl})::int`,
    })
    .from(criticalEvents)
    .where(
      and(
        inArray(criticalEvents.name, CLICK_EVENT_NAMES as unknown as string[]),
        gte(criticalEvents.occurredAt, from),
        lt(criticalEvents.occurredAt, to),
        sql`${criticalEvents.payload} ->> 'ipHash' is not null`,
      ),
    )
    .groupBy(ipExpr)
    .having(sql`count(*) > 1`)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);

  return rows.map((r) => ({
    ipHash: r.ipHash,
    total: Number(r.total),
    phone_click: Number(r.phone_click),
    whatsapp_click: Number(r.whatsapp_click),
    quote_click: Number(r.quote_click),
    visitors: Number(r.visitors),
    pages: Number(r.pages),
  }));
}

export interface RecentClick {
  id: string;
  name: ClickEventName;
  location: string; // button placement (payload.location) or '—'
  pageUrl: string; // page the click happened on, '/' fallback
  ipHash: string | null;
  occurredAt: Date; // exact click time (UTC; render in Europe/Istanbul)
}

/**
 * Individual CTA clicks in the range, newest first — a per-click log so the exact
 * time of each button click is visible next to its placement and page.
 */
export async function getRecentClicks(range: ResolvedRange, limit = 100): Promise<RecentClick[]> {
  const db = requireDb();
  const { from, to } = range;
  const locExpr = sql<string>`coalesce(nullif(${criticalEvents.payload} ->> 'location', ''), '—')`;
  const pageExpr = sql<string>`coalesce(nullif(${criticalEvents.pageUrl}, ''), '/')`;
  const ipExpr = sql<string | null>`${criticalEvents.payload} ->> 'ipHash'`;

  const rows = await db
    .select({
      id: criticalEvents.id,
      name: criticalEvents.name,
      location: locExpr,
      pageUrl: pageExpr,
      ipHash: ipExpr,
      occurredAt: criticalEvents.occurredAt,
    })
    .from(criticalEvents)
    .where(
      and(
        inArray(criticalEvents.name, CLICK_EVENT_NAMES as unknown as string[]),
        gte(criticalEvents.occurredAt, from),
        lt(criticalEvents.occurredAt, to),
      ),
    )
    .orderBy(desc(criticalEvents.occurredAt))
    .limit(limit);

  return rows.map((r) => ({
    id: r.id,
    name: r.name as ClickEventName,
    location: r.location,
    pageUrl: r.pageUrl,
    ipHash: r.ipHash ?? null,
    occurredAt: r.occurredAt,
  }));
}

export async function getAnalyticsOverview(range: ResolvedRange) {
  const db = requireDb();
  const { from, to } = range;

  const [eventCounts, leadsBySource, recent] = await Promise.all([
    db
      .select({ name: criticalEvents.name, count: sql<number>`count(*)::int` })
      .from(criticalEvents)
      .where(and(gte(criticalEvents.occurredAt, from), lt(criticalEvents.occurredAt, to)))
      .groupBy(criticalEvents.name)
      .orderBy(desc(sql`count(*)`)),
    db
      .select({ source: leads.source, count: sql<number>`count(*)::int` })
      .from(leads)
      .where(and(isNull(leads.deletedAt), gte(leads.createdAt, from), lt(leads.createdAt, to)))
      .groupBy(leads.source)
      .orderBy(desc(sql`count(*)`)),
    db
      .select({
        id: criticalEvents.id,
        name: criticalEvents.name,
        leadId: criticalEvents.leadId,
        occurredAt: criticalEvents.occurredAt,
        source: criticalEvents.source,
      })
      .from(criticalEvents)
      .where(and(gte(criticalEvents.occurredAt, from), lt(criticalEvents.occurredAt, to)))
      .orderBy(desc(criticalEvents.occurredAt))
      .limit(20),
  ]);

  return {
    eventCounts: eventCounts.map((e) => ({ name: e.name, count: Number(e.count) })),
    leadsBySource: leadsBySource.map((s) => ({ source: s.source, count: Number(s.count) })),
    recent,
  };
}

/**
 * Real-traffic dashboard over an explicit date range, built from the first-party
 * ad_visits table + leads + critical events. Independent of GA4. Daily buckets
 * are computed in Türkiye time so they line up with the calendar-day filter.
 */
export async function getAnalyticsDashboard(range: ResolvedRange) {
  const db = requireDb();
  const { from, to, days } = range;
  const inRange = (col: typeof adVisits.createdAt) => and(gte(col, from), lt(col, to));
  const source = sql<string>`coalesce(nullif(${adVisits.utmSource}, ''), 'doğrudan / organik')`;
  const trDay = sql<string>`to_char(date_trunc('day', ${adVisits.createdAt} at time zone 'Europe/Istanbul'), 'YYYY-MM-DD')`;

  const [kpiRow, leadCountRow, daily, topPages, sources] = await Promise.all([
    db
      .select({
        visits: sql<number>`count(*)::int`,
        conversions: sql<number>`count(*) filter (where ${adVisits.converted})::int`,
      })
      .from(adVisits)
      .where(inRange(adVisits.createdAt)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(leads)
      .where(and(isNull(leads.deletedAt), gte(leads.createdAt, from), lt(leads.createdAt, to))),
    db
      .select({
        day: trDay,
        visits: sql<number>`count(*)::int`,
        conversions: sql<number>`count(*) filter (where ${adVisits.converted})::int`,
      })
      .from(adVisits)
      .where(inRange(adVisits.createdAt))
      .groupBy(trDay)
      .orderBy(trDay),
    db
      .select({
        page: sql<string>`coalesce(nullif(${adVisits.landingPage}, ''), '/')`,
        visits: sql<number>`count(*)::int`,
        conversions: sql<number>`count(*) filter (where ${adVisits.converted})::int`,
      })
      .from(adVisits)
      .where(inRange(adVisits.createdAt))
      .groupBy(sql`1`)
      .orderBy(desc(sql`count(*)`))
      .limit(8),
    db
      .select({ source, visits: sql<number>`count(*)::int` })
      .from(adVisits)
      .where(inRange(adVisits.createdAt))
      .groupBy(source)
      .orderBy(desc(sql`count(*)`))
      .limit(8),
  ]);

  const visits = Number(kpiRow[0]?.visits ?? 0);
  const conversions = Number(kpiRow[0]?.conversions ?? 0);
  const leadCount = Number(leadCountRow[0]?.count ?? 0);

  // Fill a continuous series across the selected range so the chart has no gaps.
  const dailyMap = new Map(daily.map((d) => [d.day, d]));
  const series = days.map((day) => {
    const hit = dailyMap.get(day);
    return { day, visits: Number(hit?.visits ?? 0), conversions: Number(hit?.conversions ?? 0) };
  });

  return {
    kpis: {
      visits,
      conversions,
      leads: leadCount,
      convRate: visits > 0 ? Math.round((conversions / visits) * 1000) / 10 : 0,
    },
    series,
    topPages: topPages.map((p) => ({ page: p.page, visits: Number(p.visits), conversions: Number(p.conversions) })),
    sources: sources.map((s) => ({ source: s.source, visits: Number(s.visits) })),
  };
}
