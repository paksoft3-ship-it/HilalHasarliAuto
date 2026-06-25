import { getSessionUser } from "@/lib/auth/session";
import { getExclusionIps } from "@/db/repo/click-protection";

export const dynamic = "force-dynamic";

const GOOGLE_ADS_IP_LIMIT = 500;

/**
 * Google Ads IP-exclusion list: manually-excluded IPs, one per line. Google
 * caps an exclusion list at 500 entries — we cap here and note any overflow.
 */
export async function GET() {
  const user = await getSessionUser();
  if (!user || !user.permissions.has("adspend.read")) {
    return new Response("Forbidden", { status: 403 });
  }

  const ips = await getExclusionIps();
  const capped = ips.slice(0, GOOGLE_ADS_IP_LIMIT);
  const overflow = ips.length - capped.length;

  let body = capped.join("\n");
  if (overflow > 0) {
    body += `\n# NOT: ${overflow} ek IP, Google'ın 500 sınırını aştığı için bu listede yok. İkinci bir liste oluşturun.`;
  }

  return new Response(body || "# Hariç tutulacak IP yok.", {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "content-disposition": `attachment; filename="google-ads-exclusion-ips.txt"`,
    },
  });
}
