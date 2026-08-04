import type { Metadata } from "next";
import { headers } from "next/headers";
import type { Locale } from "@/i18n/config";
import { getSiteSettings } from "@/domains/cv";
import { serverEnv } from "@/server/env";

export const SITE_URL = "https://qrbni.dev";
export const SITE_NAME = "qrbni.dev";

export const SITE_TITLE_EN = "Ali Ghorbani — Technical Partner";
export const SITE_TITLE_FA = "علی قربانی — شریک فنی";

export const SITE_DESCRIPTION_EN =
  "I help startups and businesses design, build, and scale reliable web products.";
export const SITE_DESCRIPTION_FA =
  "به استارتاپ‌ها و کسب‌وکارها کمک می‌کنم محصولات وب قابل‌اعتماد را طراحی، پیاده‌سازی و مقیاس‌پذیر کنند.";

export const SAME_AS = [
  "https://www.linkedin.com/in/ali-ghorbani-web/",
  "https://github.com/alidplus",
  "https://www.twine.net/qrbni",
] as const;

export const OG_DEFAULT = {
  url: "/og-default.png",
  width: 1200,
  height: 630,
  alt: "Ali Ghorbani — Technical Partner · qrbni.dev",
  type: "image/png",
} as const;

export function ogLocale(locale: Locale): string {
  return locale === "fa" ? "fa_IR" : "en_US";
}

export function siteTitle(locale: Locale): string {
  return locale === "fa" ? SITE_TITLE_FA : SITE_TITLE_EN;
}

export function siteDescription(locale: Locale): string {
  return locale === "fa" ? SITE_DESCRIPTION_FA : SITE_DESCRIPTION_EN;
}

/** Language alternates including x-default → English. */
export function localeAlternates(path = ""): NonNullable<
  Metadata["alternates"]
>["languages"] {
  const suffix = path.startsWith("/") ? path : path ? `/${path}` : "";
  return {
    en: `/en${suffix}`,
    fa: `/fa${suffix}`,
    "x-default": `/en${suffix}`,
  };
}

export function pageOpenGraph(input: {
  locale: Locale;
  title: string;
  description: string;
  path: string;
}): Metadata["openGraph"] {
  return {
    type: "website",
    locale: ogLocale(input.locale),
    alternateLocale: input.locale === "fa" ? ["en_US"] : ["fa_IR"],
    url: `${SITE_URL}${input.path}`,
    siteName: SITE_NAME,
    title: input.title,
    description: input.description,
    images: [OG_DEFAULT],
  };
}

export function pageTwitter(input: {
  title: string;
  description: string;
}): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title: input.title,
    description: input.description,
    images: [{ url: OG_DEFAULT.url, alt: OG_DEFAULT.alt }],
  };
}

/** Preview host always off; otherwise honor SiteSettings.indexing_enabled (default true). */
export async function isIndexingEnabled(): Promise<boolean> {
  const host = (await headers()).get("host");
  if (serverEnv.isPreviewHost(host)) return false;
  try {
    const settings = await getSiteSettings();
    if (settings && settings.indexing_enabled === false) return false;
    return true;
  } catch {
    return true;
  }
}

export function robotsForIndexing(indexing: boolean): Metadata["robots"] {
  return indexing
    ? { index: true, follow: true }
    : { index: false, follow: false };
}
