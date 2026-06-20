"use client";

import { useState } from "react";
import { changeLeadStage } from "@/lib/admin/lead-actions";

export function StageChangeForm({
  leadId,
  currentStage,
  stageOpts,
  lossReasons,
  labels,
}: {
  leadId: string;
  currentStage: string;
  stageOpts: [string, string][];
  lossReasons: { code: string; label: string }[];
  labels: { save: string; lossReason: string };
}) {
  const [stage, setStage] = useState(currentStage);
  const isLost = stage === "lost";

  return (
    <form action={changeLeadStage} className="space-y-3">
      <input type="hidden" name="leadId" value={leadId} />
      <select
        name="toStage"
        value={stage}
        onChange={(e) => setStage(e.target.value)}
        className="h-10 w-full rounded-md border border-line px-3 text-sm"
      >
        {stageOpts.map(([code, label]) => (
          <option key={code} value={code}>{label}</option>
        ))}
      </select>

      {isLost ? (
        <select
          name="lossReason"
          required
          defaultValue=""
          className="h-10 w-full rounded-md border border-error/40 px-3 text-sm"
        >
          <option value="" disabled>{labels.lossReason}…</option>
          {lossReasons.map((r) => (
            <option key={r.code} value={r.label}>{r.label}</option>
          ))}
        </select>
      ) : (
        <input
          name="reason"
          placeholder="Neden (opsiyonel)"
          className="h-10 w-full rounded-md border border-line px-3 text-sm"
        />
      )}

      <button
        type="submit"
        className="w-full rounded-md bg-burgundy-700 px-4 py-2 text-sm font-semibold text-white hover:bg-burgundy-800"
      >
        {labels.save}
      </button>
    </form>
  );
}
