import { desc, isNull, sql } from "drizzle-orm";
import { requireDb } from "@/db";
import { criticalEvents, leads } from "@/db/schema";

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
