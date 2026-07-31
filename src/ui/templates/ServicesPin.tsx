import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { ServiceCategoryGroup } from "@/domains/services";
import { BookCta, SiteHeader } from "@/ui/organisms/SiteHeader";

type Copy = {
  title: string;
  support: string;
  contact: string;
  book: string;
  empty: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    title: "Services",
    support:
      "Outcome-led work — architecture, delivery, and partnership. Not ticket queues.",
    contact: "Contact",
    book: "Book 30 min",
    empty: "Offerings will appear here once published in NocoDB.",
  },
  fa: {
    title: "خدمات",
    support: "کار نتیجه‌محور — معماری، تحویل و شراکت. نه صف تیکت.",
    contact: "تماس",
    book: "رزرو ۳۰ دقیقه",
    empty: "خدمات پس از انتشار در NocoDB اینجا نمایش داده می‌شوند.",
  },
};

type Props = {
  locale: Locale;
  catalog: ServiceCategoryGroup[];
};

function ServiceCtas({
  locale,
  ctaType,
  labels,
}: {
  locale: Locale;
  ctaType: "contact" | "calendly" | "both";
  labels: Copy;
}) {
  const contact = (
    <Link
      href={`/${locale}/contact`}
      className="font-display text-xs font-semibold tracking-[0.14em] text-ink uppercase underline decoration-redline decoration-2 underline-offset-4 hover:text-redline"
    >
      {labels.contact}
    </Link>
  );
  const book = <BookCta locale={locale} variant="link">{labels.book}</BookCta>;
  if (ctaType === "contact") return contact;
  if (ctaType === "calendly") return book;
  return (
    <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {book}
      {contact}
    </span>
  );
}

export function ServicesPin({ locale, catalog }: Props) {
  const t = copy[locale];

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader locale={locale} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-12 sm:px-8 lg:py-16">
        <header className="max-w-2xl">
          <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-ink uppercase sm:text-5xl">
            {t.title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-slate sm:text-lg">
            {t.support}
          </p>
          <div className="mt-8">
            <BookCta locale={locale} />
          </div>
        </header>

        {catalog.length === 0 ? (
          <p className="mt-14 max-w-prose text-slate">{t.empty}</p>
        ) : (
          <div className="mt-14 space-y-16">
            {catalog.map((group) => (
              <section key={group.id} aria-labelledby={`cat-${group.id}`}>
                <h2
                  id={`cat-${group.id}`}
                  className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink uppercase sm:text-3xl"
                >
                  {group.title}
                </h2>
                {group.description ? (
                  <p className="mt-3 max-w-prose text-base text-slate">
                    {group.description}
                  </p>
                ) : null}

                <ul className="mt-8 space-y-4">
                  {group.services.map((svc, i) => (
                    <li
                      key={svc.id}
                      className="pin-sheet pin-settle relative px-6 py-6 sm:px-8"
                      style={{
                        ["--pin-rot" as string]: i % 2 === 0 ? "0.35deg" : "-0.4deg",
                      }}
                    >
                      <span
                        aria-hidden
                        className="tape absolute -top-1 start-6 h-3 w-12 -rotate-2"
                      />
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0 max-w-xl">
                          <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink">
                            {svc.title}
                          </h3>
                          {svc.summary ? (
                            <p className="mt-2 text-base leading-relaxed text-slate">
                              {svc.summary}
                            </p>
                          ) : null}
                          {svc.bullets.length > 0 ? (
                            <ul className="mt-4 space-y-1.5 text-sm text-ink/90">
                              {svc.bullets.map((b) => (
                                <li key={b} className="flex gap-2">
                                  <span aria-hidden className="text-redline">
                                    /
                                  </span>
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                        <ServiceCtas
                          locale={locale}
                          ctaType={svc.ctaType}
                          labels={t}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
