import { Info } from "lucide-react";
import type { Block } from "@/config/blog";

/** Renders structured content blocks into accessible, styled article HTML. */
export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} className="mt-8 text-[24px] font-bold leading-tight text-ink">
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-6 text-[20px] font-semibold text-ink">
                {b.text}
              </h3>
            );
          case "p":
            return (
              <p key={i} className="text-[17px] leading-relaxed text-ink-secondary">
                {b.text}
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="list-disc space-y-2 pl-5 text-[17px] leading-relaxed text-ink-secondary marker:text-burgundy-700">
                {b.items.map((it, j) => <li key={j}>{it}</li>)}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="list-decimal space-y-2 pl-5 text-[17px] leading-relaxed text-ink-secondary marker:font-semibold marker:text-burgundy-700">
                {b.items.map((it, j) => <li key={j}>{it}</li>)}
              </ol>
            );
          case "note":
            return (
              <div key={i} className="flex gap-3 rounded-[12px] border border-info/30 bg-info-surface p-4">
                <Info size={18} className="mt-0.5 shrink-0 text-info" />
                <p className="text-[14px] leading-relaxed text-ink-secondary">{b.text}</p>
              </div>
            );
        }
      })}
    </div>
  );
}
