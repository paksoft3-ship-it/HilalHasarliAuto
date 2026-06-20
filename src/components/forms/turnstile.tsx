import Script from "next/script";
import { security } from "@/config/security";

/**
 * Cloudflare Turnstile widget. Renders only when a site key is configured;
 * the widget injects a `cf-turnstile-response` field into the surrounding form.
 */
export function Turnstile() {
  if (!security.turnstileSiteKey) return null;
  return (
    <div>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <div className="cf-turnstile" data-sitekey={security.turnstileSiteKey} />
    </div>
  );
}
