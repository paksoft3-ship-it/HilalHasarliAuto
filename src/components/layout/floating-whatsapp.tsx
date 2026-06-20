import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { whatsappLink } from "@/config/site";

/**
 * Floating WhatsApp action. Sits above the mobile sticky bar
 * (bottom offset accounts for the 64px bar + safe area on small screens).
 */
export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      data-track="whatsapp_click"
      aria-label="WhatsApp ile iletişime geçin"
      className="fixed right-4 bottom-[calc(72px+env(safe-area-inset-bottom))] z-40 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-[0_12px_28px_rgba(22,164,71,0.24)] transition-transform hover:scale-105 md:bottom-6"
    >
      <WhatsAppIcon size={28} />
    </a>
  );
}
