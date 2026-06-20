"use client";

import Script from "next/script";
import { tracking, analyticsConfigured } from "@/config/tracking";

/**
 * Google Consent Mode v2 (default = denied) + GTM/GA4 loader. Only rendered
 * when an ID is configured, and only on the public site (not /admin).
 * Consent is updated by the cookie-consent component via the dataLayer.
 */
export function AnalyticsScripts() {
  if (!analyticsConfigured) return null;

  return (
    <>
      <Script id="consent-default" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
gtag('js',new Date());`}
      </Script>

      {tracking.gtmId ? (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${tracking.gtmId}');`}
        </Script>
      ) : tracking.ga4Id ? (
        <>
          <Script
            id="ga4-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${tracking.ga4Id}`}
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`gtag('config','${tracking.ga4Id}');`}
          </Script>
        </>
      ) : null}
    </>
  );
}
