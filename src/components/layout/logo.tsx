import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

/**
 * Brand logo image. `surface` selects the matching artwork:
 *  - "dark"  (charcoal header/footer) → dark-logo (light artwork on dark bg)
 *  - "light" (cream/white surfaces)    → light-logo (dark artwork on light bg)
 */
export function Logo({
  surface = "dark",
  className,
}: {
  surface?: "dark" | "light";
  className?: string;
}) {
  const src = surface === "dark" ? "/images/logo/dark-logo.png" : "/images/logo/light-logo.png";
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.brandName} ana sayfa`}
      className={cn("inline-flex items-center", className)}
    >
      <Image
        src={src}
        alt={siteConfig.brandName}
        width={240}
        height={60}
        priority
        sizes="(max-width: 768px) 150px, 190px"
        className="h-8 w-auto md:h-9"
      />
    </Link>
  );
}
