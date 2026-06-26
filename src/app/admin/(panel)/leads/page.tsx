import Link from "next/link";
import { Download } from "lucide-react";
import { isDbConfigured } from "@/db";
import { requirePermission, can } from "@/lib/auth/guard";
import { getAdminLocale, translator, stageLabels } from "@/lib/i18n/admin";
import { listLeads, getStageCounts, type QuickView } from "@/db/repo/crm-queries";
import { StageBadge, NotConfigured, PageTitle, Flash } from "@/components/admin/bits";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteLead } from "@/lib/admin/lead-actions";
import { formatTrDate, cn } from "@/lib/utils";

const VIEWS: QuickView[] = ["all", "mine", "unassigned", "high", "followup", "stale", "won", "lost"];

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string; q?: string; page?: string; view?: string; ok?: string; error?: string }>;
}) {
  const user = await requirePermission("leads.read");
  const sp = await searchParams;
  const locale = await getAdminLocale();
  const t = translator(locale);

  if (!isDbConfigured) {
    return (
      <>
        <PageTitle title={t("leads.title")} />
        <NotConfigured message={t("common.notConfigured")} />
      </>
    );
  }

  const view = (VIEWS.includes(sp.view as QuickView) ? sp.view : "all") as QuickView;
  const [data, stageCounts] = await Promise.all([
    listLeads({
      stage: sp.stage,
      q: sp.q,
      view,
      currentUserId: user.id,
      page: sp.page ? parseInt(sp.page, 10) : 1,
    }),
    getStageCounts(),
  ]);

  const stageOpts = Object.entries(stageLabels[locale]);
  const pipeline = stageOpts
    .map(([code, label]) => ({ code, label, n: stageCounts[code] ?? 0 }))
    .filter((s) => s.n > 0);
  const canExport = can(user, "export.data");
  const canDelete = can(user, "leads.delete");

  const buildHref = (over: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { view: view === "all" ? undefined : view, stage: sp.stage, q: sp.q, ...over };
    for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v);
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  };

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <PageTitle title={t("leads.title")} subtitle={`${data.total}`} />
        {canExport && (
          <a
            href={`/admin/leads/export${buildHref({})}`}
            className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-ink hover:bg-cream-100"
          >
            <Download size={15} /> {t("leads.export")}
          </a>
        )}
      </div>

      <Flash ok={sp.ok} error={sp.error} />

      {/* Quick views */}
      <div className="mb-4 flex flex-wrap gap-2">
        {VIEWS.map((v) => (
          <Link
            key={v}
            href={`/admin/leads${v === "all" ? "" : `?view=${v}`}`}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              view === v ? "border-burgundy-700 bg-burgundy-700 text-white" : "border-line bg-white text-ink hover:border-burgundy-700",
            )}
          >
            {t(`view.${v}`)}
          </Link>
        ))}
      </div>

      {/* Pipeline overview */}
      {pipeline.length > 0 && (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {pipeline.map((s) => {
            const active = sp.stage === s.code;
            return (
              <Link
                key={s.code}
                href={`/admin/leads${buildHref({ stage: active ? undefined : s.code, page: undefined })}`}
                className={cn(
                  "flex shrink-0 flex-col rounded-[12px] border px-3.5 py-2 transition-colors",
                  active ? "border-burgundy-700 bg-cream-100" : "border-line bg-white hover:border-burgundy-700",
                )}
              >
                <span className="text-lg font-bold leading-none text-ink">{s.n}</span>
                <span className="mt-1 whitespace-nowrap text-[11px] font-medium text-ink-muted">{s.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <form method="get" className="mb-5 flex flex-wrap items-end gap-3 rounded-[14px] border border-line bg-white p-4">
        {view !== "all" && <input type="hidden" name="view" value={view} />}
        <div className="min-w-[180px] flex-1">
          <label className="mb-1 block text-xs font-semibold text-ink-muted">{t("common.search")}</label>
          <input name="q" defaultValue={sp.q ?? ""} placeholder="Ad, telefon, no…"
            className="h-10 w-full rounded-md border border-line px-3 text-sm focus:border-burgundy-700 focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-muted">{t("leads.stage")}</label>
          <select name="stage" defaultValue={sp.stage ?? ""} className="h-10 rounded-md border border-line px-3 text-sm">
            <option value="">{t("common.all")}</option>
            {stageOpts.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
          </select>
        </div>
        <button type="submit" className="h-10 rounded-md bg-burgundy-700 px-5 text-sm font-semibold text-white hover:bg-burgundy-800">
          {t("common.search")}
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto rounded-[14px] border border-line bg-white">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-3 font-semibold">{t("leads.lead")}</th>
              <th className="px-4 py-3 font-semibold">{t("leads.vehicle")}</th>
              <th className="px-4 py-3 font-semibold">{t("leads.stage")}</th>
              <th className="px-4 py-3 font-semibold">{t("leads.assigned")}</th>
              <th className="px-4 py-3 font-semibold">{t("common.city")}</th>
              <th className="px-4 py-3 font-semibold">{t("leads.score")}</th>
              <th className="px-4 py-3 font-semibold">{t("common.created")}</th>
              {canDelete && <th className="px-4 py-3"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {data.rows.length === 0 ? (
              <tr><td colSpan={canDelete ? 8 : 7} className="px-4 py-10 text-center text-ink-muted">{t("common.noResults")}</td></tr>
            ) : (
              data.rows.map((l) => (
                <tr key={l.id} className="hover:bg-cream-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/leads/${l.id}`} className="font-semibold text-burgundy-700 hover:underline">{l.fullName}</Link>
                    <div className="text-xs text-ink-muted">{l.leadNumber} · {l.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-ink-secondary">
                    {l.vehicle ? [l.vehicle.brand, l.vehicle.model].filter(Boolean).join(" ") || l.vehicle.category : "—"}
                  </td>
                  <td className="px-4 py-3"><StageBadge stage={l.stage} locale={locale} /></td>
                  <td className="px-4 py-3 text-ink-secondary">{l.assignedName ?? t("leads.unassigned")}</td>
                  <td className="px-4 py-3 text-ink-secondary">{l.city ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-secondary">{l.score}</td>
                  <td className="px-4 py-3 text-ink-muted">{formatTrDate(l.createdAt.toISOString())}</td>
                  {canDelete && (
                    <td className="px-4 py-3 text-right">
                      <DeleteButton action={deleteLead} id={l.id} confirmText={`"${l.fullName}" talebini silmek istediğinize emin misiniz?`} />
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.pageCount > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-ink-muted">{data.page} / {data.pageCount}</span>
          <div className="flex gap-2">
            {data.page > 1 && (
              <Link href={`/admin/leads${buildHref({ page: String(data.page - 1) })}`} className="rounded-md border border-line px-3 py-1.5 hover:bg-cream-100">←</Link>
            )}
            {data.page < data.pageCount && (
              <Link href={`/admin/leads${buildHref({ page: String(data.page + 1) })}`} className="rounded-md border border-line px-3 py-1.5 hover:bg-cream-100">→</Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
