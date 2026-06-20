import type { Block } from "@/config/blog";

/**
 * Markdown-lite ⇄ structured Block[] (rendered by ArticleBody). Avoids a heavy
 * rich-text dependency while keeping content structured & typed.
 *   ##  → h2     ###  → h3     -  → ul     1. → ol     >  → note     else → p
 */
export function blocksToText(blocks: Block[]): string {
  const parts: string[] = [];
  for (const b of blocks) {
    switch (b.type) {
      case "h2": parts.push(`## ${b.text}`); break;
      case "h3": parts.push(`### ${b.text}`); break;
      case "note": parts.push(`> ${b.text}`); break;
      case "p": parts.push(b.text); break;
      case "ul": parts.push(b.items.map((i) => `- ${i}`).join("\n")); break;
      case "ol": parts.push(b.items.map((i, n) => `${n + 1}. ${i}`).join("\n")); break;
    }
  }
  return parts.join("\n\n");
}

export function textToBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  let para: string[] = [];
  let ul: string[] = [];
  let ol: string[] = [];

  const flushPara = () => { if (para.length) { blocks.push({ type: "p", text: para.join(" ").trim() }); para = []; } };
  const flushUl = () => { if (ul.length) { blocks.push({ type: "ul", items: ul.slice() }); ul = []; } };
  const flushOl = () => { if (ol.length) { blocks.push({ type: "ol", items: ol.slice() }); ol = []; } };
  const flushAll = () => { flushPara(); flushUl(); flushOl(); };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) { flushAll(); continue; }
    if (line.startsWith("### ")) { flushAll(); blocks.push({ type: "h3", text: line.slice(4).trim() }); continue; }
    if (line.startsWith("## ")) { flushAll(); blocks.push({ type: "h2", text: line.slice(3).trim() }); continue; }
    if (line.startsWith("> ")) { flushAll(); blocks.push({ type: "note", text: line.slice(2).trim() }); continue; }
    if (line.startsWith("- ")) { flushPara(); flushOl(); ul.push(line.slice(2).trim()); continue; }
    const om = line.match(/^\d+\.\s+(.*)$/);
    if (om) { flushPara(); flushUl(); ol.push(om[1].trim()); continue; }
    flushUl(); flushOl(); para.push(line.trim());
  }
  flushAll();
  return blocks;
}

/** Rough reading time (minutes) from blocks. */
export function readingMinutes(blocks: Block[]): number {
  const words = blocks
    .map((b) => (b.type === "ul" || b.type === "ol" ? b.items.join(" ") : b.text))
    .join(" ")
    .split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
