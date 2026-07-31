"use client";

import type { ReactNode } from "react";
import { trackTelemetry } from "@/ui/molecules/Telemetry";
import type { Locale } from "@/i18n/config";

const calendly = "https://calendly.com/alighorbani/30min";

type Props = {
  locale: Locale;
  className?: string;
  /** solid = primary red block; link = inline text CTA */
  variant?: "solid" | "link";
  children?: ReactNode;
};

export function BookCta({
  locale,
  className = "",
  variant = "solid",
  children,
}: Props) {
  const label =
    children ?? (locale === "fa" ? "رزرو ۳۰ دقیقه" : "Book 30 min");

  const base =
    variant === "solid"
      ? "inline-flex items-center justify-center bg-redline px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.14em] text-paper transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-redline"
      : "font-display text-xs font-semibold tracking-[0.14em] text-redline uppercase hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-redline";

  return (
    <a
      href={calendly}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${className}`}
      onClick={() => {
        trackTelemetry("meeting_click", { locale });
      }}
    >
      {label}
    </a>
  );
}
