import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { isDbConfigured } from "@/db";
import { requirePermission, can } from "@/lib/auth/guard";
import { getAdminLocale, translator } from "@/lib/i18n/admin";
import { getCall } from "@/db/repo/comms";
import { qualifyCallManually } from "@/lib/admin/comms-actions";
import { PageTitle } from "@/components/admin/bits";
import { formatTrDate } from "@/lib/utils";

function mask(n: string | null, show: boolean): string {
  if (!n) return "—";
  if (show) return n;
  const d = n.replace(/\D/g, "");
  return d.length < 6 ? "***" : `${d.slice(0, 3)}***${d.slice(-2)}`;
}

export default async function CallDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requirePermission("calls.read");
  const { id } = await params;
  const locale = await getAdminLocale();
  const t = translator(locale);
  if (!isDbConfigured) notFound();

  const data = await getCall(id);
  if (!data) notFound();
  const { call, lead, events } = data;
  const showPii = can(user, "leads.pii.view");
  const canRecording = can(user, "calls.recording.access");

  return (
    <>
      <Link href="/admin/calls" className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft size={16} /> {t("nav.calls")}
      </Link>
      <PageTitle title={mask(call.callerNumber, showPii)} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[14px] border border-line bg-white p-5 lg:col-span-2">
          <dl className="divide-y divide-line text-sm">
            {[
              ["Durum", call.status],
              ["Süre", `${call.durationSec}s`],
              ["Kampanya", call.campaign ?? "—"],
              ["Anahtar kelime", call.keyword ?? "—"],
              ["Tracking No", call.trackingNumber ?? "—"],
              ["Açılış sayfası", call.landingPage ?? "—"],
              ["Nitelikli", call.qualified ? `Evet (${call.qualifiedReason ?? ""})` : "Hayır"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2">
                <dt className="text-ink-muted">{k}</dt>
                <dd className="text-right font-medium text-ink">{v}</dd>
              </div>
            ))}
          </dl>

          {call.recordingUrl && (
            <div className="mt-4 border-t border-line pt-4">
              {canRecording && call.recordingConsent ? (
                <a href={call.recordingUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-burgundy-700 hover:underline">
                  Kaydı dinle
                </a>
              ) : (
                <p className="text-xs text-ink-muted">
                  {call.recordingConsent ? "Kayda erişim yetkiniz yok." : "Kayıt onayı yok."}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {!call.qualified && can(user, "calls.read") && (
            <div className="rounded-[14px] border border-line bg-white p-5">
              <h2 className="mb-3 text-sm font-bold text-ink">Manuel Niteleme</h2>
              <form action={qualifyCallManually}>
                <input type="hidden" name="callId" value={call.id} />
                <button type="submit" className="w-full rounded-md bg-burgundy-700 px-4 py-2 text-sm font-semibold text-white hover:bg-burgundy-800">
                  Nitelikli olarak işaretle
                </button>
              </form>
            </div>
          )}
          {lead && (
            <div className="rounded-[14px] border border-line bg-white p-5">
              <Link href={`/admin/leads/${lead.id}`} className="text-sm font-semibold text-burgundy-700 hover:underline">
                {lead.fullName} →
              </Link>
            </div>
          )}
          <div className="rounded-[14px] border border-line bg-white p-5">
            <h2 className="mb-3 text-sm font-bold text-ink">Olaylar</h2>
            <ul className="space-y-2 text-sm">
              {events.map((e) => (
                <li key={e.id} className="flex justify-between">
                  <span className="text-ink-secondary">{e.type}</span>
                  <span className="text-xs text-ink-muted">{formatTrDate(e.occurredAt.toISOString())}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
