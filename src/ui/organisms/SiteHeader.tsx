import Link from "next/link";
import type { Locale } from "@/i18n/config";

const calendly = "https://calendly.com/alighorbani/30min";

type Props = {
  locale: Locale;
};

export function SiteHeader({ locale }: Props) {
  const other = locale === "en" ? "fa" : "en";

  return (
    <header className="flex items-center justify-between gap-4 border-b border-ink/10 px-5 py-3 sm:px-8">
      <Link
        href={`/${locale}`}
        className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-ink"
      >
        qrbni.dev
      </Link>
      <nav
        aria-label={locale === "fa" ? "زبان" : "Language"}
        className="flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.16em] text-slate"
      >
        <Link
          href="/en"
          className={locale === "en" ? "text-redline" : "hover:text-ink"}
          hrefLang="en"
        >
          EN
        </Link>
        <span aria-hidden className="text-ink/25">
          /
        </span>
        <Link
          href="/fa"
          className={locale === "fa" ? "text-redline" : "hover:text-ink"}
          hrefLang="fa"
        >
          FA
        </Link>
        <span className="sr-only">
          {locale === "en" ? `Switch to ${other}` : `تغییر زبان`}
        </span>
      </nav>
    </header>
  );
}

export function BookCta({
  locale,
  className = "",
}: {
  locale: Locale;
  className?: string;
}) {
  const label = locale === "fa" ? "رزرو ۳۰ دقیقه" : "Book 30 min";
  return (
    <a
      href={calendly}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center bg-redline px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.14em] text-paper transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-redline ${className}`}
    >
      {label}
    </a>
  );
}
