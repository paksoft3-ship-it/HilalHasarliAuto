import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Full-bleed hero. Desktop image: damaged cars on the right with a cream blur
 * on the left for content. Mobile image (portrait, /heroes/mobile/*): cars at
 * the bottom with a cream blur at the top for content. The mobile variant is
 * derived from the desktop path automatically.
 */
export function PageHero({
  image,
  eyebrow,
  title,
  description,
  children,
  size = "md",
}: {
  /** Desktop image path, e.g. "/images/heroes/3.png". */
  image: string;
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const mobileImage = image.replace("/heroes/", "/heroes/mobile/");

  const pad =
    size === "lg"
      ? "py-14 md:py-24 lg:py-28"
      : size === "sm"
        ? "py-10 md:py-14"
        : "py-12 md:py-20";

  // Mobile gets a min height so the car photo shows below the top content.
  const minH = size === "sm" ? "min-h-[26rem]" : "min-h-[32rem]";

  return (
    <section className={cn("relative isolate flex flex-col overflow-hidden bg-cream-50 md:block", minH, "md:min-h-0")}>
      {/* Mobile image — cars at bottom, blur at top */}
      <Image
        src={mobileImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-bottom md:hidden"
      />
      {/* Desktop image — cars right, blur left */}
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 hidden object-cover object-right md:block"
      />
      {/* Mobile overlay (top → bottom) */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cream-50 via-cream-50/80 to-cream-50/10 md:hidden" />
      {/* Desktop overlay (left → right) */}
      <div className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-cream-50 via-cream-50/85 to-cream-50/20 md:block lg:to-transparent" />

      <div className={cn("container-page", pad)}>
        <div className="max-w-xl">
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <h1 className="text-[30px] font-bold leading-[1.1] text-ink md:text-[44px]">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-[540px] text-[16px] leading-relaxed text-ink-secondary md:text-[18px]">
              {description}
            </p>
          )}
          {children && <div className="mt-7">{children}</div>}
        </div>
      </div>
    </section>
  );
}
