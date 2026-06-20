"use client";

import { createContext, useContext } from "react";
import { defaultPublicSettings, type PublicSettings } from "@/lib/settings/shared";

const SettingsContext = createContext<PublicSettings>(defaultPublicSettings);

export function SettingsProvider({
  value,
  children,
}: {
  value: PublicSettings;
  children: React.ReactNode;
}) {
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

/** Resolved public settings (DB-overridden). Falls back to env defaults if no provider. */
export function useSettings(): PublicSettings {
  return useContext(SettingsContext);
}
