import Image from "next/image";
import Link from "next/link";
import { Info, Play, ExternalLink } from "lucide-react";
import type { Block } from "@/config/blog";
import { CtaGroup } from "@/components/sections/cta-buttons";

const LINK_CLASS =
  "font-semibold text-burgundy-700 underline underline-offset-2 hover:text-burgundy-800";

/** Renders inline markdown links `[label](href)` inside block text.
 *  Internal hrefs use <Link>; external ones open in a new tab. */
function renderInline(text: string): React.ReactNode {
  const re = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const [, label, href] = m;
    parts.push(
      href.startsWith("/") ? (
        <Link key={m.index} href={href} className={LINK_CLASS}>{label}</Link>
      ) : (
        <a key={m.index} href={href} className={LINK_CLASS} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      ),
    );
    last = m.index + m[0].length;
  }
  if (parts.length === 0) return text;
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

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
                {renderInline(b.text)}
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="list-disc space-y-2 pl-5 text-[17px] leading-relaxed text-ink-secondary marker:text-burgundy-700">
                {b.items.map((it, j) => <li key={j}>{renderInline(it)}</li>)}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="list-decimal space-y-2 pl-5 text-[17px] leading-relaxed text-ink-secondary marker:font-semibold marker:text-burgundy-700">
                {b.items.map((it, j) => <li key={j}>{renderInline(it)}</li>)}
              </ol>
            );
          case "note":
            return (
              <div key={i} className="flex gap-3 rounded-[12px] border border-info/30 bg-info-surface p-4">
                <Info size={18} className="mt-0.5 shrink-0 text-info" />
                <p className="text-[14px] leading-relaxed text-ink-secondary">{renderInline(b.text)}</p>
              </div>
            );
          case "img":
            return (
              <figure key={i} className="my-6 overflow-hidden rounded-[12px] border border-line">
                <Image
                  src={b.src}
                  alt={b.alt}
                  width={b.width ?? 1600}
                  height={b.height ?? 1200}
                  className="h-auto w-full"
                  sizes="(max-width: 768px) 100vw, 720px"
                />
              </figure>
            );
          case "table":
            return (
              <div key={i} className="my-6 overflow-x-auto rounded-[12px] border border-line">
                <table className="w-full text-[15px]">
                  <thead>
                    <tr className="border-b border-line bg-cream-50 text-left">
                      {b.header.map((h, j) => (
                        <th key={j} className="px-4 py-3 font-bold text-ink">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, j) => (
                      <tr key={j} className="border-b border-line last:border-0">
                        {row.map((cell, k) => (
                          <td key={k} className={`px-4 py-3 ${k === 0 ? "font-semibold text-ink" : "text-ink-secondary"}`}>
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "video_link":
            return (
              <a
                key={i}
                href={b.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group my-6 flex items-center gap-4 rounded-[12px] border border-charcoal-950 bg-charcoal-950 p-4 transition-colors hover:border-burgundy-700 sm:p-5"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-burgundy-700 text-white transition-transform group-hover:scale-105 sm:h-16 sm:w-16">
                  <Play size={22} fill="currentColor" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-white/60">
                    <span>{b.source}</span>
                    <span aria-hidden>•</span>
                    <span>{b.date}</span>
                  </div>
                  <p className="mt-1 text-[15px] font-semibold leading-snug text-white sm:text-base">{b.title}</p>
                  <p className="mt-0.5 text-[13px] text-white/50">Haber videosunu yayıncı sayfasında izleyin</p>
                </div>
                <ExternalLink size={18} className="shrink-0 text-white/40 transition-colors group-hover:text-white" />
              </a>
            );
          case "cta_banner":
            return (
              <div
                key={i}
                className="my-8 rounded-[14px] border border-burgundy-700/20 bg-burgundy-700/5 p-5 text-center sm:p-6"
              >
                <p className="text-[18px] font-bold text-ink sm:text-[20px]">{b.heading}</p>
                {b.text && (
                  <p className="mx-auto mt-1.5 max-w-[520px] text-[14px] leading-relaxed text-ink-secondary">
                    {b.text}
                  </p>
                )}
                <div className="mt-4 flex justify-center">
                  <CtaGroup
                    size="md"
                    whatsappMessage={b.whatsappMessage}
                    location={`blog_cta_${i}`}
                  />
                </div>
              </div>
            );
        }
      })}
    </div>
  );
}
