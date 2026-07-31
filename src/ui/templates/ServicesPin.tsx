import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { ServiceCategoryGroup } from "@/domains/services";
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
  contact: string;
  book: string;
  empty: string;
  wallFig: (n: number) => string;
  offeringMeta: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    title: "Services",
    support: (
      <>
        Outcome-led work — <RedlineEm>architecture</RedlineEm>,{" "}
        <RedlineEm>delivery</RedlineEm>, and partnership. Not ticket queues.
      </>
    ),
    contact: "Contact",
    book: "Book 30 min",
    empty: "Offerings will appear here once published in NocoDB.",
    wallFig: (n) => `Fig. ${String(n).padStart(2, "0")} · Category wall`,
    offeringMeta: "Offering",
  },
  fa: {
    title: "خدمات",
    support: (
      <>
        کار نتیجه‌محور — <RedlineEm>معماری</RedlineEm>،{" "}
        <RedlineEm>تحویل</RedlineEm> و شراکت. نه صف تیکت.
      </>
    ),
    contact: "تماس",
    book: "رزرو ۳۰ دقیقه",
    empty: "خدمات پس از انتشار در NocoDB اینجا نمایش داده می‌شوند.",
    wallFig: (n) => `شکل ${String(n).padStart(2, "0")} · دیوار دسته`,
    offeringMeta: "خدمت",
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
      className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-ink underline decoration-redline decoration-2 underline-offset-4 hover:text-redline"
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
    <PinWall>
      <SiteHeader locale={locale} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-12 sm:px-8 lg:py-16">
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
          <div className="mt-8">
            <BookCta locale={locale} />
          </div>
        </header>

        {catalog.length === 0 ? (
          <PinSheet
            className="mt-14 max-w-xl px-7 py-10"
            rotate={0.35}
            tapes="strip"
            registration={false}
          >
            <p className="text-base text-slate">{t.empty}</p>
          </PinSheet>
        ) : (
          <div className="mt-16 space-y-20">
            {catalog.map((group, gi) => (
              <section
                key={group.id}
                aria-labelledby={`cat-${group.id}`}
                className="relative"
              >
                {/* Category wall header — title block, not a card grid */}
                <div className="mb-8 max-w-2xl border-b border-ink/12 pb-6">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <FigLabel>{t.wallFig(gi + 1)}</FigLabel>
                    <Crosshair
                      className="shrink-0 text-redline/50"
                      size={14}
                    />
                  </div>
                  <h2
                    id={`cat-${group.id}`}
                    className="font-display text-2xl font-semibold uppercase tracking-[-0.02em] text-ink sm:text-3xl"
                  >
                    {group.title}
                  </h2>
                  {group.description ? (
                    <p className="mt-3 max-w-prose text-base text-slate">
                      {group.description}
                    </p>
                  ) : null}
                </div>

                <ul className="space-y-5">
                  {group.services.map((svc, i) => (
                    <PinSheet
                      key={svc.id}
                      as="li"
                      className="px-6 py-6 sm:px-8 sm:py-7"
                      rotate={i % 2 === 0 ? 0.4 : -0.45}
                      settleDelayMs={50 + gi * 80 + i * 45}
                      tapes={i === 0 ? "top" : "strip"}
                      pins={i === 0}
                      registration={i === 0}
                      insetRule={i === 0}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-5">
                        <div className="min-w-0 max-w-xl flex-1">
                          <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
                            {svc.title}
                          </h3>
                          {svc.summary ? (
                            <p className="mt-2 text-base leading-relaxed text-slate">
                              {svc.summary}
                            </p>
                          ) : null}
                          {svc.bullets.length > 0 ? (
                            <ul className="mt-4 space-y-2 text-base text-ink/90">
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
                          <TitleBlockMeta
                            className="mt-6"
                            rows={[
                              {
                                label: t.offeringMeta,
                                value: svc.key || String(svc.id),
                              },
                              {
                                label: locale === "fa" ? "دسته" : "Wall",
                                value: group.key || group.title,
                              },
                            ]}
                          />
                        </div>
                        <div className="shrink-0 pt-1">
                          <ServiceCtas
                            locale={locale}
                            ctaType={svc.ctaType}
                            labels={t}
                          />
                        </div>
                      </div>
                    </PinSheet>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
    </PinWall>
  );
}
