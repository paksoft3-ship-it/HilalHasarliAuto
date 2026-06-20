import Link from "next/link";
import { isDbConfigured } from "@/db";
import { requirePermission } from "@/lib/auth/guard";
import { getAdminLocale, translator, stageLabels } from "@/lib/i18n/admin";
import { getLeadsByStage } from "@/db/repo/crm-queries";
import { NotConfigured, PageTitle } from "@/components/admin/bits";

const STAGE_ORDER = [
  "new_lead", "waiting_contact", "contacted", "missing_info", "evaluation",
  "referred_buyers", "buyer_offers", "offer_sent", "negotiation", "accepted",
  "notary_pending", "vehicle_purchased", "preparing_sale", "vehicle_sold",
  "broker_closed", "lost",
] as const;

export default async function FunnelPage() {
  await requirePermission("leads.read");
  const locale = await getAdminLocale();
  const t = translator(locale);

  if (!isDbConfigured) {
    return (
      <>
        <PageTitle title={t("nav.funnel")} />
        <NotConfigured message={t("common.notConfigured")} />
      </>
    );
  }

  const rows = await getLeadsByStage();
  const byStage = new Map<string, typeof rows>();
  for (const s of STAGE_ORDER) byStage.set(s, []);
  for (const r of rows) byStage.get(r.stage)?.push(r);

  return (
    <>
      <PageTitle title={t("nav.funnel")} />
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGE_ORDER.map((stage) => {
          const items = byStage.get(stage) ?? [];
          return (
            <div key={stage} className="flex w-72 shrink-0 flex-col rounded-[14px] border border-line bg-cream-100">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <h2 className="text-sm font-bold text-ink">{stageLabels[locale][stage]}</h2>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-ink-muted">
                  {items.length}
                </span>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto p-3">
                {items.map((l) => (
                  <Link
                    key={l.id}
                    href={`/admin/leads/${l.id}`}
                    className="block rounded-[10px] border border-line bg-white p-3 hover:border-burgundy-700"
                  >
                    <p className="truncate text-sm font-semibold text-ink">{l.fullName}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {l.leadNumber}
                      {l.city ? ` · ${l.city}` : ""}
                    </p>
                  </Link>
                ))}
                {items.length === 0 && (
                  <p className="px-1 py-3 text-center text-xs text-ink-soft">—</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
