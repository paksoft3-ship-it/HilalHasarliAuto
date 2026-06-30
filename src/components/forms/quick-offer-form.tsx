"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { ShieldCheck, Loader2 } from "lucide-react";
import { submitQuickOffer, type QuickOfferResult } from "@/lib/leads/actions";
import { damageOptions } from "@/lib/leads/schema";
import { publishedCities } from "@/config/cities";
import { routes } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { getAttribution } from "@/lib/tracking/attribution";
import { pushEvent } from "@/lib/tracking/events";
import { beaconTrack } from "@/lib/tracking/beacon";
import { Turnstile } from "@/components/forms/turnstile";

const fieldBase =
  "h-12 w-full rounded-[10px] border bg-white px-3.5 text-[15px] text-ink " +
  "placeholder:text-ink-soft focus:border-burgundy-700 focus:outline-none " +
  "focus-visible:shadow-[0_0_0_3px_rgba(122,36,50,0.18)]";

function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs font-medium text-error">{msg}</p>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-burgundy-700 text-[15px] font-semibold text-white transition-colors hover:bg-burgundy-800 disabled:opacity-70"
    >
      {pending ? (
        <>
          <Loader2 size={18} className="animate-spin" /> Gönderiliyor…
        </>
      ) : (
        "Teklif Al"
      )}
    </button>
  );
}

export function QuickOfferForm({
  source = "homepage_hero",
  compact = false,
}: {
  source?: string;
  /** Tighter field heights & spacing for the hero card. */
  compact?: boolean;
}) {
  const router = useRouter();
  const uid = useId();
  const [attribution, setAttribution] = useState("");
  const [state, formAction] = useActionState<QuickOfferResult | null, FormData>(
    submitQuickOffer,
    null,
  );
  const e = state?.errors ?? {};

  useEffect(() => {
    // Client-only: read attribution cookie after mount (avoids hydration mismatch).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttribution(JSON.stringify(getAttribution() ?? {}));
  }, []);

  useEffect(() => {
    if (state?.ok && state.reference) {
      pushEvent("quote_form_submit", { reference: state.reference, source, value: 200, currency: "TRY" });
      // First-party count for the admin Button-Clicks report (source = placement).
      beaconTrack("quote_form_submit", { location: source });
      router.push(`${routes.thankYou}?ref=${encodeURIComponent(state.reference)}`);
    }
  }, [state, router, source]);

  return (
    <form
      action={formAction}
      noValidate
      className={cn(
        compact
          ? "space-y-2.5 [&_input:not([type=checkbox])]:h-11 [&_select]:h-11"
          : "space-y-3.5",
      )}
    >
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="attribution" value={attribution} />
      {/* Honeypot — visually hidden, must remain empty */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${uid}-company`}>Şirket</label>
        <input id={`${uid}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor={`${uid}-name`} className="mb-1.5 block text-sm font-semibold text-ink">
          Ad Soyad
        </label>
        <input
          id={`${uid}-name`}
          name="fullName"
          autoComplete="name"
          placeholder="Adınız Soyadınız"
          className={cn(fieldBase, e.fullName && "border-error")}
        />
        <Err msg={e.fullName} />
      </div>

      <div>
        <label htmlFor={`${uid}-phone`} className="mb-1.5 block text-sm font-semibold text-ink">
          Telefon
        </label>
        <input
          id={`${uid}-phone`}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="05XX XXX XX XX"
          className={cn(fieldBase, e.phone && "border-error")}
        />
        <Err msg={e.phone} />
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <label htmlFor={`${uid}-brand`} className="mb-1.5 block text-sm font-semibold text-ink">
            Marka
          </label>
          <input
            id={`${uid}-brand`}
            name="brand"
            placeholder="Örn. Toyota"
            className={cn(fieldBase, e.brand && "border-error")}
          />
          <Err msg={e.brand} />
        </div>
        <div>
          <label htmlFor={`${uid}-model`} className="mb-1.5 block text-sm font-semibold text-ink">
            Model
          </label>
          <input
            id={`${uid}-model`}
            name="model"
            placeholder="Örn. Corolla"
            className={cn(fieldBase, e.model && "border-error")}
          />
          <Err msg={e.model} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <label htmlFor={`${uid}-damage`} className="mb-1.5 block text-sm font-semibold text-ink">
            Hasar Durumu
          </label>
          <select
            id={`${uid}-damage`}
            name="damage"
            defaultValue=""
            className={cn(fieldBase, "appearance-none", e.damage && "border-error")}
          >
            <option value="" disabled>
              Seçiniz
            </option>
            {damageOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <Err msg={e.damage} />
        </div>
        <div>
          <label htmlFor={`${uid}-city`} className="mb-1.5 block text-sm font-semibold text-ink">
            İl
          </label>
          <select
            id={`${uid}-city`}
            name="city"
            defaultValue=""
            className={cn(fieldBase, "appearance-none", e.city && "border-error")}
          >
            <option value="" disabled>
              Seçiniz
            </option>
            {publishedCities.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
            <option value="Diğer">Diğer</option>
          </select>
          <Err msg={e.city} />
        </div>
      </div>

      <label className="flex items-start gap-2.5 text-[13px] leading-snug text-ink-secondary">
        <input
          type="checkbox"
          name="consent"
          className="mt-0.5 h-4 w-4 shrink-0 accent-burgundy-700"
        />
        <span>
          <a href={routes.kvkk} className="font-medium text-burgundy-700 underline">
            KVKK Aydınlatma Metni
          </a>
          ’ni okudum; bilgilerimin değerlendirme amacıyla işlenmesini onaylıyorum.
        </span>
      </label>
      <Err msg={e.consent} />

      <Turnstile />
      {e.form && (
        <p className="rounded-md border border-error/30 bg-error-surface px-3 py-2 text-xs font-medium text-error">
          {e.form}
        </p>
      )}

      <SubmitButton />

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-ink-muted">
        <ShieldCheck size={14} className="text-success" />
        Bilgileriniz yalnızca aracınızın değerlendirilmesi için kullanılır.
      </p>
    </form>
  );
}
