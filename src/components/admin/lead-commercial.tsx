import Link from "next/link";
import {
  referToBuyers,
  recordBuyerOffer,
  selectBuyerOffer,
  presentCustomerOffer,
  createDealForLead,
} from "@/lib/admin/commerce-actions";
import { formatTRY } from "@/lib/utils";
import type { AdminLocale } from "@/lib/i18n/admin";

interface Bundle {
  referrals: { id: string; status: string; buyerName: string | null; createdAt: Date }[];
  offers: { id: string; amount: number; selected: boolean; status: string; buyerName: string | null; note: string | null }[];
  customerOffers: { id: string; amount: number; createdAt: Date }[];
  deal: { id: string } | null;
}

const field = "h-10 rounded-md border border-line px-3 text-sm focus:border-burgundy-700 focus:outline-none";

export function LeadCommercial({
  leadId,
  bundle,
  buyers,
  perms,
  labels,
}: {
  leadId: string;
  bundle: Bundle;
  buyers: { id: string; name: string }[];
  locale?: AdminLocale;
  perms: { referWrite: boolean; offerWrite: boolean; dealWrite: boolean };
  labels: {
    title: string; refer: string; buyerOffers: string; customerOffer: string;
    select: string; create: string; open: string; add: string;
  };
}) {
  return (
    <div className="mt-6 rounded-[14px] border border-line bg-white">
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <h2 className="text-sm font-bold text-ink">{labels.title}</h2>
        {bundle.deal ? (
          <Link href={`/admin/deals/${bundle.deal.id}`} className="rounded-md bg-charcoal-950 px-3 py-1.5 text-xs font-semibold text-white hover:bg-charcoal-800">
            {labels.open}
          </Link>
        ) : perms.dealWrite ? (
          <form action={createDealForLead}>
            <input type="hidden" name="leadId" value={leadId} />
            <button type="submit" className="rounded-md bg-burgundy-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-burgundy-800">
              {labels.create}
            </button>
          </form>
        ) : null}
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-2">
        {/* Refer to buyers */}
        <div>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-muted">{labels.refer}</h3>
          {perms.referWrite && buyers.length > 0 && (
            <form action={referToBuyers} className="space-y-2">
              <input type="hidden" name="leadId" value={leadId} />
              <select name="buyerIds" multiple size={Math.min(4, buyers.length)} className="w-full rounded-md border border-line p-2 text-sm">
                {buyers.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <textarea name="summary" rows={2} placeholder="Paylaşılacak özet (kişisel veri içermez)" className="w-full rounded-md border border-line p-2 text-sm" />
              <button type="submit" className="rounded-md bg-burgundy-700 px-4 py-2 text-sm font-semibold text-white hover:bg-burgundy-800">{labels.add}</button>
            </form>
          )}
          <ul className="mt-3 space-y-1.5 text-sm">
            {bundle.referrals.map((r) => (
              <li key={r.id} className="flex justify-between text-ink-secondary">
                <span>{r.buyerName ?? "—"}</span>
                <span className="text-xs text-ink-muted">{r.status}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Buyer offers */}
        <div>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-muted">{labels.buyerOffers}</h3>
          {perms.offerWrite && buyers.length > 0 && (
            <form action={recordBuyerOffer} className="mb-3 flex flex-wrap items-end gap-2">
              <input type="hidden" name="leadId" value={leadId} />
              <select name="buyerId" required className={field}>
                <option value="">Alıcı…</option>
                {buyers.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <input name="amount" type="number" required placeholder="Tutar" className={`${field} w-28`} />
              <button type="submit" className="h-10 rounded-md bg-charcoal-950 px-3 text-sm font-semibold text-white">{labels.add}</button>
            </form>
          )}
          <ul className="space-y-1.5 text-sm">
            {bundle.offers.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-2">
                <span className={o.selected ? "font-semibold text-success" : "text-ink-secondary"}>
                  {o.buyerName ?? "—"} · {formatTRY(o.amount)}
                </span>
                {!o.selected && perms.offerWrite && (
                  <form action={selectBuyerOffer}>
                    <input type="hidden" name="offerId" value={o.id} />
                    <input type="hidden" name="leadId" value={leadId} />
                    <button type="submit" className="text-xs font-semibold text-burgundy-700 hover:underline">{labels.select}</button>
                  </form>
                )}
              </li>
            ))}
            {bundle.offers.length === 0 && <li className="text-xs text-ink-muted">—</li>}
          </ul>

          {/* Customer offer */}
          <h3 className="mb-2 mt-5 text-xs font-bold uppercase tracking-wide text-ink-muted">{labels.customerOffer}</h3>
          {perms.offerWrite && (
            <form action={presentCustomerOffer} className="flex items-end gap-2">
              <input type="hidden" name="leadId" value={leadId} />
              <input name="amount" type="number" required placeholder="Tutar" className={`${field} w-28`} />
              <button type="submit" className="h-10 rounded-md bg-charcoal-950 px-3 text-sm font-semibold text-white">{labels.add}</button>
            </form>
          )}
          <ul className="mt-2 space-y-1 text-sm">
            {bundle.customerOffers.map((c) => (
              <li key={c.id} className="text-ink-secondary">{formatTRY(c.amount)}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
