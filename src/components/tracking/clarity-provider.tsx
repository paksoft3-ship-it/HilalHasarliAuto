"use client";

import { useEffect } from "react";
import { tracking } from "@/config/tracking";
import { readConsent, type ConsentState } from "@/lib/consent/consent";

/**
 * Microsoft Clarity loader for heatmaps ("ısı haritası") + session replays.
 * Consent-gated: the Clarity tag is injected only after the visitor grants the
 * "analytics" cookie category, and grant/revoke is mirrored through Clarity's
 * consent signal API. Inputs are masked by Clarity's default privacy settings.
 *
 * Public site only (not mounted under /admin). Renders nothing.
 */
type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] };

declare global {
  interface Window {
    clarity?: ClarityFn;
  }
}

function loadClarity(projectId: string) {
  if (window.clarity) return;
  // Bootstrap queue so consent calls made before tag.js loads aren't lost.
  const queue: ClarityFn = ((...args: unknown[]) => {
    (queue.q = queue.q || []).push(args);
  }) as ClarityFn;
  window.clarity = queue;

  const tag = document.createElement("script");
  tag.async = true;
  tag.src = `https://www.clarity.ms/tag/${projectId}`;
  document.head.appendChild(tag);
}

function applyConsent(consent: ConsentState | null, projectId: string) {
  if (consent?.analytics) {
    loadClarity(projectId);
    window.clarity?.("consent");
  } else {
    window.clarity?.("consent", false);
  }
}

export function ClarityProvider() {
  useEffect(() => {
    const id = tracking.clarityId;
    if (!id) return;

    applyConsent(readConsent(), id);
    const onConsent = (e: Event) =>
      applyConsent((e as CustomEvent<ConsentState>).detail, id);
    window.addEventListener("on:consent-updated", onConsent);
    return () => window.removeEventListener("on:consent-updated", onConsent);
  }, []);

  return null;
}
