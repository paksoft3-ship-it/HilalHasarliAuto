import { cn } from "@/lib/utils";

type Tone = "cream" | "white" | "alt" | "charcoal";

const toneClasses: Record<Tone, string> = {
  cream: "bg-cream-50 text-ink",
  white: "bg-white text-ink",
  alt: "bg-cream-100 text-ink",
  charcoal: "bg-charcoal-950 text-white",
};

/** Standard page section with consistent vertical rhythm (design.md §7). */
export function Section({
  tone = "cream",
  className,
  containerClassName,
  children,
  id,
}: {
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(toneClasses[tone], "py-12 md:py-16 lg:py-20", className)}
    >
      <div className={cn("container-page", containerClassName)}>{children}</div>
    </section>
  );
}

/** Eyebrow + heading + optional intro. Center-aligns short intros only. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  const titleColor = tone === "light" ? "text-white" : "text-ink";
  const introColor = tone === "light" ? "text-white/70" : "text-ink-muted";
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-[680px] text-center" : "max-w-[680px]",
        className,
      )}
    >
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2
        className={cn(
          "text-[28px] font-bold leading-tight md:text-[34px] lg:text-[36px]",
          titleColor,
        )}
      >
        {title}
      </h2>
      {intro && (
        <p className={cn("mt-4 text-base leading-relaxed md:text-[17px]", introColor)}>
          {intro}
        </p>
      )}
    </div>
  );
}
