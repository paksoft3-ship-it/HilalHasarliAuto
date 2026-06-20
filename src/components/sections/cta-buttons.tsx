import Link from "next/link";
import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { buttonClasses } from "@/components/ui/button";
import { routes } from "@/config/navigation";
import { whatsappLink, telLink, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Primary conversion group, honoring the design hierarchy:
 * 1) Teklif Al (burgundy) 2) WhatsApp (green) 3) Ara (charcoal/outline).
 */
export function CtaGroup({
  size = "lg",
  showPhone = false,
  whatsappMessage,
  className,
}: {
  size?: "md" | "lg";
  showPhone?: boolean;
  whatsappMessage?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap", className)}>
      <Link href={routes.getOffer} className={buttonClasses({ variant: "primary", size })}>
        Hemen Teklif Al
      </Link>
      <a
        href={whatsappLink(whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        data-track="whatsapp_click"
        className={buttonClasses({ variant: "whatsapp", size })}
      >
        <WhatsAppIcon size={18} />
        WhatsApp’tan Fotoğraf Gönder
      </a>
      {showPhone && (
        <a href={telLink()} data-track="phone_click" className={buttonClasses({ variant: "dark", size })}>
          <Phone size={18} />
          {siteConfig.phoneDisplay}
        </a>
      )}
    </div>
  );
}
