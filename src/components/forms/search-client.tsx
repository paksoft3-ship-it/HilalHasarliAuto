"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { searchIndex, searchTypes, type SearchType } from "@/lib/search/index-data";
import { routes } from "@/config/navigation";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function trLower(s: string) {
  return s.replace(/İ/g, "i").replace(/I/g, "ı").toLocaleLowerCase("tr");
}

export function SearchClient() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [type, setType] = useState<SearchType | "all">("all");

  const nq = trLower(query.trim());
  const results = useMemo(() => {
    let list = searchIndex;
    if (type !== "all") list = list.filter((e) => e.type === type);
    if (!nq) return list;
    return list.filter((e) => trLower(e.keywords).includes(nq) || trLower(e.title).includes(nq));
  }, [nq, type]);

  return (
    <div>
      {/* Search field */}
      <div className="mx-auto max-w-2xl">
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Araç türü, şehir, hizmet veya konu yazın"
            aria-label="Sitede ara"
            className="h-13 w-full rounded-[12px] border border-line bg-white py-3.5 pl-11 pr-4 text-[15px] text-ink placeholder:text-ink-soft focus:border-burgundy-700 focus:outline-none focus-visible:shadow-[0_0_0_3px_rgba(122,36,50,0.18)]"
          />
        </div>
      </div>

      {/* Type filter */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {(["all", ...searchTypes] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              type === t ? "border-burgundy-700 bg-burgundy-700 text-white" : "border-line bg-white text-ink hover:border-burgundy-700",
            )}
          >
            {t === "all" ? "Tüm Sonuçlar" : t}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="mx-auto mt-8 max-w-2xl">
        {results.length === 0 ? (
          <div className="rounded-[14px] border border-line bg-cream-50 p-8 text-center">
            <p className="text-ink-secondary">
              {nq ? `“${query}” için sonuç bulunamadı.` : "Aramaya başlamak için yukarıya yazın."}
            </p>
            <Link href={routes.getOffer} className={buttonClasses({ variant: "primary", className: "mt-5" })}>
              Hemen Teklif Al
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-ink-muted">{results.length} sonuç</p>
            <ul className="space-y-3">
              {results.map((r) => (
                <li key={`${r.type}-${r.href}-${r.title}`}>
                  <Link href={r.href} className="block rounded-[12px] border border-line bg-white p-4 transition-colors hover:border-burgundy-700">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-gold-700">{r.type}</span>
                    <h3 className="mt-1 text-[15px] font-semibold text-ink">{r.title}</h3>
                    <p className="mt-1 line-clamp-2 text-[13px] text-ink-muted">{r.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
