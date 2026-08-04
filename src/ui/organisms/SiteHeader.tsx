import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";

type Props = {
  locale: Locale;
};

/** Title-block chrome — brand mark + locale on the critique wall. */
export function SiteHeader({ locale }: Props) {
  const other = locale === "en" ? "fa" : "en";

  return (
    <header className="relative border-b border-ink/15 bg-paper/40 px-5 py-3 backdrop-blur-[2px] sm:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-redline/50 to-transparent sm:inset-x-8"
      />
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2.5 font-display text-sm font-semibold uppercase tracking-[0.16em] text-ink"
        >
          <Image
            src="/favicon.svg"
            alt=""
            width={22}
            height={22}
            priority
            unoptimized
            className="h-[1.35rem] w-[1.35rem] shrink-0"
          />
          <span>qrbni.dev</span>
        </Link>
        <div className="flex items-center gap-5">
          <p
            aria-hidden
            className="hidden font-display text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-slate sm:block"
          >
            Istanbul · Partner
          </p>
          <nav
            aria-label={locale === "fa" ? "زبان" : "Language"}
            className="flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.16em] text-slate"
          >
            <Link
              href="/en"
              className={
                locale === "en"
                  ? "text-redline underline decoration-redline decoration-2 underline-offset-4"
                  : "hover:text-ink"
              }
              hrefLang="en"
            >
              EN
            </Link>
            <span aria-hidden className="text-ink/25">
              /
            </span>
            <Link
              href="/fa"
              className={
                locale === "fa"
                  ? "text-redline underline decoration-redline decoration-2 underline-offset-4"
                  : "hover:text-ink"
              }
              hrefLang="fa"
            >
              FA
            </Link>
            <span className="sr-only">
              {locale === "en" ? `Switch to ${other}` : `تغییر زبان`}
            </span>
          </nav>
        </div>
      </div>
    </header>
  );
}

export { BookCta } from "./BookCta";
