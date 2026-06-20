"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { login, type LoginResult } from "@/lib/auth/actions";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-burgundy-700 text-[15px] font-semibold text-white transition-colors hover:bg-burgundy-800 disabled:opacity-70"
    >
      {pending ? <Loader2 size={18} className="animate-spin" /> : label}
    </button>
  );
}

export function LoginForm({
  labels,
}: {
  labels: { email: string; password: string; submit: string };
}) {
  const uid = useId();
  const [state, action] = useActionState<LoginResult | null, FormData>(login, null);

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <div className="flex items-start gap-2 rounded-[10px] border border-error/30 bg-error-surface px-4 py-3 text-sm text-error">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}
      <div>
        <label htmlFor={`${uid}-email`} className="mb-1.5 block text-sm font-semibold text-ink">
          {labels.email}
        </label>
        <input
          id={`${uid}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          className="h-12 w-full rounded-[10px] border border-line bg-white px-3.5 text-[15px] text-ink focus:border-burgundy-700 focus:outline-none focus-visible:shadow-[0_0_0_3px_rgba(122,36,50,0.18)]"
        />
      </div>
      <div>
        <label htmlFor={`${uid}-password`} className="mb-1.5 block text-sm font-semibold text-ink">
          {labels.password}
        </label>
        <input
          id={`${uid}-password`}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="h-12 w-full rounded-[10px] border border-line bg-white px-3.5 text-[15px] text-ink focus:border-burgundy-700 focus:outline-none focus-visible:shadow-[0_0_0_3px_rgba(122,36,50,0.18)]"
        />
      </div>
      <SubmitButton label={labels.submit} />
    </form>
  );
}
