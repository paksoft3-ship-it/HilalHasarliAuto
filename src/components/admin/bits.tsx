import { Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { stageLabels, type AdminLocale } from "@/lib/i18n/admin";

const WON = new Set(["accepted", "vehicle_purchased", "vehicle_sold", "broker_closed"]);
const EARLY = new Set(["new_lead", "waiting_contact"]);

export function StageBadge({ stage, locale }: { stage: string; locale: AdminLocale }) {
  const label = stageLabels[locale][stage] ?? stage;
  const tone =
    stage === "lost"
      ? "bg-error-surface text-error"
      : WON.has(stage)
        ? "bg-success-surface text-success"
        : EARLY.has(stage)
          ? "bg-info-surface text-info"
          : "bg-gold-100 text-gold-700";
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", tone)}>
      {label}
    </span>
  );
}

export function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-[14px] border border-line bg-white p-5">
      <p className="text-sm font-medium text-ink-muted">{label}</p>
      <p className={cn("mt-2 text-3xl font-bold", accent ? "text-burgundy-700" : "text-ink")}>
        {value}
      </p>
    </div>
  );
}

export function NotConfigured({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[14px] border border-dashed border-line-strong bg-white p-12 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-warning-surface text-warning">
        <Database size={24} />
      </div>
      <p className="mt-4 max-w-md text-sm text-ink-secondary">{message}</p>
    </div>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-ink">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
    </div>
  );
}
