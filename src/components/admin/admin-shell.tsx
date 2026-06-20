"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Columns3,
  Phone,
  MessageCircle,
  Building2,
  FileText,
  Handshake,
  Wallet,
  Megaphone,
  BarChart3,
  Search,
  FileEdit,
  Image as ImageIcon,
  UserCog,
  Settings,
  ScrollText,
  Menu,
  X,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth/actions";
import { setAdminLocale } from "@/lib/i18n/actions";
import type { AdminLocale } from "@/lib/i18n/admin";
import { siteConfig } from "@/config/site";

const ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  leads: Users,
  funnel: Columns3,
  calls: Phone,
  whatsapp: MessageCircle,
  buyers: Building2,
  offers: FileText,
  deals: Handshake,
  finance: Wallet,
  adspend: Megaphone,
  analytics: BarChart3,
  seo: Search,
  content: FileEdit,
  media: ImageIcon,
  users: UserCog,
  settings: Settings,
  audit: ScrollText,
};

export interface NavItem {
  key: string;
  label: string;
  href: string;
  enabled: boolean;
}

export function AdminShell({
  nav,
  userName,
  userEmail,
  locale,
  logoutLabel,
  children,
}: {
  nav: NavItem[];
  userName: string;
  userEmail: string;
  locale: AdminLocale;
  logoutLabel: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
        <span className="grid h-8 w-8 place-items-center rounded-[8px] bg-burgundy-700 text-[13px] font-bold text-white">
          HA
        </span>
        <span className="text-[15px] font-bold text-white">{siteConfig.brandName}</span>
        <span className="ml-1 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-white/70">
          Yönetim
        </span>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {nav.map((item) => {
          const Icon = ICONS[item.key] ?? LayoutDashboard;
          const active = isActive(item.href);
          if (!item.enabled) {
            return (
              <span
                key={item.key}
                className="flex cursor-default items-center gap-3 rounded-[8px] px-3 py-2 text-sm text-white/35"
              >
                <Icon size={18} />
                {item.label}
                <span className="ml-auto text-[10px] text-white/30">yakında</span>
              </span>
            );
          }
          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-[8px] px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-burgundy-700 text-white" : "text-white/70 hover:bg-white/8 hover:text-white",
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-charcoal-950 lg:block">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-charcoal-950">{SidebarContent}</aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white px-4 md:px-6">
          <button
            type="button"
            aria-label="Menü"
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-md text-ink hover:bg-cream-100 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div className="ml-auto flex items-center gap-3">
            {/* Language switcher */}
            <div className="flex overflow-hidden rounded-md border border-line text-xs font-semibold">
              {(["tr", "en"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setAdminLocale(l)}
                  className={cn(
                    "px-2.5 py-1.5 uppercase transition-colors",
                    locale === l ? "bg-burgundy-700 text-white" : "bg-white text-ink-muted hover:bg-cream-100",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>

            <div className="hidden flex-col items-end leading-tight sm:flex">
              <span className="text-sm font-semibold text-ink">{userName}</span>
              <span className="text-xs text-ink-muted">{userEmail}</span>
            </div>

            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-md border border-line px-3 py-2 text-sm font-medium text-ink hover:bg-cream-100"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">{logoutLabel}</span>
              </button>
            </form>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>

      {/* Close icon for mobile drawer (top-right) */}
      {open && (
        <button
          type="button"
          aria-label="Kapat"
          onClick={() => setOpen(false)}
          className="fixed right-4 top-4 z-[60] grid h-10 w-10 place-items-center rounded-md bg-white text-ink lg:hidden"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
