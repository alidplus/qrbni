"use client";

import { useEffect } from "react";
import { PRODUCTION_HOST } from "@/config/site";

export type TelemetryEvent = "new_visitor" | "meeting_click";

function canTrackClient(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.hostname === PRODUCTION_HOST;
}

/** Client-side beacon — server still re-checks production + secrets. */
export function trackTelemetry(
  event: TelemetryEvent,
  extra?: { path?: string; locale?: string },
): void {
  if (!canTrackClient()) return;

  const payload = JSON.stringify({
    event,
    path: extra?.path ?? window.location.pathname,
    locale: extra?.locale,
    referrer: document.referrer || undefined,
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/telemetry", blob);
      return;
    }
  } catch {
    // fall through
  }

  void fetch("/api/telemetry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);
}

const SESSION_VISITOR = "qrbni:tg:visitor";

/**
 * Probe once per browser session. Server only notifies Telegram when the
 * visitor cookie is missing (true first visit).
 */
export function SiteVisitBeacon({ locale }: { locale: string }) {
  useEffect(() => {
    if (!canTrackClient()) return;
    try {
      if (sessionStorage.getItem(SESSION_VISITOR)) return;
      sessionStorage.setItem(SESSION_VISITOR, "1");
    } catch {
      // private mode — still notify
    }
    trackTelemetry("new_visitor", { locale });
  }, [locale]);

  return null;
}
