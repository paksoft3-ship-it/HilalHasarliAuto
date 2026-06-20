import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Checklist with burgundy check markers. Two columns on md+ when `columns`. */
export function IconList({
  items,
  columns = false,
  className,
}: {
  items: string[];
  columns?: boolean;
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "space-y-3",
        columns && "md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-3 md:space-y-0",
        className,
      )}
    >
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cream-100 text-burgundy-700">
            <Check size={13} strokeWidth={3} />
          </span>
          <span className="text-[15px] leading-relaxed text-ink-secondary">{item}</span>
        </li>
      ))}
    </ul>
  );
}
