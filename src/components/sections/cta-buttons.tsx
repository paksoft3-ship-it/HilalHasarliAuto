"use client";

import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { buttonClasses } from "@/components/ui/button";
import { useSettings } from "@/components/providers/settings-provider";
import { telHref, whatsappHref } from "@/lib/settings/shared";
import { cn } from "@/lib/utils";

/**
 * Primary conversion group. Calls convert better than the form here, so the
 * lead CTA is a phone call:
 * 1) Hemen Ara (burgundy, tel:) 2) WhatsApp (green) 3) Ara (charcoal/outline).
 * The quote form stays reachable via the menu/footer.
 */
export function CtaGroup({
  size = "lg",
  showPhone = false,
  whatsappMessage,
  className,
  location = "cta",
}: {
  size?: "md" | "lg";
  showPhone?: boolean;
  whatsappMessage?: string;
  className?: string;
  /** Where this CTA group sits — reported to GTM as the click `location`. */
  location?: string;
}) {
  const settings = useSettings();
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap", className)}>
      <a
        href={telHref(settings)}
        data-track="phone_click"
        data-track-location={location}
        className={buttonClasses({ variant: "primary", size })}
      >
        <Phone size={18} />
        Hemen Ara
      </a>
      <a
        href={whatsappHref(settings, whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        data-track="whatsapp_click"
        data-track-location={location}
        className={buttonClasses({ variant: "whatsapp", size })}
      >
        <WhatsAppIcon size={18} />
        WhatsApp’tan Fotoğraf Gönder
      </a>
      {showPhone && (
        <a href={telHref(settings)} data-track="phone_click" data-track-location={location} className={buttonClasses({ variant: "dark", size })}>
          <Phone size={18} />
          {settings.phoneDisplay}
        </a>
      )}
    </div>
  );
}
