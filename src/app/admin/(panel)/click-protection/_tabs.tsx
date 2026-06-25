import Link from "next/link";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "dashboard", href: "/admin/click-protection", label: "Genel Bakış" },
  { key: "flagged", href: "/admin/click-protection/flagged", label: "İşaretli IP'ler" },
  { key: "visits", href: "/admin/click-protection/visits", label: "Ziyaret Kaydı" },
  { key: "refund", href: "/admin/click-protection/refund", label: "İade Kanıtı" },
];

export function ClickProtectionTabs({ active }: { active: string }) {
  return (
    <div className="mb-6 flex flex-wrap gap-1 border-b border-line">
      {TABS.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          className={cn(
            "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium",
            active === t.key
              ? "border-burgundy-700 text-burgundy-700"
              : "border-transparent text-ink-muted hover:text-ink",
          )}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
