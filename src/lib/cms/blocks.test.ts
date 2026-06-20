import { describe, it, expect } from "vitest";
import { textToBlocks, blocksToText, readingMinutes } from "./blocks";

describe("blocks", () => {
  it("parses headings, paragraphs, lists and notes", () => {
    const blocks = textToBlocks("## Başlık\nBir paragraf.\n\n- a\n- b\n\n> not");
    expect(blocks).toEqual([
      { type: "h2", text: "Başlık" },
      { type: "p", text: "Bir paragraf." },
      { type: "ul", items: ["a", "b"] },
      { type: "note", text: "not" },
    ]);
  });

  it("parses ordered lists", () => {
    expect(textToBlocks("1. ilk\n2. ikinci")).toEqual([
      { type: "ol", items: ["ilk", "ikinci"] },
    ]);
  });

  it("round-trips blocks → text → blocks", () => {
    const blocks = textToBlocks("## A\np text\n\n- x\n- y");
    expect(textToBlocks(blocksToText(blocks))).toEqual(blocks);
  });

  it("estimates reading minutes (min 1)", () => {
    expect(readingMinutes([{ type: "p", text: "tek kelime" }])).toBe(1);
  });
});
