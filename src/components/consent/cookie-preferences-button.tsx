"use client";

import { openCookiePreferences } from "@/lib/consent/consent";

export function CookiePreferencesButton() {
  return (
    <button type="button" onClick={openCookiePreferences} className="hover:text-white">
      Çerez Tercihleri
    </button>
  );
}
