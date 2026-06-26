import { and, desc, gte, isNull, sql } from "drizzle-orm";
import { requireDb } from "@/db";
import { criticalEvents, leads, adVisits } from "@/db/schema";

export async function getAnalyticsOverview() {
  const db = requireDb();

  const [eventCounts, leadsBySource, recent] = await Promise.all([
    db
      .select({ name: criticalEvents.name, count: sql<number>`count(*)::int` })
      .from(criticalEvents)
      .groupBy(criticalEvents.name)
      .orderBy(desc(sql`count(*)`)),
    db
      .select({ source: leads.source, count: sql<number>`count(*)::int` })
      .from(leads)
      .where(isNull(leads.deletedAt))
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
      .orderBy(desc(criticalEvents.occurredAt))
      .limit(20),
  ]);

  return {
    eventCounts: eventCounts.map((e) => ({ name: e.name, count: Number(e.count) })),
    leadsBySource: leadsBySource.map((s) => ({ source: s.source, count: Number(s.count) })),
    recent,
  };
}

const DAY_MS = 86_400_000;

/**
 * Real-traffic dashboard over a rolling window (default 30 days), built from
 * the first-party ad_visits table + leads. Independent of GA4/PostHog.
 */
export async function getAnalyticsDashboard(windowDays = 30) {
  const db = requireDb();
  const since = new Date(Date.now() - windowDays * DAY_MS);
  const since14 = new Date(Date.now() - 14 * DAY_MS);
  const source = sql<string>`coalesce(nullif(${adVisits.utmSource}, ''), 'doğrudan / organik')`;

  const [kpiRow, leadCountRow, daily, topPages, sources] = await Promise.all([
    db
      .select({
        visits: sql<number>`count(*)::int`,
        conversions: sql<number>`count(*) filter (where ${adVisits.converted})::int`,
      })
      .from(adVisits)
      .where(gte(adVisits.createdAt, since)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(leads)
      .where(and(isNull(leads.deletedAt), gte(leads.createdAt, since))),
    db
      .select({
        day: sql<string>`to_char(date_trunc('day', ${adVisits.createdAt}), 'YYYY-MM-DD')`,
        visits: sql<number>`count(*)::int`,
        conversions: sql<number>`count(*) filter (where ${adVisits.converted})::int`,
      })
      .from(adVisits)
      .where(gte(adVisits.createdAt, since14))
      .groupBy(sql`1`)
      .orderBy(sql`1`),
    db
      .select({
        page: sql<string>`coalesce(nullif(${adVisits.landingPage}, ''), '/')`,
        visits: sql<number>`count(*)::int`,
        conversions: sql<number>`count(*) filter (where ${adVisits.converted})::int`,
      })
      .from(adVisits)
      .where(gte(adVisits.createdAt, since))
      .groupBy(sql`1`)
      .orderBy(desc(sql`count(*)`))
      .limit(8),
    db
      .select({ source, visits: sql<number>`count(*)::int` })
      .from(adVisits)
      .where(gte(adVisits.createdAt, since))
      .groupBy(source)
      .orderBy(desc(sql`count(*)`))
      .limit(8),
  ]);

  const visits = Number(kpiRow[0]?.visits ?? 0);
  const conversions = Number(kpiRow[0]?.conversions ?? 0);
  const leadCount = Number(leadCountRow[0]?.count ?? 0);

  // Fill a continuous 14-day series so the chart has no gaps.
  const dailyMap = new Map(daily.map((d) => [d.day, d]));
  const series: { day: string; visits: number; conversions: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const day = new Date(Date.now() - i * DAY_MS).toISOString().slice(0, 10);
    const hit = dailyMap.get(day);
    series.push({ day, visits: Number(hit?.visits ?? 0), conversions: Number(hit?.conversions ?? 0) });
  }

  return {
    windowDays,
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
