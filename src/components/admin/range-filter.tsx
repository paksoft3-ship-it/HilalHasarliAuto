"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { RangePreset } from "@/lib/admin/date-range";

const PRESETS: { key: RangePreset; label: string }[] = [
  { key: "today", label: "Bugün" },
  { key: "yesterday", label: "Dün" },
  { key: "7d", label: "Son 7 gün" },
  { key: "15d", label: "Son 15 gün" },
  { key: "30d", label: "Son 30 gün" },
];

export function RangeFilter({
  preset,
  fromStr,
  toStr,
}: {
  preset: RangePreset;
  fromStr: string;
  toStr: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [from, setFrom] = useState(fromStr);
  const [to, setTo] = useState(toStr);

  function applyPreset(key: RangePreset) {
    router.push(`${pathname}?range=${key}`);
  }

  function applyCustom() {
    if (!from || !to) return;
    router.push(`${pathname}?range=custom&from=${from}&to=${to}`);
  }

  return (
    <div className="mb-5 flex flex-wrap items-end gap-3 rounded-[14px] border border-line bg-white p-3">
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => applyPreset(p.key)}
            className={cn(
              "h-9 rounded-md px-3.5 text-sm font-medium transition",
              preset === p.key
                ? "bg-burgundy-700 text-white"
                : "border border-line bg-white text-ink-secondary hover:bg-cream-100",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="ml-auto flex flex-wrap items-end gap-2">
        <label className="flex flex-col text-[11px] font-medium text-ink-muted">
          Başlangıç
          <input
            type="date"
            value={from}
            max={to || undefined}
            onChange={(e) => setFrom(e.target.value)}
            className="mt-0.5 h-9 rounded-md border border-line px-2.5 text-sm focus:border-burgundy-700 focus:outline-none"
          />
        </label>
        <label className="flex flex-col text-[11px] font-medium text-ink-muted">
          Bitiş
          <input
            type="date"
            value={to}
            min={from || undefined}
            onChange={(e) => setTo(e.target.value)}
            className="mt-0.5 h-9 rounded-md border border-line px-2.5 text-sm focus:border-burgundy-700 focus:outline-none"
          />
        </label>
        <button
          type="button"
          onClick={applyCustom}
          className={cn(
            "h-9 rounded-md px-4 text-sm font-semibold transition",
            preset === "custom"
              ? "bg-burgundy-700 text-white"
              : "bg-charcoal-900 text-white hover:bg-charcoal-950",
          )}
        >
          Uygula
        </button>
      </div>
    </div>
  );
}
