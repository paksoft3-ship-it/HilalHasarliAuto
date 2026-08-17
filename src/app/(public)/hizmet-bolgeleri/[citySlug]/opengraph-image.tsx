import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import { getCity, publishedCities } from "@/config/cities";
import { siteConfig } from "@/config/site";

/** Per-city social card, e.g. "İstanbul Hasarlı Araç Alımı". */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return publishedCities.map((c) => ({ citySlug: c.slug }));
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ citySlug: string }>;
}) {
  const { citySlug } = await params;
  const city = getCity(citySlug);
  const font = await readFile(
    new URL("../../../../assets/og-font.ttf", import.meta.url),
  );
  const cityName = city?.name ?? "Türkiye";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#faf7f2",
          padding: "64px 72px",
          fontFamily: "Manrope",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 18,
              height: 56,
              borderRadius: 9,
              background: "#7a2432",
            }}
          />
          <div style={{ fontSize: 40, color: "#7a2432" }}>{siteConfig.brandName}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 84, lineHeight: 1.05, color: "#161b1f", maxWidth: 1000 }}>
            {`${cityName} Hasarlı Araç Alımı`}
          </div>
          <div style={{ fontSize: 30, color: "#5c5850", maxWidth: 920 }}>
            Kazalı, pert, arızalı ve hurda araçlar yerinden değerlendirilir
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#161b1f",
              color: "#ffffff",
              fontSize: 30,
              padding: "16px 32px",
              borderRadius: 999,
            }}
          >
            {siteConfig.phoneDisplay}
          </div>
          <div style={{ fontSize: 28, color: "#c89a4b" }}>hasarliaracalan.com</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Manrope", data: font, weight: 700, style: "normal" }],
    },
  );
}
