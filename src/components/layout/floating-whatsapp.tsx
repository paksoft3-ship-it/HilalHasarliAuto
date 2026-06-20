"use client";

import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { useSettings } from "@/components/providers/settings-provider";
import { whatsappHref } from "@/lib/settings/shared";

/** Floating WhatsApp action (desktop only — mobile uses the sticky bar). */
export function FloatingWhatsApp() {
  const settings = useSettings();
  return (
    <a
      href={whatsappHref(settings)}
      target="_blank"
      rel="noopener noreferrer"
      data-track="whatsapp_click"
      aria-label="WhatsApp ile iletişime geçin"
      className="fixed right-5 bottom-6 z-40 hidden h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-[0_12px_28px_rgba(22,164,71,0.24)] transition-transform hover:scale-105 lg:grid"
    >
      <WhatsAppIcon size={28} />
    </a>
  );
}
