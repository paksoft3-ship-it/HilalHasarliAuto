import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

/** Text-based brand mark (design.md §14): Manrope semibold, compact mark. */
export function Logo({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const textColor = tone === "light" ? "text-white" : "text-ink";
  const subColor = tone === "light" ? "text-white/55" : "text-ink-muted";
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.brandName} ana sayfa`}
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      {/* Compact geometric mark — burgundy tile with gold corner accent */}
      <span className="relative grid h-9 w-9 place-items-center rounded-[9px] bg-burgundy-700">
        <span className="text-[15px] font-bold leading-none text-white">ON</span>
        <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-gold-600" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("text-[17px] font-bold tracking-tight", textColor)}>
          {siteConfig.brandName}
        </span>
        <span className={cn("mt-1 text-[10px] font-medium tracking-wide", subColor)}>
          {siteConfig.brandTagline}
        </span>
      </span>
    </Link>
  );
}
