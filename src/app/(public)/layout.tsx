import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { MobileCtaBar } from "@/components/layout/mobile-cta-bar";
import { CookieConsent } from "@/components/consent/cookie-consent";
import { AnalyticsScripts } from "@/components/tracking/analytics-scripts";
import { ClarityProvider } from "@/components/tracking/clarity-provider";
import { TrackingProvider } from "@/components/tracking/tracking-provider";
import { AdVisitCapture } from "@/components/tracking/ad-visit-capture";
import { ClickProtectionTracker } from "@/components/tracking/click-protection-tracker";
import { SettingsProvider } from "@/components/providers/settings-provider";
import { getPublicSettings } from "@/lib/settings/server";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getPublicSettings();
  return (
    <SettingsProvider value={settings}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <MobileCtaBar />
        <CookieConsent />
        <AnalyticsScripts />
        <ClarityProvider />
        <TrackingProvider />
        <ClickProtectionTracker />
        <AdVisitCapture />
      </div>
    </SettingsProvider>
  );
}
