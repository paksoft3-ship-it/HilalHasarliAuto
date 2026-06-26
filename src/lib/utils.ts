import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names with conflict resolution. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format an ISO date as a Turkish long date (e.g. "12 Mayıs 2026"). */
export function formatTrDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Format an ISO date+time in Turkish, Europe/Istanbul (e.g. "12 May 2026 14:30"). */
export function formatTrDateTime(iso: string): string {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  });
}

/** Format a whole-TRY integer as Turkish currency (e.g. "₺125.000"). */
export function formatTRY(amount: number | null | undefined): string {
  if (amount == null) return "—";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}
