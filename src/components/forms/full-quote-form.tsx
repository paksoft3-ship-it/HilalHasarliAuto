"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { upload } from "@vercel/blob/client";
import { Loader2, ArrowLeft, ArrowRight, Camera, Check, X, AlertCircle } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import {
  submitFullQuote,
  type FullQuoteResult,
} from "@/lib/leads/full-quote-action";
import {
  fullQuoteSchema,
  stepFields,
  fuelOptions,
  transmissionOptions,
  yesNoUnknown,
} from "@/lib/leads/full-quote";
import { services } from "@/config/services";
import { publishedCities } from "@/config/cities";
import { routes } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { getAttribution } from "@/lib/tracking/attribution";
import { pushEvent } from "@/lib/tracking/events";
import { beaconTrack } from "@/lib/tracking/beacon";

const STEP_LABELS = ["Araç", "Hasar", "Fotoğraf", "İletişim", "Özet"];

const fieldBase =
  "h-12 w-full rounded-[10px] border bg-white px-3.5 text-[15px] text-ink placeholder:text-ink-soft focus:border-burgundy-700 focus:outline-none focus-visible:shadow-[0_0_0_3px_rgba(122,36,50,0.18)]";

function Label({ htmlFor, children, optional }: { htmlFor: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-ink">
      {children}
      {optional && <span className="font-normal text-ink-muted"> (opsiyonel)</span>}
    </label>
  );
}

function Err({ msg }: { msg?: string }) {
  return msg ? <p className="mt-1 text-xs font-medium text-error">{msg}</p> : null;
}

function Radio({ name, options, errored }: { name: string; options: readonly { v: string; l: string }[]; errored?: boolean }) {
  return (
    <div className={cn("flex flex-wrap gap-2", errored && "rounded-[10px]")}>
      {options.map((o, i) => (
        <label key={o.v} className="cursor-pointer">
          <input type="radio" name={name} value={o.v} defaultChecked={i === 0 && name === "running" ? false : undefined} className="peer sr-only" />
          <span className="inline-block rounded-[10px] border border-line bg-white px-4 py-2 text-sm text-ink peer-checked:border-burgundy-700 peer-checked:bg-burgundy-700 peer-checked:text-white">
            {o.l}
          </span>
        </label>
      ))}
    </div>
  );
}

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="flex h-12 items-center justify-center gap-2 rounded-[10px] bg-burgundy-700 px-8 text-[15px] font-semibold text-white hover:bg-burgundy-800 disabled:opacity-70"
    >
      {pending ? <><Loader2 size={18} className="animate-spin" /> Gönderiliyor…</> : "Değerlendirme Talebi Gönder"}
    </button>
  );
}

type PhotoItem = {
  id: string;
  name: string;
  size: number;
  previewUrl: string;
  status: "uploading" | "done" | "error";
  url?: string;
  pathname?: string;
};

const MAX_PHOTOS = 12;
const MAX_PHOTO_BYTES = 15 * 1024 * 1024;

