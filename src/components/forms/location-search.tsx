"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, MapPin } from "lucide-react";
import { routes } from "@/config/navigation";

function trLower(s: string) {
  return s.replace(/İ/g, "i").replace(/I/g, "ı").toLocaleLowerCase("tr");
}

interface Entry {
  label: string;
  href: string;
  sub: string;
  published: boolean;
}

export function LocationSearch({ entries }: { entries: Entry[] }) {
  const [q, setQ] = useState("");
  const nq = trLower(q.trim());
  const results = useMemo(() => {
    if (!nq) return [];
    return entries.filter((e) => trLower(e.label).includes(nq)).slice(0, 8);
  }, [entries, nq]);

  return (
    <div className="mx-auto max-w-xl">
      <div className="relative">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="İl veya ilçe adı yazın"
          aria-label="İl veya ilçe ara"
          className="h-13 w-full rounded-[12px] border border-line bg-white py-3.5 pl-11 pr-4 text-[15px] text-ink placeholder:text-ink-soft focus:border-burgundy-700 focus:outline-none focus-visible:shadow-[0_0_0_3px_rgba(122,36,50,0.18)]"
        />
      </div>
      {nq && (
        <div className="mt-2 overflow-hidden rounded-[12px] border border-line bg-white">
          {results.length === 0 ? (
            <div className="px-4 py-4 text-sm text-ink-muted">
              Sonuç bulunamadı. Tüm illerden başvuru kabul edilir;{" "}
              <Link href={routes.getOffer} className="font-medium text-burgundy-700 underline">
                teklif formunu
              </Link>{" "}
              kullanabilirsiniz.
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {results.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="flex items-center gap-3 px-4 py-3 hover:bg-cream-50">
                    <MapPin size={16} className="text-gold-600" />
                    <span className="flex flex-col">
                      <span className="text-sm font-medium text-ink">{r.label}</span>
                      <span className="text-xs text-ink-muted">{r.sub}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
