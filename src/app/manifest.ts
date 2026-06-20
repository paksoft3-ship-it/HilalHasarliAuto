import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.brandName} — Hasarlı Araç Alımı`,
    short_name: siteConfig.brandName,
    description:
      "Hasarlı, kazalı, arızalı ve çalışmayan araçlar için Türkiye geneli değerlendirme.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f4ed",
    theme_color: "#161b1f",
    lang: "tr",
    icons: [],
  };
}
