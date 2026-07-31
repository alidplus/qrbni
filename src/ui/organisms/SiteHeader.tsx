import Link from "next/link";
import type { Locale } from "@/i18n/config";

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

export { BookCta } from "./BookCta";
