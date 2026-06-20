import { eq } from "drizzle-orm";
import { isDbConfigured, requireDb } from "@/db";
import { notifications } from "@/db/schema";
import { comms } from "@/config/comms";
import { sendWhatsAppText } from "./whatsapp";

/**
 * Notify configured staff of a new lead via WhatsApp (master prompt §14/§22).
 * Records each notification and its delivery result. No-ops when no recipients
 * are configured. Best-effort: never throws into the lead flow.
 */
export async function notifyNewLead(opts: {
  leadId?: string | null;
  name: string;
  city?: string | null;
  source?: string | null;
}): Promise<void> {
  if (!isDbConfigured) return;
  const recipients = comms.whatsapp.staffRecipients;
  if (recipients.length === 0) return;

  const db = requireDb();
  const text = `Yeni başvuru: ${opts.name}${opts.city ? ` · ${opts.city}` : ""}${
    opts.source ? ` (${opts.source})` : ""
  }`;

  for (const recipient of recipients) {
    let id: string | undefined;
    try {
      const [row] = await db
        .insert(notifications)
        .values({
          type: "new_lead",
          channel: "whatsapp",
          recipient,
          leadId: opts.leadId ?? null,
          payload: { text },
        })
        .returning({ id: notifications.id });
      id = row.id;
      const res = await sendWhatsAppText(recipient, text);
      await db
        .update(notifications)
        .set({
          status: res.ok ? "sent" : "failed",
          error: res.error ?? null,
          sentAt: res.ok ? new Date() : null,
        })
        .where(eq(notifications.id, id));
    } catch (err) {
      if (id) {
        await db
          .update(notifications)
          .set({ status: "failed", error: err instanceof Error ? err.message : "unknown" })
          .where(eq(notifications.id, id));
      }
    }
  }
}
