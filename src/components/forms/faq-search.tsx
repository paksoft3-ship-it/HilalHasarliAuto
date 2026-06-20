"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import type { FaqCategory } from "@/config/faq";
import { cn } from "@/lib/utils";

/** Turkish-aware lowercase for search matching. */
function trLower(s: string): string {
  return s.replace(/İ/g, "i").replace(/I/g, "ı").toLocaleLowerCase("tr");
}

export function FaqSearch({ categories }: { categories: FaqCategory[] }) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");

  const normalizedQuery = trLower(query.trim());

  const filtered = useMemo(() => {
    let cats = categories;
    if (activeCat !== "all") cats = cats.filter((c) => c.id === activeCat);
    if (!normalizedQuery) return cats;
    return cats
      .map((c) => ({
        ...c,
        items: c.items.filter(
          (it) =>
            trLower(it.q).includes(normalizedQuery) ||
            trLower(it.a).includes(normalizedQuery),
        ),
      }))
      .filter((c) => c.items.length > 0);
  }, [categories, activeCat, normalizedQuery]);

  const totalResults = filtered.reduce((n, c) => n + c.items.length, 0);

  return (
    <div>
      {/* Search field */}
      <div className="mx-auto max-w-xl">
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Sorularda ara"
            aria-label="Sorularda ara"
            className="h-12 w-full rounded-[10px] border border-line bg-white pl-11 pr-10 text-[15px] text-ink placeholder:text-ink-soft focus:border-burgundy-700 focus:outline-none focus-visible:shadow-[0_0_0_3px_rgba(122,36,50,0.18)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Aramayı temizle"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Category chips */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {[{ id: "all", label: "Tümü" }, ...categories].map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveCat(c.id)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              activeCat === c.id
                ? "border-burgundy-700 bg-burgundy-700 text-white"
                : "border-line bg-white text-ink hover:border-burgundy-700",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="mt-10 space-y-10">
        {totalResults === 0 ? (
          <p className="text-center text-ink-muted">
            “{query}” için sonuç bulunamadı. Farklı bir kelime deneyebilir veya
            bizimle iletişime geçebilirsiniz.
          </p>
        ) : (
          filtered.map((cat) => (
            <div key={cat.id}>
              <h2 className="mb-4 text-lg font-bold text-ink">{cat.label}</h2>
              <FaqAccordion items={cat.items} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
