import Link from "next/link";
import { isDbConfigured } from "@/db";
import { requirePermission, can } from "@/lib/auth/guard";
import { getAdminLocale, translator } from "@/lib/i18n/admin";
import { listCalls } from "@/db/repo/comms";
import { NotConfigured, PageTitle } from "@/components/admin/bits";
import { formatTrDate, cn } from "@/lib/utils";

function mask(n: string | null, show: boolean): string {
  if (!n) return "—";
  if (show) return n;
  const d = n.replace(/\D/g, "");
  return d.length < 6 ? "***" : `${d.slice(0, 3)}***${d.slice(-2)}`;
}

export default async function CallsPage() {
  const user = await requirePermission("calls.read");
  const locale = await getAdminLocale();
  const t = translator(locale);

  if (!isDbConfigured) {
    return (<><PageTitle title={t("nav.calls")} /><NotConfigured message={t("common.notConfigured")} /></>);
  }

  const rows = await listCalls();
  const showPii = can(user, "leads.pii.view");

  return (
    <>
      <PageTitle title={t("nav.calls")} subtitle={`${rows.length}`} />
      <div className="overflow-x-auto rounded-[14px] border border-line bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-3 font-semibold">Arayan</th>
              <th className="px-4 py-3 font-semibold">{t("common.status")}</th>
              <th className="px-4 py-3 font-semibold">Süre</th>
              <th className="px-4 py-3 font-semibold">Kampanya</th>
              <th className="px-4 py-3 font-semibold">Nitelikli</th>
              <th className="px-4 py-3 font-semibold">{t("common.created")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-ink-muted">{t("common.noResults")}</td></tr>
            ) : (
              rows.map((c) => (
                <tr key={c.id} className="hover:bg-cream-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/calls/${c.id}`} className="font-semibold text-burgundy-700 hover:underline">
                      {mask(c.callerNumber, showPii)}
                    </Link>
                    {c.leadName && <div className="text-xs text-ink-muted">{c.leadName}</div>}
                  </td>
                  <td className="px-4 py-3 text-ink-secondary">{c.status}</td>
                  <td className="px-4 py-3 text-ink-secondary">{c.durationSec}s</td>
                  <td className="px-4 py-3 text-ink-secondary">{c.campaign ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", c.qualified ? "bg-success-surface text-success" : "bg-cream-200 text-ink-muted")}>
                      {c.qualified ? "Evet" : "Hayır"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{formatTrDate(c.createdAt.toISOString())}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
