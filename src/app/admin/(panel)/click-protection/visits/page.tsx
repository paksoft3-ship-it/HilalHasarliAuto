import Link from "next/link";
import { requirePermission } from "@/lib/auth/guard";
import { isDbConfigured } from "@/db";
import { PageTitle, NotConfigured } from "@/components/admin/bits";
import { listVisits, type VisitFilters } from "@/db/repo/click-protection";
import { ClickProtectionTabs } from "../_tabs";

export const dynamic = "force-dynamic";

const dt = (d: Date) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Istanbul" }).format(d);

export default async function VisitsLogPage({
  searchParams,
}: {
  searchParams: Promise<{ ip?: string; gclid?: string; converted?: string; minScore?: string; page?: string }>;
}) {
  await requirePermission("adspend.read");
  const sp = await searchParams;

  if (!isDbConfigured) {
    return (
      <>
        <PageTitle title="Ziyaret Kaydı" />
        <ClickProtectionTabs active="visits" />
        <NotConfigured message="Veritabanı bağlı değil." />
      </>
    );
  }

  const filters: VisitFilters = {
    ip: sp.ip || undefined,
    gclid: sp.gclid || undefined,
    convertedOnly: sp.converted === "1" ? true : undefined,
    minScore: sp.minScore ? Number(sp.minScore) : undefined,
    page: sp.page ? Number(sp.page) : 1,
  };
  const { rows, total } = await listVisits(filters);

  return (
    <>
      <PageTitle title="Ziyaret Kaydı" subtitle={`${total} ziyaret`} />
      <ClickProtectionTabs active="visits" />

      <form className="mb-4 flex flex-wrap items-end gap-3 rounded-[14px] border border-line bg-white p-4">
        <label className="flex flex-col gap-1 text-xs text-ink-muted">
          IP
          <input name="ip" defaultValue={sp.ip ?? ""} className="h-9 w-44 rounded-md border border-line px-2 text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-xs text-ink-muted">
          gclid
          <input name="gclid" defaultValue={sp.gclid ?? ""} className="h-9 w-44 rounded-md border border-line px-2 text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-xs text-ink-muted">
          Min. skor
          <input name="minScore" type="number" defaultValue={sp.minScore ?? ""} className="h-9 w-24 rounded-md border border-line px-2 text-sm" />
        </label>
        <label className="flex items-center gap-1.5 text-sm text-ink">
          <input type="checkbox" name="converted" value="1" defaultChecked={sp.converted === "1"} /> Dönüşmüş
        </label>
        <button className="h-9 rounded-md border border-line bg-white px-4 text-sm font-medium hover:bg-cream-100">Filtrele</button>
      </form>

      <div className="overflow-x-auto rounded-[14px] border border-line bg-white">
        <table className="w-full min-w-[920px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase text-ink-muted">
              <th className="p-3">Zaman</th>
              <th className="p-3">IP</th>
              <th className="p-3">gclid</th>
              <th className="p-3">Skor</th>
              <th className="p-3">Süre/Kaydırma</th>
              <th className="p-3">Fare</th>
              <th className="p-3">Dönüşüm</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 && (
              <tr><td colSpan={8} className="p-6 text-center text-ink-muted">Kayıt bulunamadı.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="p-3 whitespace-nowrap text-xs">{dt(r.createdAt)}</td>
                <td className="p-3 font-mono text-xs">{r.ipAddress}</td>
                <td className="p-3 max-w-[140px] truncate text-xs">{r.gclid ?? "—"}</td>
                <td className="p-3 font-semibold">{r.fraudScore}</td>
                <td className="p-3 text-xs">{r.timeOnPage ?? "—"}sn / %{r.maxScrollDepth ?? 0}</td>
                <td className="p-3 text-xs">{r.mouseMoved == null ? "—" : r.mouseMoved ? "✓" : "✗"}</td>
                <td className="p-3 text-xs">{r.converted ? "✓" : ""}</td>
                <td className="p-3">
                  <Link href={`/admin/click-protection/visits/${r.id}`} className="text-xs font-medium text-burgundy-700 hover:underline">
                    Detay
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
