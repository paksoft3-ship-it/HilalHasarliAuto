"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { tracking } from "@/config/tracking";
import { readConsent, type ConsentState } from "@/lib/consent/consent";

/**
 * PostHog loader for product analytics + heatmaps ("sıcak harita") and session
 * replays. Consent-gated: PostHog is initialised opted-OUT and only starts
 * capturing once the visitor grants the "analytics" cookie category. Heatmaps
 * are built from autocapture click events, so no per-element wiring is needed.
 *
 * Public site only (not mounted under /admin). Renders nothing.
 */
function applyConsent(consent: ConsentState | null) {
  if (consent?.analytics) {
    posthog.opt_in_capturing();
  } else {
    posthog.opt_out_capturing();
  }
}

export function PostHogProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Init once (guarded against React re-mounts / Fast Refresh).
  useEffect(() => {
    if (!tracking.posthogKey || posthog.__loaded) return;

    posthog.init(tracking.posthogKey, {
      api_host: tracking.posthogHost,
      person_profiles: "identified_only",
      // We capture pageviews manually (App Router SPA navigations below).
      capture_pageview: false,
      capture_pageleave: true,
      autocapture: true, // powers heatmaps / click-maps
      // Start silent; opt-in happens only after analytics consent.
      opt_out_capturing_by_default: true,
      session_recording: { maskAllInputs: true },
      loaded: () => applyConsent(readConsent()),
    });

    const onConsent = (e: Event) => applyConsent((e as CustomEvent<ConsentState>).detail);
    window.addEventListener("on:consent-updated", onConsent);
    return () => window.removeEventListener("on:consent-updated", onConsent);
  }, []);

  // Capture a $pageview on every client-side route change.
  useEffect(() => {
    if (!tracking.posthogKey || !posthog.__loaded) return;
    const qs = searchParams?.toString();
    posthog.capture("$pageview", {
      $current_url: window.location.origin + pathname + (qs ? `?${qs}` : ""),
    });
  }, [pathname, searchParams]);

  return null;
}
