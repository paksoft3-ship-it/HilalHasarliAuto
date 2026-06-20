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
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_24px_rgba(22,27,31,0.12)] lg:hidden">
      <div className="flex items-stretch gap-2 px-3 py-2.5">
        <a
          href={telLink()}
          data-track="phone_click"
          aria-label="Ara"
          className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-[12px] bg-charcoal-950 text-white"
        >
          <Phone size={20} />
        </a>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          data-track="whatsapp_click"
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[12px] bg-whatsapp text-[15px] font-semibold text-white"
        >
          <WhatsAppIcon size={20} />
          WhatsApp
        </a>
        <Link
          href={routes.getOffer}
          className="flex h-12 flex-[1.3] items-center justify-center rounded-[12px] bg-burgundy-700 text-[15px] font-bold text-white"
        >
          Hemen Teklif Al
        </Link>
      </div>
    </div>
  );
}
