import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"], // latin-ext covers Turkish characters
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: `${siteConfig.brandName} — Hasarlı Araç Alımı`,
    template: `%s | ${siteConfig.brandName}`,
  },
  description:
    "Hasarlı, kazalı, pert, arızalı, yanmış, sel hasarlı ve hurda araçlarınız için Türkiye geneli hızlı ve güvenilir değerlendirme.",
  applicationName: siteConfig.brandName,
  formatDetection: { telephone: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={manrope.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
