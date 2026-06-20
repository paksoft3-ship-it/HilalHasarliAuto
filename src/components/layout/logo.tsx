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
  brandName = siteConfig.brandName,
}: {
  surface?: "dark" | "light";
  className?: string;
  brandName?: string;
}) {
  const src = surface === "dark" ? "/images/logo/dark-logo.png" : "/images/logo/light-logo.png";
  return (
    <Link
      href="/"
      aria-label={`${brandName} ana sayfa`}
      className={cn("inline-flex items-center", className)}
    >
      <Image
        src={src}
        alt={brandName}
        width={318}
        height={50}
        priority
        sizes="(max-width: 768px) 210px, 260px"
        className="h-10 w-auto md:h-12"
      />
    </Link>
  );
}
