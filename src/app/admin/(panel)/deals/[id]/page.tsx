import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { isDbConfigured } from "@/db";
import { requirePermission, can } from "@/lib/auth/guard";
import { getAdminLocale, translator, dealTypeLabels } from "@/lib/i18n/admin";
import { getDealDetail } from "@/db/repo/commerce";
import { updateDeal, addDealExpense } from "@/lib/admin/commerce-actions";
import { PageTitle } from "@/components/admin/bits";
import { formatTRY, formatTrDate, cn } from "@/lib/utils";

const field = "h-10 w-full rounded-md border border-line px-3 text-sm focus:border-burgundy-700 focus:outline-none";

function Money({ label, name, value }: { label: string; name: string; value: number | null }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-ink-muted">{label}</span>
      <input name={name} type="number" defaultValue={value ?? ""} className={field} />
    </label>
  );
}

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requirePermission("deals.read");
  const { id } = await params;
  const locale = await getAdminLocale();
  const t = translator(locale);
  if (!isDbConfigured) notFound();

  const data = await getDealDetail(id);
  if (!data) notFound();
  const { deal, lead, expenses, financials } = data;
  const canWrite = can(user, "deals.write");

  return (
    <>
      <Link href="/admin/deals" className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft size={16} /> {t("deals.title")}
      </Link>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <PageTitle title={lead?.fullName ?? "Anlaşma"} />
          {lead && <Link href={`/admin/leads/${lead.id}`} className="text-sm text-burgundy-700 hover:underline">{lead.leadNumber}</Link>}
        </div>
        <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", deal.status === "won" ? "bg-success-surface text-success" : deal.status === "lost" ? "bg-error-surface text-error" : "bg-info-surface text-info")}>
          {deal.status} · {dealTypeLabels[locale][deal.type]}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {canWrite ? (
            <form action={updateDeal} className="rounded-[14px] border border-line bg-white p-6">
              <input type="hidden" name="id" value={deal.id} />
              <h2 className="mb-4 text-sm font-bold text-ink">{t("deals.financials")}</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-ink-muted">{t("leads.dealType")}</span>
                  <select name="type" defaultValue={deal.type} className={field}>
                    {Object.entries(dealTypeLabels[locale]).map(([c, l]) => <option key={c} value={c}>{l}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-ink-muted">{t("common.status")}</span>
                  <select name="status" defaultValue={deal.status} className={field}>
                    <option value="open">open</option>
                    <option value="won">won</option>
                    <option value="lost">lost</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-ink-muted">{t("deals.payment")}</span>
                  <select name="paymentStatus" defaultValue={deal.paymentStatus} className={field}>
                    <option value="pending">pending</option>
                    <option value="partial">partial</option>
                    <option value="paid">paid</option>
                  </select>
                </label>
                <Money label="Müşteri Beklentisi" name="customerAskingPrice" value={deal.customerAskingPrice} />
                <Money label="Sunulan Teklif" name="offerPresented" value={deal.offerPresented} />
                <Money label="En İyi Alıcı Teklifi" name="bestBuyerOffer" value={deal.bestBuyerOffer} />
                <Money label="Anlaşılan Tutar" name="agreedAmount" value={deal.agreedAmount} />
                <Money label="Beklenen Komisyon" name="expectedCommission" value={deal.expectedCommission} />
                <Money label="Gerçekleşen Komisyon" name="actualCommission" value={deal.actualCommission} />
                <Money label="Doğrudan Alış" name="directPurchasePrice" value={deal.directPurchasePrice} />
                <Money label="Doğrudan Satış" name="directResalePrice" value={deal.directResalePrice} />
                <Money label="Pay Edilen Reklam Maliyeti" name="adCostAllocated" value={deal.adCostAllocated} />
                <Money label="Manuel Düzeltme" name="netProfitAdjustment" value={deal.netProfitAdjustment} />
              </div>
              <label className="mt-4 block">
                <span className="mb-1 block text-xs font-semibold text-ink-muted">Düzeltme Nedeni</span>
                <input name="adjustmentReason" defaultValue={deal.adjustmentReason ?? ""} className={field} />
              </label>
              <button type="submit" className="mt-5 rounded-md bg-burgundy-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-burgundy-800">
                {t("common.save")}
              </button>
            </form>
          ) : (
            <div className="rounded-[14px] border border-line bg-white p-6 text-sm text-ink-muted">
              Finansal bilgileri düzenleme yetkiniz yok.
            </div>
          )}

          {/* Expenses */}
          <div className="mt-6 rounded-[14px] border border-line bg-white p-6">
            <h2 className="mb-4 text-sm font-bold text-ink">{t("deals.expenses")}</h2>
            {canWrite && (
              <form action={addDealExpense} className="mb-4 flex flex-wrap items-end gap-2">
                <input type="hidden" name="dealId" value={deal.id} />
                <input name="type" placeholder="Tür" required className={cn(field, "w-32")} />
                <input name="amount" type="number" placeholder="Tutar" required className={cn(field, "w-32")} />
                <input name="expenseDate" type="date" className={cn(field, "w-40")} />
                <input name="note" placeholder="Not" className={cn(field, "flex-1 min-w-[120px]")} />
                <button type="submit" className="h-10 rounded-md bg-charcoal-950 px-4 text-sm font-semibold text-white hover:bg-charcoal-800">
                  {t("common.add")}
                </button>
              </form>
            )}
            {expenses.length === 0 ? (
              <p className="text-sm text-ink-muted">{t("common.noResults")}</p>
            ) : (
              <ul className="divide-y divide-line">
                {expenses.map((e) => (
                  <li key={e.id} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-ink-secondary">{e.type}{e.note ? ` · ${e.note}` : ""}</span>
                    <span className="font-medium text-ink">{formatTRY(e.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* P&L summary */}
        <div>
          <div className="rounded-[14px] border border-line bg-white p-6">
            <h2 className="mb-4 text-sm font-bold text-ink">{t("deals.net")}</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-ink-muted">{t("deals.gross")}</dt><dd className="font-medium text-ink">{formatTRY(financials.grossRevenue)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-muted">{t("finance.adspend")}</dt><dd className="text-ink">−{formatTRY(financials.adCost)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-muted">{t("deals.expenses")}</dt><dd className="text-ink">−{formatTRY(financials.expenses)}</dd></div>
              <div className="mt-2 flex justify-between border-t border-line pt-3">
                <dt className="font-bold text-ink">{t("deals.net")}</dt>
                <dd className={cn("text-lg font-bold", financials.netProfit >= 0 ? "text-success" : "text-error")}>{formatTRY(financials.netProfit)}</dd>
              </div>
            </dl>
            {deal.closingDate && (
              <p className="mt-4 text-xs text-ink-muted">Kapanış: {formatTrDate(deal.closingDate.toISOString())}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
