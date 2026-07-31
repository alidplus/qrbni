"use client";

import { useLayoutEffect } from "react";
import { localeDirection, type Locale } from "@/i18n/config";

/**
 * Soft navigations do not remount root <html>. Sync lang/dir/fonts when locale changes.
 */
export function LocaleDocument({ locale }: { locale: Locale }) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const dir = localeDirection(locale);

    root.lang = locale;
    root.dir = dir;
    root.dataset.locale = locale;

    if (locale === "fa") {
      root.style.setProperty("--font-barlow", "var(--font-vazirmatn)");
      root.style.setProperty("--font-source", "var(--font-vazirmatn)");
    } else {
      root.style.removeProperty("--font-barlow");
      root.style.removeProperty("--font-source");
    }
  }, [locale]);

  return null;
}
