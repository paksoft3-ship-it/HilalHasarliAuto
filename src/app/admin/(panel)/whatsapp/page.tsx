import Link from "next/link";
import { isDbConfigured } from "@/db";
import { requirePermission } from "@/lib/auth/guard";
import { getAdminLocale, translator } from "@/lib/i18n/admin";
import { whatsappEnabled } from "@/config/comms";
import { listThreads, getThread } from "@/db/repo/comms";
import { sendWhatsAppReply } from "@/lib/admin/comms-actions";
import { NotConfigured, PageTitle } from "@/components/admin/bits";
import { cn } from "@/lib/utils";

export default async function WhatsAppPage({
  searchParams,
}: {
  searchParams: Promise<{ thread?: string }>;
}) {
  await requirePermission("whatsapp.read");
  const sp = await searchParams;
  const locale = await getAdminLocale();
  const t = translator(locale);

  if (!isDbConfigured) {
    return (<><PageTitle title={t("nav.whatsapp")} /><NotConfigured message={t("common.notConfigured")} /></>);
  }

  const threads = await listThreads();
  const active = sp.thread ? await getThread(sp.thread) : null;

  return (
    <>
      <PageTitle title={t("nav.whatsapp")} />
      {!whatsappEnabled && (
        <p className="mb-4 rounded-md border border-warning/30 bg-warning-surface px-4 py-2 text-xs text-ink-secondary">
          WhatsApp Cloud API yapılandırılmadı — gelen mesajlar webhook ile kaydedilir; yanıtlar test modunda loglanır.
        </p>
      )}
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        {/* Threads */}
        <div className="rounded-[14px] border border-line bg-white">
          <div className="border-b border-line px-4 py-3 text-sm font-bold text-ink">Konuşmalar</div>
          {threads.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-ink-muted">{t("common.noResults")}</p>
          ) : (
            <ul className="max-h-[70vh] divide-y divide-line overflow-y-auto">
              {threads.map((th) => (
                <li key={th.id}>
                  <Link
                    href={`/admin/whatsapp?thread=${th.id}`}
                    className={cn("block px-4 py-3 hover:bg-cream-50", active?.thread.id === th.id && "bg-cream-100")}
                  >
                    <p className="text-sm font-semibold text-ink">{th.leadName ?? th.waId}</p>
                    <p className="truncate text-xs text-ink-muted">{th.lastMessagePreview ?? "—"}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Messages */}
        <div className="rounded-[14px] border border-line bg-white">
          {!active ? (
            <p className="px-4 py-16 text-center text-sm text-ink-muted">Bir konuşma seçin.</p>
          ) : (
            <div className="flex h-[70vh] flex-col">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <span className="text-sm font-bold text-ink">{active.thread.leadName ?? active.thread.waId}</span>
                {active.thread.leadId && (
                  <Link href={`/admin/leads/${active.thread.leadId}`} className="text-xs font-semibold text-burgundy-700 hover:underline">
                    {t("leads.detail")}
                  </Link>
                )}
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto p-4">
                {active.messages.map((m) => (
                  <div key={m.id} className={cn("max-w-[75%] rounded-[10px] px-3 py-2 text-sm", m.direction === "inbound" ? "bg-cream-100 text-ink" : "ml-auto bg-whatsapp/10 text-ink")}>
                    {m.body ?? `[${m.type}]`}
                  </div>
                ))}
                {active.messages.length === 0 && <p className="text-center text-sm text-ink-muted">—</p>}
              </div>
              <form action={sendWhatsAppReply} className="flex gap-2 border-t border-line p-3">
                <input type="hidden" name="threadId" value={active.thread.id} />
                <input name="body" required placeholder="Yanıt yazın…" className="h-10 flex-1 rounded-md border border-line px-3 text-sm focus:border-burgundy-700 focus:outline-none" />
                <button type="submit" className="h-10 rounded-md bg-whatsapp px-5 text-sm font-semibold text-white">Gönder</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
