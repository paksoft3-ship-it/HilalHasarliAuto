"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNav, routes } from "@/config/navigation";
import { buttonClasses } from "@/components/ui/button";
import { useSettings } from "@/components/providers/settings-provider";
import { telHref } from "@/lib/settings/shared";
import { Logo } from "./logo";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const settings = useSettings();
  const tel = telHref(settings);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === routes.home ? pathname === href : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-charcoal-950 text-white transition-shadow",
        "border-b border-white/10",
        scrolled && "shadow-[0_8px_30px_rgba(22,27,31,0.25)]",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <Logo brandName={settings.brandName} />

        {/* Desktop nav */}
        <nav aria-label="Ana menü" className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active ? "text-white" : "text-white/70 hover:text-white",
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gold-600" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop right: phone + CTA */}
        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={tel}
            data-track="phone_click"
            data-track-location="header"
            className="flex items-center gap-2.5 rounded-md px-2 py-1 transition-colors hover:bg-white/5"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/8 text-gold-600">
              <Phone size={18} strokeWidth={2} />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[15px] font-bold">{settings.phoneDisplay}</span>
              <span className="text-[11px] font-medium text-white/55">
                {settings.workingHours}
              </span>
            </span>
          </a>
          <Link href={routes.getOffer} data-track="quote_click" data-track-location="header" className={buttonClasses({ size: "md" })}>
            Hemen Teklif Al
          </Link>
        </div>

        {/* Mobile right: phone icon + menu */}
        <div className="flex items-center gap-1 lg:hidden">
          <a
            href={tel}
            data-track="phone_click"
            data-track-location="header_mobile"
            aria-label="Bizi arayın"
            className="grid h-11 w-11 place-items-center rounded-full text-white hover:bg-white/8"
          >
            <Phone size={20} />
          </a>
          <button
            type="button"
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full text-white hover:bg-white/8"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-charcoal-950 lg:hidden">
          <nav aria-label="Mobil menü" className="container-page flex flex-col py-3">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "rounded-md px-3 py-3 text-[15px] font-medium",
                  isActive(item.href)
                    ? "bg-white/8 text-white"
                    : "text-white/80 hover:bg-white/5",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={routes.getOffer}
              onClick={() => setMenuOpen(false)}
              data-track="quote_click"
              data-track-location="mobile_menu"
              className={buttonClasses({ size: "lg", fullWidth: true, className: "mt-3" })}
            >
              Hemen Teklif Al
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
