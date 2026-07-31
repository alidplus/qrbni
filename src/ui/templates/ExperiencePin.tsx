import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { ExperienceEntry } from "@/domains/cv";
import { BookCta, SiteHeader } from "@/ui/organisms/SiteHeader";

type Copy = {
  title: string;
  support: string;
  present: string;
  empty: string;
  contact: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    title: "Experience",
    support:
      "Roles and delivery arcs — the plot sheets behind the partnership, not a résumé dump.",
    present: "present",
    empty: "Experience will appear here once loaded from NocoDB.",
    contact: "Contact",
  },
  fa: {
    title: "سوابق",
    support: "نقش‌ها و مسیر تحویل — برگه‌های پین پشت شراکت، نه رزومه خشک.",
    present: "اکنون",
    empty: "سوابق پس از بارگذاری از NocoDB اینجا نمایش داده می‌شوند.",
    contact: "تماس",
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
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader locale={locale} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-8 lg:py-16">
        <header className="max-w-2xl">
          <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-ink uppercase sm:text-5xl">
            {t.title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-slate sm:text-lg">
            {t.support}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <BookCta locale={locale} />
            <Link
              href={`/${locale}/contact`}
              className="font-display text-sm font-semibold tracking-[0.14em] text-ink uppercase underline decoration-redline decoration-2 underline-offset-4 hover:text-redline"
            >
              {t.contact}
            </Link>
          </div>
        </header>

        {entries.length === 0 ? (
          <p className="mt-14 max-w-prose text-slate">{t.empty}</p>
        ) : (
          <ol className="mt-14 space-y-5">
            {entries.map((entry, i) => {
              const range = dateRange(entry, t.present);
              const href = entry.companyUrl || entry.website;
              return (
                <li
                  key={entry.id}
                  className="pin-sheet pin-settle relative px-6 py-7 sm:px-8"
                  style={{
                    ["--pin-rot" as string]: i % 2 === 0 ? "0.4deg" : "-0.45deg",
                  }}
                >
                  <span
                    aria-hidden
                    className="tape absolute -top-1 start-6 h-3 w-11 -rotate-2"
                  />
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
                      <p className="font-display text-[0.7rem] font-semibold tracking-[0.12em] text-slate uppercase">
                        {range}
                      </p>
                    ) : null}
                  </div>

                  {entry.title ? (
                    <p className="mt-2 font-display text-sm font-semibold tracking-[0.06em] text-ink uppercase">
                      {entry.title}
                    </p>
                  ) : null}

                  {entry.relatedCompany ? (
                    <p className="mt-1 text-sm text-slate">
                      {locale === "fa" ? "مرتبط با" : "Related"} · {entry.relatedCompany}
                    </p>
                  ) : null}

                  {entry.location ? (
                    <p className="mt-1 text-sm text-slate">{entry.location}</p>
                  ) : null}

                  {entry.summary ? (
                    <p className="mt-4 max-w-prose text-base leading-relaxed text-slate">
                      {entry.summary}
                    </p>
                  ) : null}

                  {entry.highlights.length > 0 ? (
                    <ul className="mt-4 space-y-1.5 text-sm text-ink/90">
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
                    <p className="mt-5 font-display text-[0.65rem] font-semibold tracking-[0.1em] text-slate uppercase">
                      {entry.tech.join(" · ")}
                    </p>
                  ) : null}

                  <span
                    aria-hidden
                    className="redline-mark absolute end-4 top-4 font-display text-[0.65rem] font-bold"
                  >
                    /
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </main>
    </div>
  );
}
