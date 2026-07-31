"use client";

import type { ReactNode } from "react";
import { trackTelemetry } from "@/ui/molecules/Telemetry";
import type { Locale } from "@/i18n/config";

const calendly = "https://calendly.com/alighorbani/30min";

function CalendarMark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      width="14"
      height="14"
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="2" y="3.5" width="12" height="10.5" rx="1" />
      <path d="M2 7h12M5.5 2v3M10.5 2v3" />
    </svg>
  );
}

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
      ? "inline-flex items-center justify-center gap-2.5 bg-redline px-5 py-3.5 font-display text-sm font-bold uppercase tracking-[0.14em] text-paper transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-redline"
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
      {variant === "solid" ? <CalendarMark className="opacity-90" /> : null}
      {label}
    </a>
  );
}
