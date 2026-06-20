import { requireUser, can } from "@/lib/auth/guard";
import { getAdminLocale, translator } from "@/lib/i18n/admin";
import { AdminShell, type NavItem } from "@/components/admin/admin-shell";
import type { PermissionCode } from "@/lib/auth/rbac";

const NAV: { key: string; href: string; perm: PermissionCode }[] = [
  { key: "dashboard", href: "/admin", perm: "dashboard.view" },
  { key: "leads", href: "/admin/leads", perm: "leads.read" },
  { key: "funnel", href: "/admin/funnel", perm: "leads.read" },
  { key: "calls", href: "/admin/calls", perm: "calls.read" },
  { key: "whatsapp", href: "/admin/whatsapp", perm: "whatsapp.read" },
  { key: "buyers", href: "/admin/buyers", perm: "buyers.read" },
  { key: "offers", href: "/admin/offers", perm: "offers.read" },
  { key: "deals", href: "/admin/deals", perm: "deals.read" },
  { key: "finance", href: "/admin/finance", perm: "finance.read" },
  { key: "adspend", href: "/admin/adspend", perm: "adspend.read" },
  { key: "analytics", href: "/admin/analytics", perm: "analytics.view" },
  { key: "seo", href: "/admin/seo", perm: "seo.read" },
  { key: "content", href: "/admin/content", perm: "content.read" },
  { key: "media", href: "/admin/media", perm: "media.read" },
  { key: "users", href: "/admin/users", perm: "users.manage" },
  { key: "settings", href: "/admin/settings", perm: "settings.manage" },
  { key: "audit", href: "/admin/audit", perm: "audit.read" },
];

// Authenticated pages must always evaluate the session at request time.
export const dynamic = "force-dynamic";

// Modules implemented; others render as "coming soon".
const IMPLEMENTED = new Set([
  "dashboard", "leads", "funnel", "calls", "whatsapp",
  "buyers", "deals", "finance", "adspend", "analytics", "content", "media",
]);

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const locale = await getAdminLocale();
  const t = translator(locale);

  const nav: NavItem[] = NAV.filter((n) => can(user, n.perm)).map((n) => ({
    key: n.key,
    href: n.href,
    label: t(`nav.${n.key}`),
    enabled: IMPLEMENTED.has(n.key),
  }));

  return (
    <AdminShell
      nav={nav}
      userName={user.name}
      userEmail={user.email}
      locale={locale}
      logoutLabel={t("common.logout")}
    >
      {children}
    </AdminShell>
  );
}
