"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import {
  CONSENT_CATEGORIES,
  OPEN_PREFS_EVENT,
  readConsent,
  writeConsent,
} from "@/lib/consent/consent";
import { routes } from "@/config/navigation";
import { buttonClasses } from "@/components/ui/button";

type Optional = "functional" | "analytics" | "marketing";

export function CookieConsent() {
  const [show, setShow] = useState(false); // banner
  const [prefsOpen, setPrefsOpen] = useState(false); // modal
  const [prefs, setPrefs] = useState<Record<Optional, boolean>>({
    functional: false,
    analytics: false,
    marketing: false,
  });

  // Initialize from localStorage after mount (avoids SSR/hydration mismatch).
  useEffect(() => {
    const existing = readConsent();
    /* eslint-disable react-hooks/set-state-in-effect */
    if (existing) {
      setPrefs({
        functional: existing.functional,
        analytics: existing.analytics,
        marketing: existing.marketing,
      });
    } else {
      setShow(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    const onOpen = () => setPrefsOpen(true);
    window.addEventListener(OPEN_PREFS_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_PREFS_EVENT, onOpen);
  }, []);

  function acceptAll() {
    writeConsent({ functional: true, analytics: true, marketing: true }, "banner_accept_all");
    setShow(false);
    setPrefsOpen(false);
  }
  function rejectAll() {
    writeConsent({ functional: false, analytics: false, marketing: false }, "banner_reject_all");
    setShow(false);
    setPrefsOpen(false);
  }
  function savePrefs() {
    writeConsent(prefs, "preferences_saved");
    setShow(false);
    setPrefsOpen(false);
  }

  if (!show && !prefsOpen) return null;

  return (
    <>
      {/* Banner */}
      {show && !prefsOpen && (
        <div
          role="dialog"
          aria-label="Çerez bilgilendirmesi"
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-line/70 bg-white/50 backdrop-blur-md pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(22,27,31,0.10)]"
        >
          <div className="container-page flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <Cookie size={22} className="mt-0.5 shrink-0 text-burgundy-700" />
              <p className="text-[14px] leading-relaxed text-ink-secondary">
                Deneyiminizi iyileştirmek için çerezler kullanıyoruz. Tercihlerinizi
                yönetebilirsiniz. Ayrıntılar için{" "}
                <Link href={routes.cookies} className="font-medium text-burgundy-700 underline">
                  Çerez Politikası
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-col gap-2 lg:w-64 lg:shrink-0">
              <button onClick={acceptAll} className={buttonClasses({ variant: "primary", size: "sm" })}>
                Tümünü Kabul Et
              </button>
              <button onClick={() => setPrefsOpen(true)} className={buttonClasses({ variant: "dark", size: "sm" })}>
                Tercihleri Yönet
              </button>
              <button onClick={rejectAll} className={buttonClasses({ variant: "outline", size: "sm" })}>
                Tümünü Reddet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences modal */}
      {prefsOpen && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-charcoal-950/40 p-0 sm:items-center sm:p-4">
          <div role="dialog" aria-modal="true" aria-label="Çerez tercihleri" className="w-full max-w-lg rounded-t-[18px] border border-line bg-white sm:rounded-[18px]">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="text-lg font-bold text-ink">Çerez Tercihleri</h2>
              <button onClick={() => setPrefsOpen(false)} aria-label="Kapat" className="text-ink-muted hover:text-ink">
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[60vh] space-y-4 overflow-y-auto px-6 py-5">
              {CONSENT_CATEGORIES.map((c) => {
                const checked = c.locked ? true : prefs[c.id as Optional];
                return (
                  <div key={c.id} className="flex items-start justify-between gap-4 rounded-[12px] border border-line p-4">
                    <div>
                      <p className="text-sm font-semibold text-ink">{c.label}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">{c.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={c.locked}
                      onChange={(e) =>
                        setPrefs((p) => ({ ...p, [c.id]: e.target.checked }))
                      }
                      className="mt-1 h-5 w-5 shrink-0 accent-burgundy-700 disabled:opacity-50"
                      aria-label={c.label}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col gap-2 border-t border-line px-6 py-4 sm:flex-row sm:justify-between">
              <button onClick={rejectAll} className={buttonClasses({ variant: "outline", size: "sm" })}>
                Tümünü Reddet
              </button>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button onClick={savePrefs} className={buttonClasses({ variant: "dark", size: "sm" })}>
                  Seçimlerimi Kaydet
                </button>
                <button onClick={acceptAll} className={buttonClasses({ variant: "primary", size: "sm" })}>
                  Tümünü Kabul Et
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
