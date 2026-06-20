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

// Milestones for the conversion funnel ("at this stage or beyond").
const FUNNEL_MILESTONES: { start: string; label: string }[] = [
  { start: "new_lead", label: "Tüm Talepler" },
  { start: "contacted", label: "İletişim Kuruldu" },
  { start: "evaluation", label: "Değerlendirme" },
  { start: "offer_sent", label: "Teklif İletildi" },
  { start: "accepted", label: "Kabul Edildi" },
  { start: "vehicle_sold", label: "Sonuçlandı" },
];

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
  const count = (s: string) => byStage.get(s)?.length ?? 0;

  // Funnel = leads currently at a milestone stage OR further along the pipeline
  // (the snapshot equivalent of how deep leads have progressed). "lost" excluded.
  const PIPELINE: string[] = STAGE_ORDER.filter((s) => s !== "lost");
  const atOrBeyond = (start: string) =>
    PIPELINE.slice(PIPELINE.indexOf(start)).reduce((sum, s) => sum + count(s), 0);
  const funnel = FUNNEL_MILESTONES.map((m) => ({ ...m, value: atOrBeyond(m.start) }));
  const funnelMax = Math.max(1, funnel[0].value);
  const lostCount = count("lost");

  return (
    <>
      <PageTitle title={t("nav.funnel")} subtitle={`${rows.length}`} />

      {/* Stage cards — full-page grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {STAGE_ORDER.map((stage) => {
          const items = byStage.get(stage) ?? [];
          const isLost = stage === "lost";
          return (
            <div
              key={stage}
              className={`rounded-[14px] border bg-white p-4 ${isLost ? "border-error/30" : "border-line"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/admin/leads?stage=${stage}`}
                  className="text-sm font-bold leading-snug text-ink hover:text-burgundy-700"
                >
                  {stageLabels[locale][stage]}
                </Link>
                <span className="shrink-0 rounded-full bg-cream-200 px-2 py-0.5 text-xs font-semibold text-ink-muted">
                  {items.length}
                </span>
              </div>
              <p className={`mt-1 text-3xl font-bold ${isLost ? "text-error" : "text-burgundy-700"}`}>
                {items.length}
              </p>
              <div className="mt-3 space-y-1.5">
                {items.slice(0, 3).map((l) => (
                  <Link
                    key={l.id}
                    href={`/admin/leads/${l.id}`}
                    className="block truncate text-xs text-ink-secondary hover:text-burgundy-700"
                  >
                    {l.fullName}
                    {l.city ? ` · ${l.city}` : ""}
                  </Link>
                ))}
                {items.length > 3 && (
                  <Link href={`/admin/leads?stage=${stage}`} className="block text-xs font-semibold text-burgundy-700 hover:underline">
                    +{items.length - 3} daha
                  </Link>
                )}
                {items.length === 0 && <p className="text-xs text-ink-soft">—</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Conversion funnel — derived from the stage counts above */}
      <div className="mt-8 rounded-[14px] border border-line bg-white p-5 md:p-6">
        <h2 className="mb-1 text-sm font-bold text-ink">Dönüşüm Hunisi</h2>
        <p className="mb-5 text-xs text-ink-muted">
          Her aşamadaki ve sonrasındaki talep sayısı (kaybedilenler hariç).
        </p>
        <div className="space-y-2.5">
          {funnel.map((lvl, i) => {
            const pct = Math.round((lvl.value / funnelMax) * 100);
            const conv = i === 0 ? 100 : funnel[i - 1].value ? Math.round((lvl.value / funnel[i - 1].value) * 100) : 0;
            return (
              <div key={lvl.start} className="flex items-center gap-3">
                <div className="w-32 shrink-0 text-right text-xs font-medium text-ink-secondary md:w-40 md:text-sm">
                  {lvl.label}
                </div>
                <div className="flex-1">
                  <div
                    className="mx-auto flex h-10 min-w-[2.5rem] items-center justify-center rounded-md bg-gradient-to-r from-burgundy-800 to-burgundy-600 px-3 text-sm font-bold text-white transition-all"
                    style={{ width: `${Math.max(pct, 6)}%` }}
                  >
                    {lvl.value}
                  </div>
                </div>
                <div className="w-12 shrink-0 text-right text-xs font-semibold text-ink-muted">
                  {conv}%
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-end gap-2 border-t border-line pt-4 text-sm">
          <span className="text-ink-muted">Kaybedilen:</span>
          <span className="rounded-full bg-error-surface px-2.5 py-0.5 text-xs font-semibold text-error">{lostCount}</span>
        </div>
      </div>
    </>
  );
}
