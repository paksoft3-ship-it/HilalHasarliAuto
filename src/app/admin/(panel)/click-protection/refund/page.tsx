import Link from "next/link";
import { requirePermission } from "@/lib/auth/guard";
import { isDbConfigured } from "@/db";
import { PageTitle, NotConfigured } from "@/components/admin/bits";
import { getRefundRows } from "@/db/repo/click-protection";
import { ClickProtectionTabs } from "../_tabs";

export const dynamic = "force-dynamic";

const dt = (d: Date) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Istanbul" }).format(d);

export default async function RefundEvidencePage() {
  await requirePermission("adspend.read");

  if (!isDbConfigured) {
    return (
      <>
        <PageTitle title="İade Kanıtı" />
        <ClickProtectionTabs active="refund" />
        <NotConfigured message="Veritabanı bağlı değil." />
      </>
    );
  }

  const rows = await getRefundRows(30);

  return (
    <>
      <PageTitle
        title="İade Kanıtı"
        subtitle="Google'a geçersiz tıklama iade talebi için işaretli tıklamalar (son 30 gün)"
      />
      <ClickProtectionTabs active="refund" />

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-ink-muted">{rows.length} işaretli tıklama</p>
        <Link
          href="/admin/click-protection/refund/export"
          prefetch={false}
          className="rounded-md bg-burgundy-700 px-4 py-2 text-sm font-semibold text-white hover:bg-burgundy-800"
        >
          CSV indir
        </Link>
      </div>

      <div className="overflow-x-auto rounded-[14px] border border-line bg-white">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase text-ink-muted">
              <th className="p-3">Zaman</th>
              <th className="p-3">IP</th>
              <th className="p-3">gclid</th>
              <th className="p-3">Skor</th>
              <th className="p-3">Sebepler</th>
              <th className="p-3">Ülke</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-ink-muted">İşaretli tıklama yok.</td></tr>
            )}
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="p-3 whitespace-nowrap text-xs">{dt(r.createdAt)}</td>
                <td className="p-3 font-mono text-xs">{r.ipAddress}</td>
                <td className="p-3 max-w-[160px] truncate text-xs">{r.gclid ?? "—"}</td>
                <td className="p-3 font-semibold">{r.fraudScore}</td>
                <td className="p-3 text-xs text-ink-secondary">{(r.reasons ?? []).map((x) => x.label).join("; ")}</td>
                <td className="p-3 text-xs">{r.country ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
