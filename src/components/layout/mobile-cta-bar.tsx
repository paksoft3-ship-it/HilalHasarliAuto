import Link from "next/link";
import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { telLink, whatsappLink } from "@/config/site";
import { routes } from "@/config/navigation";

/**
 * Mobile sticky action bar (design.md §20). Priority: Teklif Al (burgundy,
 * largest) · WhatsApp (green) · Ara (charcoal). Hidden on lg+.
 */
export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="grid grid-cols-[1fr_1fr_1.4fr] gap-2 px-3 py-2.5">
        <a
          href={telLink()}
          data-track="phone_click"
          className="flex h-12 items-center justify-center gap-1.5 rounded-[10px] bg-charcoal-950 text-sm font-semibold text-white"
        >
          <Phone size={18} />
          Ara
        </a>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          data-track="whatsapp_click"
          className="flex h-12 items-center justify-center gap-1.5 rounded-[10px] bg-whatsapp text-sm font-semibold text-white"
        >
          <WhatsAppIcon size={18} />
          WhatsApp
        </a>
        <Link
          href={routes.getOffer}
          className="flex h-12 items-center justify-center rounded-[10px] bg-burgundy-700 text-sm font-semibold text-white"
        >
          Teklif Al
        </Link>
      </div>
    </div>
  );
}
