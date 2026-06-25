import Link from "next/link";
import { requirePermission, can } from "@/lib/auth/guard";
import { isDbConfigured } from "@/db";
import { PageTitle, NotConfigured, Flash } from "@/components/admin/bits";
import { listFlaggedIps, type FlaggedFilters } from "@/db/repo/click-protection";
import { setIpStatus, whitelistIp } from "@/lib/admin/click-protection-actions";
import type { FlaggedStatus } from "@/lib/click-protection/types";
import { ClickProtectionTabs } from "../_tabs";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<FlaggedStatus, string> = {
  watching: "İzleniyor",
  flagged: "İşaretli (inceleme gerek)",
  excluded: "Hariç tutuldu",
  whitelisted: "Beyaz liste",
};

export default async function FlaggedIpsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    minScore?: string;
    converted?: string;
    datacenter?: string;
    page?: string;
    ok?: string;
    error?: string;
  }>;
}) {
  const user = await requirePermission("adspend.read");
  const sp = await searchParams;
  const manage = can(user, "adspend.write");

  if (!isDbConfigured) {
    return (
      <>
        <PageTitle title="İşaretli IP'ler" />
        <ClickProtectionTabs active="flagged" />
        <NotConfigured message="Veritabanı bağlı değil." />
      </>
    );
  }

  const filters: FlaggedFilters = {
    status: (["watching", "flagged", "excluded", "whitelisted"] as const).includes(
      sp.status as FlaggedStatus,
    )
      ? (sp.status as FlaggedStatus)
      : undefined,
    minScore: sp.minScore ? Number(sp.minScore) : undefined,
    hasConverted: sp.converted === "1" ? true : undefined,
    datacenterOnly: sp.datacenter === "1" ? true : undefined,
    page: sp.page ? Number(sp.page) : 1,
  };
  const { rows, total } = await listFlaggedIps(filters);

  return (
    <>
      <PageTitle title="İşaretli IP'ler" subtitle={`${total} kayıt — inceleme kuyruğu`} />
      <ClickProtectionTabs active="flagged" />
      <Flash ok={sp.ok} error={sp.error} />

      {/* Filters */}
      <form className="mb-4 flex flex-wrap items-end gap-3 rounded-[14px] border border-line bg-white p-4">
        <label className="flex flex-col gap-1 text-xs text-ink-muted">
          Durum
          <select name="status" defaultValue={sp.status ?? ""} className="h-9 rounded-md border border-line px-2 text-sm">
            <option value="">Tümü</option>
            <option value="flagged">İşaretli</option>
            <option value="watching">İzleniyor</option>
            <option value="excluded">Hariç tutuldu</option>
            <option value="whitelisted">Beyaz liste</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-ink-muted">
          Min. skor
          <input name="minScore" type="number" defaultValue={sp.minScore ?? ""} className="h-9 w-24 rounded-md border border-line px-2 text-sm" />
        </label>
        <label className="flex items-center gap-1.5 text-sm text-ink">
          <input type="checkbox" name="converted" value="1" defaultChecked={sp.converted === "1"} /> Dönüşmüş
        </label>
        <label className="flex items-center gap-1.5 text-sm text-ink">
          <input type="checkbox" name="datacenter" value="1" defaultChecked={sp.datacenter === "1"} /> Yalnızca veri merkezi
        </label>
        <button className="h-9 rounded-md border border-line bg-white px-4 text-sm font-medium hover:bg-cream-100">Filtrele</button>
        <Link
          href="/admin/click-protection/flagged/export"
          className="h-9 rounded-md bg-burgundy-700 px-4 py-2 text-sm font-semibold text-white hover:bg-burgundy-800"
          prefetch={false}
        >
          Hariç tutma listesini indir
        </Link>
      </form>

      <div className="overflow-x-auto rounded-[14px] border border-line bg-white">
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase text-ink-muted">
              <th className="p-3">IP</th>
              <th className="p-3">Skor</th>
              <th className="p-3">Tıkl./Dön.</th>
              <th className="p-3">Sebepler</th>
              <th className="p-3">Ülke / ISP</th>
              <th className="p-3">DC?</th>
              <th className="p-3">Durum</th>
              {manage && <th className="p-3">İşlem</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 && (
              <tr>
                <td colSpan={manage ? 8 : 7} className="p-6 text-center text-ink-muted">
                  Kayıt bulunamadı.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="p-3 font-mono text-xs">{r.ipAddress}</td>
                <td className="p-3 font-semibold">{r.fraudScore}</td>
                <td className="p-3 tabular-nums">
                  {r.totalClicks} / {r.totalConversions}
                </td>
                <td className="p-3 text-xs text-ink-secondary">
                  {(r.reasons ?? []).map((x) => x.label).join("; ") || "—"}
                </td>
                <td className="p-3 text-xs">
                  {r.country ?? "—"}
                  <span className="block text-ink-muted">{r.isp ?? ""}</span>
                </td>
                <td className="p-3">{r.isDatacenter ? "✓" : ""}</td>
                <td className="p-3 text-xs">{STATUS_LABEL[r.status as FlaggedStatus]}</td>
                {manage && (
                  <td className="p-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <form action={setIpStatus} className="flex items-center gap-1">
                        <input type="hidden" name="ip" value={r.ipAddress} />
                        <select name="status" defaultValue={r.status} className="h-8 rounded border border-line px-1 text-xs">
                          <option value="watching">İzle</option>
                          <option value="flagged">İşaretle</option>
                          <option value="excluded">Hariç tut</option>
                          <option value="whitelisted">Beyaz liste</option>
                        </select>
                        <button className="h-8 rounded bg-ink px-2 text-xs font-medium text-white">Uygula</button>
                      </form>
                      <form action={whitelistIp}>
                        <input type="hidden" name="ip" value={r.ipAddress} />
                        <button className="h-8 rounded border border-line px-2 text-xs hover:bg-cream-100">Beyaz liste</button>
                      </form>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-ink-muted">
        v1 otomatik hariç tutma yapmaz. Skoru ≥75 olanlar &quot;işaretli (inceleme gerek)&quot; olur; yalnızca yönetici onayı bir IP&apos;yi &quot;hariç tutuldu&quot; durumuna alır.
      </p>
    </>
  );
}
