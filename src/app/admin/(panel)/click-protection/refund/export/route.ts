import { getSessionUser } from "@/lib/auth/session";
import { getRefundRows } from "@/db/repo/click-protection";

export const dynamic = "force-dynamic";

function csvCell(s: string): string {
  return `"${s.replace(/"/g, '""')}"`;
}

/** Invalid-click refund evidence as CSV for a Google Ads claim. */
export async function GET() {
  const user = await getSessionUser();
  if (!user || !user.permissions.has("adspend.read")) {
    return new Response("Forbidden", { status: 403 });
  }

  const rows = await getRefundRows(90);
  const header = ["timestamp_utc", "ip_address", "gclid", "fraud_score", "fraud_reasons", "country", "landing_page"];
  const lines = [header.join(",")];

  for (const r of rows) {
    lines.push(
      [
        csvCell(r.createdAt.toISOString()),
        csvCell(r.ipAddress),
        csvCell(r.gclid ?? ""),
        String(r.fraudScore),
        csvCell((r.reasons ?? []).map((x) => x.code).join("; ")),
        csvCell(r.country ?? ""),
        csvCell(r.landingPage ?? ""),
      ].join(","),
    );
  }

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="invalid-click-refund-evidence.csv"`,
    },
  });
}
