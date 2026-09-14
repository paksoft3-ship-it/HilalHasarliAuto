"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNav, routes } from "@/config/navigation";
import { buttonClasses } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { useSettings } from "@/components/providers/settings-provider";
import { telHref, whatsappHref } from "@/lib/settings/shared";
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
      {/*
        The header uses its own wider, lighter-padded container instead of
        the sitewide `.container-page` (max-width 1480px, up to 88px side
        padding at desktop) — that padding was eating into the room the nav
        needs, and the header doesn't need to line up edge-for-edge with the
        hero/content sections below it.
      */}
      <div className="mx-auto flex h-16 w-full max-w-[1760px] items-center justify-between px-6 md:h-20 md:px-8 lg:px-10">
        <Logo brandName={settings.brandName} />

        {/* Desktop nav */}
        <nav aria-label="Ana menü" className="hidden shrink-0 items-center gap-1 min-[1320px]:flex">
          {mainNav.map((item) => {
            const active = isActive(item.href);
            if (!item.children) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active ? "text-white" : "text-white/70 hover:text-white",
                  )}
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gold-600" />
                  )}
                </Link>
              );
            }
            // Items with children: CSS-only dropdown (hover + keyboard
            // focus-within), no JS state — closes itself when the mouse or
            // focus leaves, works with Tab navigation.
            return (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  aria-haspopup="true"
                  className={cn(
                    "relative flex items-center gap-1 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active ? "text-white" : "text-white/70 hover:text-white",
                  )}
                >
                  {item.label}
                  <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                  {active && (
                    <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gold-600" />
                  )}
                </Link>
                <div
                  className="invisible absolute left-0 top-full z-10 w-56 translate-y-1 rounded-xl border border-white/10 bg-charcoal-950 p-2 opacity-0 shadow-[0_16px_40px_rgba(22,27,31,0.35)] transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
                  role="menu"
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      role="menuitem"
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-white/75 transition-colors hover:bg-white/8 hover:text-white"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Desktop right: phone + CTA */}
        <div className="hidden shrink-0 items-center gap-4 min-[1320px]:flex">
          <a
            href={whatsappHref(settings)}
            target="_blank"
            rel="noopener noreferrer"
            data-track="whatsapp_click"
            data-track-location="header"
            className="flex items-center gap-2.5 rounded-md px-2 py-1 transition-colors hover:bg-white/5"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-whatsapp/15 text-whatsapp">
              <WhatsAppIcon size={18} />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[15px] font-bold">{settings.phoneDisplay}</span>
              <span className="text-[11px] font-medium text-white/55">
                WhatsApp · {settings.workingHours}
              </span>
            </span>
          </a>
          <a href={tel} data-track="phone_click" data-track-location="header" className={buttonClasses({ size: "md" })}>
            <Phone size={16} />
            Hemen Ara
          </a>
        </div>

        {/* Mobile right: phone icon + menu */}
        <div className="flex items-center gap-1 min-[1320px]:hidden">
          <a
            href={tel}
            data-track="phone_click"
            data-track-location="header_mobile"
            aria-label="Bizi arayın"
            className="grid h-11 w-11 place-items-center rounded-full bg-burgundy-700 text-white shadow-sm transition-colors hover:bg-burgundy-800"
          >
            <Phone size={22} strokeWidth={2.5} />
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
        <div className="border-t border-white/10 bg-charcoal-950 min-[1320px]:hidden">
          <nav aria-label="Mobil menü" className="container-page flex flex-col py-3">
            {mainNav.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-3 text-[15px] font-medium",
                    isActive(item.href)
                      ? "bg-white/8 text-white"
                      : "text-white/80 hover:bg-white/5",
                  )}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-3 flex flex-col border-l border-white/10 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMenuOpen(false)}
                        className="rounded-md px-3 py-2 text-[14px] font-medium text-white/65 hover:bg-white/5 hover:text-white"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <a
              href={tel}
              onClick={() => setMenuOpen(false)}
              data-track="phone_click"
              data-track-location="mobile_menu"
              className={buttonClasses({ size: "lg", fullWidth: true, className: "mt-3" })}
            >
              <Phone size={18} />
              Hemen Ara
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
