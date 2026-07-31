"use client";

import { useEffect } from "react";
import { PRODUCTION_HOST } from "@/config/site";

export type TelemetryEvent = "site_visit" | "contact_visit" | "meeting_click";

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

const SESSION_SITE = "qrbni:tg:site";
const SESSION_CONTACT = "qrbni:tg:contact";

/** Once per browser session on any locale page. */
export function SiteVisitBeacon({ locale }: { locale: string }) {
  useEffect(() => {
    if (!canTrackClient()) return;
    try {
      if (sessionStorage.getItem(SESSION_SITE)) return;
      sessionStorage.setItem(SESSION_SITE, "1");
    } catch {
      // private mode — still notify
    }
    trackTelemetry("site_visit", { locale });
  }, [locale]);

  return null;
}

/** Once per browser session when contact is opened. */
export function ContactVisitBeacon({ locale }: { locale: string }) {
  useEffect(() => {
    if (!canTrackClient()) return;
    try {
      if (sessionStorage.getItem(SESSION_CONTACT)) return;
      sessionStorage.setItem(SESSION_CONTACT, "1");
    } catch {
      // continue
    }
    trackTelemetry("contact_visit", { locale });
  }, [locale]);

  return null;
}