export function FullQuoteForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [summary, setSummary] = useState<Record<string, string>>({});
  const [attribution, setAttribution] = useState("");

  const [state, action] = useActionState<FullQuoteResult | null, FormData>(
    submitFullQuote,
    null,
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttribution(JSON.stringify(getAttribution() ?? {}));
  }, []);

  // Sync the async server-action result: redirect on success, or surface
  // server-side validation errors and jump to the earliest erroring step.
  // (Standard useActionState pattern; the set-state-in-effect lint rule does
  // not yet model action results, so it is scoped-disabled here.)
  useEffect(() => {
    if (state?.ok && state.reference) {
      pushEvent("quote_form_submit", { reference: state.reference, source: "get_offer", value: 200, currency: "TRY" });
      // First-party count for the admin Button-Clicks report.
      beaconTrack("quote_form_submit", { location: "get_offer" });
      router.push(`${routes.thankYou}?ref=${encodeURIComponent(state.reference)}`);
    } else if (state?.errors) {
      const bad = Object.keys(state.errors)[0];
      const idx = stepFields.findIndex((f) => f.includes(bad as never));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrors(state.errors);
      if (idx >= 0) setStep(idx);
    }
  }, [state, router]);

  const isLast = step === STEP_LABELS.length - 1;

  function validateStep(): boolean {
    if (!formRef.current) return false;
    const data = Object.fromEntries(new FormData(formRef.current));
    const res = fullQuoteSchema.safeParse(data);
    const next: Record<string, string> = {};
    if (!res.success) {
      for (const i of res.error.issues) {
        const key = String(i.path[0] ?? "");
        if (stepFields[step].includes(key as never) && !next[key]) next[key] = i.message;
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validateStep()) return;
    if (step === 3) {
      // entering review — snapshot values
      const d = Object.fromEntries(new FormData(formRef.current!)) as Record<string, string>;
      setSummary(d);
    }
    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const picked = Array.from(input.files ?? []);
    input.value = ""; // allow re-selecting the same file after removal
    if (picked.length === 0) return;

    setErrors((prev) => {
      if (!prev.photos) return prev;
      const rest = { ...prev };
      delete rest.photos;
      return rest;
    });

    // Respect the overall cap and skip oversized / non-image files.
    const room = MAX_PHOTOS - photos.length;
    const accepted = picked
      .filter((f) => f.type.startsWith("image/") && f.size <= MAX_PHOTO_BYTES)
      .slice(0, Math.max(0, room));

    if (accepted.length === 0) {
      setErrors((prev) => ({
        ...prev,
        photos:
          picked.length > room
            ? `En fazla ${MAX_PHOTOS} fotoğraf yükleyebilirsiniz.`
            : "Yalnızca 15 MB'a kadar görsel dosyaları yükleyebilirsiniz.",
      }));
      return;
    }

    const items: PhotoItem[] = accepted.map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      previewUrl: URL.createObjectURL(f),
      status: "uploading",
    }));
    setPhotos((prev) => [...prev, ...items]);

    await Promise.all(
      accepted.map(async (file, i) => {
        const item = items[i];
        try {
          const blob = await upload(`leads/${file.name}`, file, {
            access: "public",
            handleUploadUrl: "/api/upload",
            contentType: file.type,
          });
          setPhotos((prev) =>
            prev.map((p) =>
              p.id === item.id
                ? { ...p, status: "done", url: blob.url, pathname: blob.pathname }
                : p,
            ),
          );
        } catch {
          setPhotos((prev) =>
            prev.map((p) => (p.id === item.id ? { ...p, status: "error" } : p)),
          );
        }
      }),
    );
  }

  function removePhoto(id: string) {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  }

  const uploadedPhotos = photos.filter((p) => p.status === "done");
  const uploading = photos.some((p) => p.status === "uploading");
  const photosField = JSON.stringify(
    uploadedPhotos.map((p) => ({ url: p.url, pathname: p.pathname, name: p.name, size: p.size })),
  );

  return (
    <div>
      {/* Stepper */}
      <ol className="mb-8 flex items-center">
        {STEP_LABELS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full text-sm font-bold",
                    done && "bg-success text-white",
                    active && "bg-burgundy-700 text-white",
                    !done && !active && "bg-cream-100 text-ink-muted",
                  )}
                >
                  {done ? <Check size={16} /> : i + 1}
                </span>
                <span className={cn("text-[11px] font-medium", active ? "text-ink" : "text-ink-muted")}>
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <span className={cn("mx-1 h-px flex-1", i < step ? "bg-success" : "bg-line")} />
              )}
            </li>
          );
        })}
      </ol>

      <form ref={formRef} action={action} noValidate>
        <input type="hidden" name="source" value="get_offer" />
        <input type="hidden" name="photoCount" value={uploadedPhotos.length} />
        <input type="hidden" name="photos" value={photosField} />
        <input type="hidden" name="attribution" value={attribution} />
        <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <input name="company" tabIndex={-1} autoComplete="off" />
        </div>

        {/* Step 1 — Araç Bilgileri */}
        <div className={cn(step === 0 ? "block" : "hidden")}>
          <h2 className="text-xl font-bold text-ink">Araç Bilgileri</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="q-brand">Marka</Label>
              <input id="q-brand" name="brand" className={cn(fieldBase, errors.brand && "border-error")} />
              <Err msg={errors.brand} />
            </div>
            <div>
              <Label htmlFor="q-model">Model</Label>
              <input id="q-model" name="model" className={cn(fieldBase, errors.model && "border-error")} />
              <Err msg={errors.model} />
            </div>
            <div>
              <Label htmlFor="q-year">Model Yılı</Label>
              <input id="q-year" name="year" inputMode="numeric" placeholder="Örn. 2016" className={cn(fieldBase, errors.year && "border-error")} />
              <Err msg={errors.year} />
            </div>
            <div>
              <Label htmlFor="q-km" optional>Kilometre</Label>
              <input id="q-km" name="mileage" inputMode="numeric" className={fieldBase} />
            </div>
            <div>
              <Label htmlFor="q-fuel" optional>Yakıt</Label>
              <select id="q-fuel" name="fuel" defaultValue="" className={cn(fieldBase, "appearance-none")}>
                <option value="">Seçiniz</option>
                {fuelOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="q-trans" optional>Vites</Label>
              <select id="q-trans" name="transmission" defaultValue="" className={cn(fieldBase, "appearance-none")}>
                <option value="">Seçiniz</option>
                {transmissionOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Step 2 — Hasar ve Durum */}
        <div className={cn(step === 1 ? "block" : "hidden")}>
          <h2 className="text-xl font-bold text-ink">Hasar ve Durum</h2>
          <div className="mt-5 space-y-5">
            <div>
              <Label htmlFor="q-cat">Araç Durumu</Label>
              <select id="q-cat" name="category" defaultValue="" className={cn(fieldBase, "appearance-none", errors.category && "border-error")}>
                <option value="" disabled>Seçiniz</option>
                {services.map((s) => <option key={s.slug} value={s.title}>{s.title}</option>)}
                <option value="Diğer">Diğer</option>
              </select>
              <Err msg={errors.category} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="q-running">Araç çalışıyor mu?</Label>
                <Radio name="running" options={yesNoUnknown} errored={!!errors.running} />
                <Err msg={errors.running} />
              </div>
              <div>
                <Label htmlFor="q-starts">Marş alıyor mu?</Label>
                <Radio name="starts" options={yesNoUnknown} />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="q-reg" optional>Ruhsat durumu</Label>
                <input id="q-reg" name="registrationStatus" placeholder="Örn. ruhsat mevcut" className={fieldBase} />
              </div>
              <div>
                <Label htmlFor="q-tow" optional>Çekme belgesi var mı?</Label>
                <Radio name="hasTowDoc" options={yesNoUnknown} />
              </div>
            </div>
            <div>
              <Label htmlFor="q-desc">Hasar / arıza açıklaması</Label>
              <textarea id="q-desc" name="damageDescription" rows={4}
                className={cn("w-full rounded-[10px] border bg-white p-3.5 text-[15px] text-ink placeholder:text-ink-soft focus:border-burgundy-700 focus:outline-none", errors.damageDescription && "border-error")} />
              <Err msg={errors.damageDescription} />
            </div>
          </div>
        </div>

        {/* Step 3 — Fotoğraflar */}
        <div className={cn(step === 2 ? "block" : "hidden")}>
          <h2 className="text-xl font-bold text-ink">Fotoğraflar</h2>
          <p className="mt-2 text-[15px] text-ink-muted">
            Aracın ön, arka, yan ve hasarlı bölgelerinin net fotoğrafları
            değerlendirmeyi hızlandırır.
          </p>
          <label className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border-2 border-dashed border-line-strong bg-cream-50 px-6 py-10 text-center hover:border-burgundy-700">
            <Camera size={28} className="text-burgundy-700" />
            <span className="text-sm font-semibold text-ink">Fotoğraf seçin veya çekin</span>
            <span className="text-xs text-ink-muted">JPG / PNG · en fazla {MAX_PHOTOS} fotoğraf · maks. 15 MB</span>
            <input type="file" accept="image/*" multiple onChange={onPhotos} className="hidden" />
          </label>
          <Err msg={errors.photos} />
          {photos.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {photos.map((p) => (
                <div key={p.id} className="group relative aspect-square overflow-hidden rounded-[10px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.previewUrl} alt={p.name} className="h-full w-full object-cover" />
                  {p.status !== "error" && (
                    <button
                      type="button"
                      onClick={() => removePhoto(p.id)}
                      aria-label="Fotoğrafı kaldır"
                      className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/55 text-white opacity-0 transition group-hover:opacity-100"
                    >
                      <X size={13} />
                    </button>
                  )}
                  {p.status === "uploading" && (
                    <div className="absolute inset-0 grid place-items-center bg-black/40">
                      <Loader2 size={20} className="animate-spin text-white" />
                    </div>
                  )}
                  {p.status === "done" && (
                    <span className="absolute bottom-1 left-1 grid h-5 w-5 place-items-center rounded-full bg-success text-white">
                      <Check size={12} />
                    </span>
                  )}
                  {p.status === "error" && (
                    <button
                      type="button"
                      onClick={() => removePhoto(p.id)}
                      className="absolute inset-0 grid place-items-center gap-1 bg-error/80 text-white"
                    >
                      <AlertCircle size={18} />
                      <span className="text-[10px] font-semibold">Tekrar dene</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          {uploading && (
            <p className="mt-2 text-xs font-medium text-ink-muted">Fotoğraflar yükleniyor…</p>
          )}
          <div className="mt-5 flex items-start gap-3 rounded-[12px] border border-info/30 bg-info-surface p-4">
            <WhatsAppIcon size={18} className="mt-0.5 shrink-0 text-whatsapp" />
            <p className="text-[13px] leading-relaxed text-ink-secondary">
              Fotoğraflarınızı dilerseniz talebinizi gönderdikten sonra WhatsApp
              üzerinden de iletebilirsiniz. Bu adım zorunlu değildir.
            </p>
          </div>
        </div>

        {/* Step 4 — Konum ve İletişim */}
        <div className={cn(step === 3 ? "block" : "hidden")}>
          <h2 className="text-xl font-bold text-ink">Konum ve İletişim</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="q-city">İl</Label>
              <select id="q-city" name="city" defaultValue="" className={cn(fieldBase, "appearance-none", errors.city && "border-error")}>
                <option value="" disabled>Seçiniz</option>
                {publishedCities.map((c) => <option key={c.slug} value={c.name}>{c.name}</option>)}
                <option value="Diğer">Diğer</option>
              </select>
              <Err msg={errors.city} />
            </div>
            <div>
              <Label htmlFor="q-district" optional>İlçe</Label>
              <input id="q-district" name="district" className={fieldBase} />
            </div>
            <div>
              <Label htmlFor="q-name">Ad Soyad</Label>
              <input id="q-name" name="fullName" autoComplete="name" className={cn(fieldBase, errors.fullName && "border-error")} />
              <Err msg={errors.fullName} />
            </div>
            <div>
              <Label htmlFor="q-phone">Telefon</Label>
              <input id="q-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="05XX XXX XX XX" className={cn(fieldBase, errors.phone && "border-error")} />
              <Err msg={errors.phone} />
            </div>
            <div>
              <Label htmlFor="q-email" optional>E-posta</Label>
              <input id="q-email" name="email" type="email" autoComplete="email" className={cn(fieldBase, errors.email && "border-error")} />
              <Err msg={errors.email} />
            </div>
            <div>
              <Label htmlFor="q-pref" optional>Tercih edilen iletişim</Label>
              <select id="q-pref" name="preferredContact" defaultValue="phone" className={cn(fieldBase, "appearance-none")}>
                <option value="phone">Telefon</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">E-posta</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 5 — Özet */}
        <div className={cn(step === 4 ? "block" : "hidden")}>
          <h2 className="text-xl font-bold text-ink">Özet ve Onay</h2>
          <dl className="mt-5 divide-y divide-line rounded-[14px] border border-line bg-cream-50 px-5 text-[14px]">
            {[
              ["Araç", `${summary.brand ?? ""} ${summary.model ?? ""} ${summary.year ?? ""}`.trim()],
              ["Durum", summary.category],
              ["Çalışıyor mu?", summary.running === "yes" ? "Evet" : summary.running === "no" ? "Hayır" : "Emin değil"],
              ["Konum", [summary.city, summary.district].filter(Boolean).join(" / ")],
              ["Ad Soyad", summary.fullName],
              ["Telefon", summary.phone],
              ["Fotoğraf", `${uploadedPhotos.length} adet`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-3">
                <dt className="font-medium text-ink-muted">{k}</dt>
                <dd className="text-right font-medium text-ink">{v || "—"}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 space-y-3">
            <label className="flex items-start gap-2.5 text-[13px] leading-snug text-ink-secondary">
              <input type="checkbox" name="consent" className="mt-0.5 h-4 w-4 shrink-0 accent-burgundy-700" />
              <span>
                <a href={routes.kvkk} className="font-medium text-burgundy-700 underline">KVKK Aydınlatma Metni</a>
                ’ni okudum; bilgilerimin değerlendirme amacıyla işlenmesini onaylıyorum.
              </span>
            </label>
            <Err msg={errors.consent} />
            <label className="flex items-start gap-2.5 text-[13px] leading-snug text-ink-secondary">
              <input type="checkbox" name="marketing" className="mt-0.5 h-4 w-4 shrink-0 accent-burgundy-700" />
              <span>Kampanya ve bilgilendirmeler için benimle iletişime geçilebilir. (opsiyonel)</span>
            </label>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-ink-muted">
            Bu form bir satın alma taahhüdü veya kesin teklif değildir. Talebiniz
            değerlendirilerek sizinle iletişime geçilir.
          </p>
        </div>

        {/* Nav */}
        <div className="mt-8 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button type="button" onClick={goBack} className="inline-flex items-center gap-1.5 rounded-[10px] border border-line-strong bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-cream-100">
              <ArrowLeft size={16} /> Geri
            </button>
          ) : <span />}
          {isLast ? (
            <SubmitButton disabled={uploading} />
          ) : (
            <button type="button" onClick={goNext} className="inline-flex items-center gap-1.5 rounded-[10px] bg-burgundy-700 px-6 py-3 text-sm font-semibold text-white hover:bg-burgundy-800">
              Devam <ArrowRight size={16} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
