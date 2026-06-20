import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { MobileCtaBar } from "@/components/layout/mobile-cta-bar";
import { CookieConsent } from "@/components/consent/cookie-consent";
import { AnalyticsScripts } from "@/components/tracking/analytics-scripts";
import { TrackingProvider } from "@/components/tracking/tracking-provider";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <MobileCtaBar />
      <CookieConsent />
      <AnalyticsScripts />
      <TrackingProvider />
    </div>
  );
}
