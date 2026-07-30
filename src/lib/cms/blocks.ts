import type { Block } from "@/config/blog";

/**
 * Markdown-lite ⇄ structured Block[] (rendered by ArticleBody). Avoids a heavy
 * rich-text dependency while keeping content structured & typed.
 *   ##  → h2     ###  → h3     -  → ul     1. → ol     >  → note
 *   ![alt](src)  → img     | a | b |  → table     else → p
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
      case "img": parts.push(`![${b.alt}](${b.src})`); break;
      case "table":
        parts.push(
          [
            `| ${b.header.join(" | ")} |`,
            `| ${b.header.map(() => "---").join(" | ")} |`,
            ...b.rows.map((r) => `| ${r.join(" | ")} |`),
          ].join("\n"),
        );
        break;
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

  let table: string[][] = [];

  const flushPara = () => { if (para.length) { blocks.push({ type: "p", text: para.join(" ").trim() }); para = []; } };
  const flushUl = () => { if (ul.length) { blocks.push({ type: "ul", items: ul.slice() }); ul = []; } };
  const flushOl = () => { if (ol.length) { blocks.push({ type: "ol", items: ol.slice() }); ol = []; } };
  const flushTable = () => {
    if (table.length) {
      const [header, ...rows] = table;
      if (header) blocks.push({ type: "table", header, rows });
      table = [];
    }
  };
  const flushAll = () => { flushPara(); flushUl(); flushOl(); flushTable(); };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) { flushAll(); continue; }
    if (line.startsWith("### ")) { flushAll(); blocks.push({ type: "h3", text: line.slice(4).trim() }); continue; }
    if (line.startsWith("## ")) { flushAll(); blocks.push({ type: "h2", text: line.slice(3).trim() }); continue; }
    if (line.startsWith("> ")) { flushAll(); blocks.push({ type: "note", text: line.slice(2).trim() }); continue; }
    const im = line.match(/^!\[(.*?)\]\((\S+)\)$/);
    if (im) { flushAll(); blocks.push({ type: "img", alt: im[1].trim(), src: im[2] }); continue; }
    if (line.startsWith("|") && line.endsWith("|")) {
      flushPara(); flushUl(); flushOl();
      const cells = line.slice(1, -1).split("|").map((c) => c.trim());
      // Skip the markdown separator row (| --- | --- |).
      if (!cells.every((c) => /^:?-+:?$/.test(c))) table.push(cells);
      continue;
    }
    if (table.length) flushTable();
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
    .map((b) => {
      if (b.type === "ul" || b.type === "ol") return b.items.join(" ");
      if (b.type === "img") return "";
      if (b.type === "table") return [b.header, ...b.rows].flat().join(" ");
      return b.text;
    })
    .join(" ")
    .split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
