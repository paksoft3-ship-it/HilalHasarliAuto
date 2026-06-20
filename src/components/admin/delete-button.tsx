"use client";

import { Trash2 } from "lucide-react";

/**
 * Confirm-then-submit delete control. The server action is passed in as a prop
 * (server actions are serializable to client components). Renders a tiny form
 * with the record id; asks for confirmation before submitting.
 */
export function DeleteButton({
  action,
  id,
  confirmText = "Bu kaydı silmek istediğinize emin misiniz?",
  label,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  confirmText?: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        title="Sil"
        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-error transition-colors hover:bg-error-surface"
      >
        <Trash2 size={14} />
        {label && <span>{label}</span>}
      </button>
    </form>
  );
}
