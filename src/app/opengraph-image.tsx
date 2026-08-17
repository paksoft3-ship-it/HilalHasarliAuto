import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

/**
 * Default social card for every page without a more specific image
 * (services/blog/guides pass their own photos). Generated at build time;
 * the bundled TTF (Manrope) covers Turkish glyphs the default OG font lacks.
 */
export const alt = "Hasarlı Araç Alan — Türkiye geneli hasarlı ve kazalı araç alımı";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const font = await readFile(new URL("../assets/og-font.ttf", import.meta.url));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#161b1f",
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
          <div style={{ fontSize: 40, color: "#f5f1ea" }}>{siteConfig.brandName}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 70, lineHeight: 1.08, color: "#ffffff", maxWidth: 1000 }}>
            {"Türkiye Geneli Hasarlı ve Kazalı Araç Alımı"}
          </div>
          <div style={{ fontSize: 30, color: "#c3bcb2", maxWidth: 920 }}>
            Ücretsiz değerlendirme · Ücretsiz çekici · Noterde güvenli devir
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#7a2432",
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
