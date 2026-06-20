import { isDbConfigured } from "@/db";
import { requirePermission, can } from "@/lib/auth/guard";
import { getAdminLocale, translator } from "@/lib/i18n/admin";
import { listAdSpend } from "@/db/repo/commerce";
import { addAdSpend } from "@/lib/admin/commerce-actions";
import { NotConfigured, PageTitle } from "@/components/admin/bits";
import { formatTRY, formatTrDate, cn } from "@/lib/utils";

const field = "h-10 rounded-md border border-line px-3 text-sm focus:border-burgundy-700 focus:outline-none";

export default async function AdSpendPage() {
  const user = await requirePermission("adspend.read");
  const locale = await getAdminLocale();
  const t = translator(locale);

  if (!isDbConfigured) {
    return (<><PageTitle title={t("adspend.title")} /><NotConfigured message={t("common.notConfigured")} /></>);
  }

  const rows = await listAdSpend();
  const canWrite = can(user, "adspend.write");

  return (
    <>
      <PageTitle title={t("adspend.title")} subtitle={`${rows.length}`} />

      {canWrite && (
        <form action={addAdSpend} className="mb-5 flex flex-wrap items-end gap-2 rounded-[14px] border border-line bg-white p-4">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-ink-muted">{t("adspend.platform")}</span>
            <select name="platform" className={cn(field, "w-36")} defaultValue="google_ads">
              <option value="google_ads">Google Ads</option>
              <option value="meta_ads">Meta Ads</option>
              <option value="tiktok_ads">TikTok Ads</option>
              <option value="other">Diğer</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-ink-muted">Tarih</span>
            <input name="spendDate" type="date" required className={cn(field, "w-40")} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-ink-muted">Kampanya</span>
            <input name="campaign" className={cn(field, "w-40")} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-ink-muted">{t("adspend.spend")}</span>
            <input name="spend" type="number" required className={cn(field, "w-28")} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-ink-muted">Tıklama</span>
            <input name="clicks" type="number" className={cn(field, "w-24")} />
          </label>
          <button type="submit" className="h-10 rounded-md bg-burgundy-700 px-5 text-sm font-semibold text-white hover:bg-burgundy-800">
            {t("adspend.add")}
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-[14px] border border-line bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-3 font-semibold">Tarih</th>
              <th className="px-4 py-3 font-semibold">{t("adspend.platform")}</th>
              <th className="px-4 py-3 font-semibold">Kampanya</th>
              <th className="px-4 py-3 text-right font-semibold">{t("adspend.spend")}</th>
              <th className="px-4 py-3 text-right font-semibold">Tıklama</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-ink-muted">{t("common.noResults")}</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="hover:bg-cream-50">
                  <td className="px-4 py-3 text-ink-secondary">{formatTrDate(new Date(r.spendDate).toISOString())}</td>
                  <td className="px-4 py-3 text-ink-secondary">{r.platform}</td>
                  <td className="px-4 py-3 text-ink-secondary">{r.campaign ?? "—"}</td>
                  <td className="px-4 py-3 text-right font-medium text-ink">{formatTRY(r.spend)}</td>
                  <td className="px-4 py-3 text-right text-ink-secondary">{r.clicks}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
