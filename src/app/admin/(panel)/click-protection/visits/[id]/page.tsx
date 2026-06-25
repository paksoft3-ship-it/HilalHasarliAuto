import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/guard";
import { PageTitle } from "@/components/admin/bits";
import { getVisit } from "@/db/repo/click-protection";

export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-2 text-sm">
      <span className="text-ink-muted">{label}</span>
      <span className="text-right font-medium text-ink break-all">{value ?? "—"}</span>
    </div>
  );
}

export default async function VisitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("adspend.read");
  const { id } = await params;
  const v = await getVisit(id);
  if (!v) notFound();

  return (
    <>
      <PageTitle title="Ziyaret Detayı" subtitle="Kanıt için tüm yakalanan sinyaller" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[14px] border border-line bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold text-ink">Kaynak & Ağ</h3>
          <Row label="IP" value={<span className="font-mono">{v.ipAddress}</span>} />
          <Row label="gclid" value={v.gclid} />
          <Row label="gbraid / wbraid" value={`${v.gbraid ?? "—"} / ${v.wbraid ?? "—"}`} />
          <Row label="Açılış sayfası" value={v.landingPage} />
          <Row label="Referrer" value={v.referrer} />
          <Row label="UTM kaynak/araç" value={`${v.utmSource ?? "—"} / ${v.utmMedium ?? "—"}`} />
          <Row label="UTM kampanya" value={v.utmCampaign} />
          <Row label="Ülke / ISP" value={`${v.country ?? "—"} / ${v.isp ?? "—"}`} />
          <Row label="Veri merkezi / VPN / Proxy" value={`${v.isDatacenter ? "✓" : "✗"} / ${v.isVpn ? "✓" : "✗"} / ${v.isProxy ? "✓" : "✗"}`} />
          <Row label="User-Agent" value={<span className="text-xs">{v.userAgent}</span>} />
        </div>

        <div className="rounded-[14px] border border-line bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold text-ink">Cihaz & Davranış</h3>
          <Row label="Oturum" value={<span className="font-mono text-xs">{v.sessionId}</span>} />
          <Row label="Parmak izi" value={<span className="font-mono text-xs">{v.fingerprintHash}</span>} />
          <Row label="Canvas üretildi" value={v.hasCanvas == null ? "—" : v.hasCanvas ? "✓" : "✗"} />
          <Row label="Ekran" value={v.screen} />
          <Row label="Saat dilimi" value={v.timezone} />
          <Row label="Dil / Platform" value={`${v.language ?? "—"} / ${v.platform ?? "—"}`} />
          <Row label="CPU çekirdek" value={v.hardwareConcurrency} />
          <Row label="Sayfada süre" value={v.timeOnPage == null ? "—" : `${v.timeOnPage} sn`} />
          <Row label="Fare hareketi" value={v.mouseMoved == null ? "—" : v.mouseMoved ? "✓" : "✗"} />
          <Row label="Maks. kaydırma" value={`%${v.maxScrollDepth ?? 0}`} />
          <Row label="Tıklama sayısı" value={v.clickCount} />
          <Row label="Dönüşüm" value={v.converted ? "✓" : "✗"} />
        </div>
      </div>

      <div className="mt-6 rounded-[14px] border border-line bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold text-ink">
          Dolandırıcılık skoru: <span className="text-burgundy-700">{v.fraudScore}</span>
        </h3>
        {(v.fraudReasons ?? []).length === 0 ? (
          <p className="text-sm text-ink-muted">Sinyal yok.</p>
        ) : (
          <ul className="space-y-1.5">
            {(v.fraudReasons ?? []).map((r, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span className="text-ink-secondary">{r.label}</span>
                <span className="font-semibold text-error">+{r.weight}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
