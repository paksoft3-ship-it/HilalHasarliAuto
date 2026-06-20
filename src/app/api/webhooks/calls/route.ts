import { type NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";
import { isDbConfigured, requireDb } from "@/db";
import { calls, callEvents, webhookEvents, leads } from "@/db/schema";
import { comms } from "@/config/comms";
import { normalizePhone } from "@/lib/leads/schema";
import { recordCriticalEvent, enqueueConversion } from "@/db/repo/conversions";

type CallStatus = "initiated" | "ringing" | "answered" | "missed" | "completed" | "failed";

interface CallPayload {
  externalId?: string;
  status?: CallStatus;
  durationSec?: number;
  trackingNumber?: string;
  callerNumber?: string;
  landingPage?: string;
  campaign?: string;
  keyword?: string;
  recordingUrl?: string;
  recordingConsent?: boolean;
}

export async function POST(req: NextRequest) {
  // Shared-secret verification (provider-agnostic).
  if (comms.call.webhookSecret) {
    const provided = req.headers.get("x-call-secret");
    if (provided !== comms.call.webhookSecret) {
      return new Response("Invalid secret", { status: 401 });
    }
  }
  if (!isDbConfigured) return new Response("ok", { status: 200 });

  let p: CallPayload;
  try {
    p = (await req.json()) as CallPayload;
  } catch {
    return new Response("ok", { status: 200 });
  }
  if (!p.externalId || !p.status) return new Response("Bad request", { status: 400 });

  const db = requireDb();
  const provider = comms.call.provider;

  // Idempotency per (call, status).
  const [logged] = await db
    .insert(webhookEvents)
    .values({ provider: "call", eventId: `${p.externalId}:${p.status}`, signatureValid: true, status: "received" })
    .onConflictDoNothing({ target: [webhookEvents.provider, webhookEvents.eventId] })
    .returning({ id: webhookEvents.id });
  if (!logged) return new Response("ok", { status: 200 });

  // Upsert call.
  let [call] = await db
    .select()
    .from(calls)
    .where(and(eq(calls.provider, provider), eq(calls.externalId, p.externalId)))
    .limit(1);

  const patch = {
    status: p.status,
    durationSec: p.durationSec ?? undefined,
    trackingNumber: p.trackingNumber,
    callerNumber: p.callerNumber,
    landingPage: p.landingPage,
    campaign: p.campaign,
    keyword: p.keyword,
    recordingUrl: p.recordingUrl,
    recordingConsent: p.recordingConsent ?? false,
    answeredAt: p.status === "answered" ? new Date() : undefined,
    endedAt: p.status === "completed" || p.status === "missed" || p.status === "failed" ? new Date() : undefined,
    updatedAt: new Date(),
  };

  if (!call) {
    [call] = await db
      .insert(calls)
      .values({ provider, externalId: p.externalId, startedAt: new Date(), ...patch })
      .returning();
  } else {
    await db.update(calls).set(patch).where(eq(calls.id, call.id));
  }

  await db.insert(callEvents).values({ callId: call.id, type: p.status, payload: { ...p } });

  // Associate lead by caller number.
  if (!call.leadId && p.callerNumber) {
    const phone = normalizePhone(p.callerNumber);
    const [lead] = await db.select({ id: leads.id }).from(leads).where(eq(leads.phoneNormalized, phone)).limit(1);
    if (lead) {
      await db.update(calls).set({ leadId: lead.id }).where(eq(calls.id, call.id));
      call.leadId = lead.id;
    }
  }

  // Qualified-call rule: completed AND duration ≥ threshold (or already qualified).
  const duration = p.durationSec ?? call.durationSec ?? 0;
  const shouldQualify =
    p.status === "completed" && !call.qualified && duration >= comms.call.qualifiedThresholdSec;
  if (shouldQualify) {
    await db
      .update(calls)
      .set({ qualified: true, qualifiedReason: `duration>=${comms.call.qualifiedThresholdSec}s` })
      .where(eq(calls.id, call.id));
    await recordCriticalEvent("qualified_call", {
      leadId: call.leadId,
      dedupeId: `call_${call.id}`,
      source: { channel: "call", campaign: p.campaign },
    });
    await enqueueConversion({
      platform: "google_ads",
      conversionAction: "qualified_call",
      leadId: call.leadId,
      dedupeKey: `call_${call.id}`,
    });
  }

  return new Response("ok", { status: 200 });
}
