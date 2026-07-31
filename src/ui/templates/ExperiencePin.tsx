import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { ExperienceEntry } from "@/domains/cv";
import {
  Crosshair,
  FigLabel,
  PinSheet,
  PinWall,
  RedlineEm,
  TitleBlockMeta,
} from "@/ui/atoms";
import { BookCta, SiteHeader } from "@/ui/organisms/SiteHeader";

type Copy = {
  title: string;
  support: ReactNode;
  present: string;
  empty: string;
  contact: string;
  roleFig: (n: number) => string;
  related: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    title: "Experience",
    support: (
      <>
        Roles and <RedlineEm>delivery</RedlineEm> arcs — the plot sheets behind
        the partnership, not a résumé dump.
      </>
    ),
    present: "present",
    empty: "Experience will appear here once loaded from NocoDB.",
    contact: "Contact",
    roleFig: (n) => `Fig. ${String(n).padStart(2, "0")} · Role plate`,
    related: "Related",
  },
  fa: {
    title: "سوابق",
    support: (
      <>
        نقش‌ها و مسیر <RedlineEm>تحویل</RedlineEm> — برگه‌های پین پشت شراکت، نه
        رزومه خشک.
      </>
    ),
    present: "اکنون",
    empty: "سوابق پس از بارگذاری از NocoDB اینجا نمایش داده می‌شوند.",
    contact: "تماس",
    roleFig: (n) => `شکل ${String(n).padStart(2, "0")} · ورق نقش`,
    related: "مرتبط با",
  },
};

type Props = {
  locale: Locale;
  entries: ExperienceEntry[];
};

function dateRange(entry: ExperienceEntry, present: string): string {
  return [entry.startDate, entry.endDate || (entry.current ? present : null)]
    .filter(Boolean)
    .join(" – ");
}

export function ExperiencePin({ locale, entries }: Props) {
  const t = copy[locale];

  return (
    <PinWall>
      <SiteHeader locale={locale} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-8 lg:py-16">
        <header className="max-w-2xl">
          <div className="mb-5 flex items-center gap-3">
            <span
              aria-hidden
              className="inline-block h-2.5 w-2.5 rotate-45 bg-redline"
            />
            <Crosshair className="text-redline/60" size={14} />
          </div>
          <h1 className="font-display text-4xl font-bold uppercase tracking-[-0.02em] text-ink sm:text-5xl">
            {t.title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-slate sm:text-lg">
            {t.support}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <BookCta locale={locale} />
            <Link
              href={`/${locale}/contact`}
              className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-ink underline decoration-redline/50 underline-offset-4 hover:text-redline hover:decoration-redline"
            >
              {t.contact}
            </Link>
          </div>
        </header>

        {entries.length === 0 ? (
          <PinSheet
            className="mt-14 px-7 py-10"
            rotate={0.35}
            tapes="strip"
            registration={false}
          >
            <p className="text-base text-slate">{t.empty}</p>
          </PinSheet>
        ) : (
          <ol className="relative mt-14 space-y-6 ps-0 sm:space-y-7 sm:ps-6">
            {/* Critique timeline rail */}
            <span
              aria-hidden
              className="pointer-events-none absolute start-0 top-3 bottom-3 hidden w-px bg-redline/35 sm:block"
            />

            {entries.map((entry, i) => {
              const range = dateRange(entry, t.present);
              const href = entry.companyUrl || entry.website;
              const metaRows = [
                range
                  ? {
                      label: locale === "fa" ? "بازه" : "Span",
                      value: range,
                    }
                  : null,
                entry.location
                  ? {
                      label: locale === "fa" ? "مکان" : "Site",
                      value: entry.location,
                    }
                  : null,
              ].filter(Boolean) as Array<{ label: string; value: string }>;

              return (
                <PinSheet
                  key={entry.id}
                  as="li"
                  className="px-6 py-7 sm:px-8"
                  rotate={i % 2 === 0 ? 0.45 : -0.5}
                  settleDelayMs={60 + i * 55}
                  tapes={i === 0 ? "top" : "strip"}
                  pins={i === 0}
                  registration={i % 3 === 0}
                  insetRule={i % 3 === 0}
                >
                  <span
                    aria-hidden
                    className="absolute -start-[1.35rem] top-8 hidden h-2.5 w-2.5 rotate-45 bg-redline sm:block"
                  />

                  <div className="mb-4 flex items-start justify-between gap-3">
                    <FigLabel>{t.roleFig(i + 1)}</FigLabel>
                    <Crosshair
                      className="shrink-0 text-redline/45"
                      size={12}
                    />
                  </div>

                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-redline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-redline"
                        >
                          {entry.company}
                        </a>
                      ) : (
                        entry.company
                      )}
                    </h2>
                    {range ? (
                      <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate">
                        {range}
                      </p>
                    ) : null}
                  </div>

                  {entry.title ? (
                    <p className="mt-2 font-display text-sm font-semibold uppercase tracking-[0.06em] text-ink">
                      {entry.title}
                    </p>
                  ) : null}

                  {entry.relatedCompany ? (
                    <p className="mt-1 text-sm text-slate">
                      {t.related} · {entry.relatedCompany}
                    </p>
                  ) : null}

                  {entry.summary ? (
                    <p className="mt-4 max-w-prose text-base leading-relaxed text-slate">
                      {entry.summary}
                    </p>
                  ) : null}

                  {entry.highlights.length > 0 ? (
                    <ul className="mt-4 space-y-2 text-base text-ink/90">
                      {entry.highlights.map((h) => (
                        <li key={h} className="flex gap-2">
                          <span aria-hidden className="shrink-0 text-redline">
                            /
                          </span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {entry.tech.length > 0 ? (
                    <p className="mt-5 font-display text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-slate">
                      {entry.tech.join(" · ")}
                    </p>
                  ) : null}

                  {metaRows.length > 0 ? (
                    <TitleBlockMeta className="mt-6" rows={metaRows} />
                  ) : null}
                </PinSheet>
              );
            })}
          </ol>
        )}
      </main>
    </PinWall>
  );
}
