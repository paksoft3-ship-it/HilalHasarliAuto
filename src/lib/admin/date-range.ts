/**
 * Analytics date-range resolution. Day boundaries are computed in Türkiye time
 * (UTC+3, no DST) so "Bugün" / custom dates mean Istanbul calendar days, not UTC.
 */

const DAY_MS = 86_400_000;

export type RangePreset = "today" | "yesterday" | "7d" | "15d" | "30d" | "custom";

export interface ResolvedRange {
  from: Date;
  to: Date; // exclusive upper bound
  preset: RangePreset;
  label: string;
  /** YYYY-MM-DD values for the custom date inputs. */
  fromStr: string;
  toStr: string;
  /** Ordered list of TR calendar days in the range (for the chart). */
  days: string[];
}

/** Format a Date as a Türkiye-local YYYY-MM-DD string. */
export function trDateStr(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/** Midnight (TR) of the calendar day containing `d`, as a UTC Date. */
function startOfDayTR(d: Date): Date {
  return new Date(`${trDateStr(d)}T00:00:00+03:00`);
}

const isYmd = (s: string | undefined): s is string => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);

type SlidingPreset = Exclude<RangePreset, "custom" | "yesterday">;
const PRESET_DAYS: Record<SlidingPreset, number> = {
  today: 1,
  "7d": 7,
  "15d": 15,
  "30d": 30,
};

function buildDays(from: Date, toExclusive: Date): string[] {
  const days: string[] = [];
  const lastDay = trDateStr(new Date(toExclusive.getTime() - 1)); // last included TR day
  // Step from `from` at TR noon to dodge any boundary edge cases.
  let cur = new Date(`${trDateStr(from)}T12:00:00+03:00`);
  for (let i = 0; i < 400; i++) {
    const s = trDateStr(cur);
    days.push(s);
    if (s >= lastDay) break;
    cur = new Date(cur.getTime() + DAY_MS);
  }
  return days;
}

/** Resolve query params (?range=&from=&to=) into a concrete window. */
export function resolveRange(
  params: { range?: string; from?: string; to?: string },
  now: Date = new Date(),
): ResolvedRange {
  let preset = (params.range as RangePreset) ?? "30d";

  // "Dün" — the single previous TR calendar day.
  if (preset === "yesterday") {
    const to = startOfDayTR(now); // start of today (exclusive end)
    const from = new Date(to.getTime() - DAY_MS);
    return { from, to, preset, label: "Dün", fromStr: trDateStr(from), toStr: trDateStr(from), days: buildDays(from, to) };
  }

  // Custom range with two valid dates.
  if (preset === "custom" && isYmd(params.from) && isYmd(params.to)) {
    let from = new Date(`${params.from}T00:00:00+03:00`);
    let to = new Date(new Date(`${params.to}T00:00:00+03:00`).getTime() + DAY_MS); // inclusive end
    let [fromStr, toStr] = [params.from, params.to];
    if (from > to) {
      [from, to] = [new Date(`${toStr}T00:00:00+03:00`), new Date(new Date(`${fromStr}T00:00:00+03:00`).getTime() + DAY_MS)];
      [fromStr, toStr] = [toStr, fromStr];
    }
    return { from, to, preset: "custom", label: `${fromStr} – ${toStr}`, fromStr, toStr, days: buildDays(from, to) };
  }

  if (!(preset in PRESET_DAYS)) preset = "30d";
  const n = PRESET_DAYS[preset as SlidingPreset];
  const from = startOfDayTR(new Date(now.getTime() - (n - 1) * DAY_MS));
  const to = now;
  const label = preset === "today" ? "Bugün" : `Son ${n} gün`;
  return {
    from,
    to,
    preset,
    label,
    fromStr: trDateStr(from),
    toStr: trDateStr(now),
    days: buildDays(from, to),
  };
}
