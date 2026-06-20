import { requireDb } from "@/db";
import { criticalEvents, conversionExports } from "@/db/schema";

/** Record a first-party critical event (deduped by dedupeId). */
export async function recordCriticalEvent(
  name: string,
  opts: {
    leadId?: string | null;
    dedupeId: string;
    source?: Record<string, unknown> | null;
    payload?: Record<string, unknown> | null;
    sessionId?: string | null;
  },
): Promise<void> {
  await requireDb()
    .insert(criticalEvents)
    .values({
      name,
      leadId: opts.leadId ?? null,
      dedupeId: opts.dedupeId,
      source: opts.source ?? null,
      payload: opts.payload ?? null,
      sessionId: opts.sessionId ?? null,
    })
    .onConflictDoNothing({ target: criticalEvents.dedupeId });
}

/** Queue an offline conversion for a platform adapter to upload (deduped). */
export async function enqueueConversion(opts: {
  platform: string;
  conversionAction: string;
  leadId?: string | null;
  dealId?: string | null;
  clickIds?: Record<string, string> | null;
  value?: number | null;
  dedupeKey: string;
  conversionTime?: Date;
}): Promise<void> {
  await requireDb()
    .insert(conversionExports)
    .values({
      platform: opts.platform,
      conversionAction: opts.conversionAction,
      leadId: opts.leadId ?? null,
      dealId: opts.dealId ?? null,
      clickIds: opts.clickIds ?? null,
      value: opts.value ?? null,
      dedupeKey: opts.dedupeKey,
      conversionTime: opts.conversionTime ?? new Date(),
      status: "pending",
    })
    .onConflictDoNothing({ target: conversionExports.dedupeKey });
}
