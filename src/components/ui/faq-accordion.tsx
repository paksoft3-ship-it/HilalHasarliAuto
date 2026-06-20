"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/config/faq";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-[820px] divide-y divide-line overflow-hidden rounded-[14px] border border-line bg-white">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6 md:py-5"
              >
                <span
                  className={cn(
                    "text-[15px] font-semibold md:text-base",
                    isOpen ? "text-burgundy-700" : "text-ink",
                  )}
                >
                  {item.q}
                </span>
                <span
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-colors",
                    isOpen
                      ? "border-burgundy-700 bg-burgundy-700 text-white"
                      : "border-line-strong text-ink-muted",
                  )}
                >
                  {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>
            </h3>
            <div
              className={cn(
                "grid transition-all duration-200",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-[15px] leading-relaxed text-ink-secondary md:px-6">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
