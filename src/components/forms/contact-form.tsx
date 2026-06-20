"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitContact, type ContactResult } from "@/lib/contact/actions";
import { routes } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { getAttribution } from "@/lib/tracking/attribution";
import { pushEvent } from "@/lib/tracking/events";
import { Turnstile } from "@/components/forms/turnstile";

const fieldBase =
  "h-12 w-full rounded-[10px] border bg-white px-3.5 text-[15px] text-ink " +
  "placeholder:text-ink-soft focus:border-burgundy-700 focus:outline-none " +
  "focus-visible:shadow-[0_0_0_3px_rgba(122,36,50,0.18)]";

function Err({ msg }: { msg?: string }) {
  return msg ? <p className="mt-1 text-xs font-medium text-error">{msg}</p> : null;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-burgundy-700 text-[15px] font-semibold text-white hover:bg-burgundy-800 disabled:opacity-70 sm:w-auto sm:px-8"
    >
      {pending ? <><Loader2 size={18} className="animate-spin" /> Gönderiliyor…</> : "Mesaj Gönder"}
    </button>
  );
}

export function ContactForm() {
  const uid = useId();
  const [attribution, setAttribution] = useState("");
  const [state, action] = useActionState<ContactResult | null, FormData>(
    submitContact,
    null,
  );
  const e = state?.errors ?? {};

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttribution(JSON.stringify(getAttribution() ?? {}));
  }, []);

  useEffect(() => {
    if (state?.ok) pushEvent("contact_form_submit", { reference: state.reference });
  }, [state]);

  if (state?.ok) {
    return (
      <div className="rounded-[14px] border border-success/30 bg-success-surface p-7 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-success">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="mt-4 text-lg font-bold text-ink">Mesajınız Alındı</h3>
        <p className="mt-2 text-[15px] text-ink-secondary">
          En kısa sürede sizinle iletişime geçeceğiz.
          {state.reference && (
            <>
              {" "}Referans: <span className="font-mono font-semibold">{state.reference}</span>
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="space-y-4">
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <input name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="attribution" value={attribution} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-name`} className="mb-1.5 block text-sm font-semibold text-ink">
            Ad Soyad
          </label>
          <input id={`${uid}-name`} name="fullName" autoComplete="name" className={cn(fieldBase, e.fullName && "border-error")} />
          <Err msg={e.fullName} />
        </div>
        <div>
          <label htmlFor={`${uid}-phone`} className="mb-1.5 block text-sm font-semibold text-ink">
            Telefon
          </label>
          <input id={`${uid}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="05XX XXX XX XX" className={cn(fieldBase, e.phone && "border-error")} />
          <Err msg={e.phone} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-email`} className="mb-1.5 block text-sm font-semibold text-ink">
            E-posta <span className="font-normal text-ink-muted">(opsiyonel)</span>
          </label>
          <input id={`${uid}-email`} name="email" type="email" autoComplete="email" className={cn(fieldBase, e.email && "border-error")} />
          <Err msg={e.email} />
        </div>
        <div>
          <label htmlFor={`${uid}-subject`} className="mb-1.5 block text-sm font-semibold text-ink">
            Konu
          </label>
          <input id={`${uid}-subject`} name="subject" className={cn(fieldBase, e.subject && "border-error")} />
          <Err msg={e.subject} />
        </div>
      </div>

      <div>
        <label htmlFor={`${uid}-msg`} className="mb-1.5 block text-sm font-semibold text-ink">
          Mesajınız
        </label>
        <textarea
          id={`${uid}-msg`}
          name="message"
          rows={5}
          className={cn(
            "w-full rounded-[10px] border bg-white p-3.5 text-[15px] text-ink placeholder:text-ink-soft focus:border-burgundy-700 focus:outline-none focus-visible:shadow-[0_0_0_3px_rgba(122,36,50,0.18)]",
            e.message && "border-error",
          )}
        />
        <Err msg={e.message} />
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-ink">Tercih Ettiğiniz İletişim</legend>
        <div className="flex flex-wrap gap-4 text-sm text-ink-secondary">
          {[
            { v: "phone", l: "Telefon" },
            { v: "whatsapp", l: "WhatsApp" },
            { v: "email", l: "E-posta" },
          ].map((o, i) => (
            <label key={o.v} className="flex items-center gap-2">
              <input type="radio" name="preferredContact" value={o.v} defaultChecked={i === 0} className="h-4 w-4 accent-burgundy-700" />
              {o.l}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex items-start gap-2.5 text-[13px] leading-snug text-ink-secondary">
        <input type="checkbox" name="consent" className="mt-0.5 h-4 w-4 shrink-0 accent-burgundy-700" />
        <span>
          <a href={routes.kvkk} className="font-medium text-burgundy-700 underline">
            KVKK Aydınlatma Metni
          </a>
          ’ni okudum; bilgilerimin iletişim amacıyla işlenmesini onaylıyorum.
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
    </form>
  );
}
