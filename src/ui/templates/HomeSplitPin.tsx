import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { ExperienceEntry } from "@/domains/cv";
import {
  Crosshair,
  FigLabel,
  PinSheet,
  PinWall,
  PortraitPlate,
  RedlineEm,
  TitleBlockMeta,
} from "@/ui/atoms";
import { BookCta, SiteHeader } from "@/ui/organisms/SiteHeader";

type Copy = {
  name: string;
  role: string;
  fig: string;
  pitch: ReactNode;
  support: ReactNode;
  experience: string;
  selectedExperience: string;
  services: string;
  blog: string;
  contact: string;
  present: string;
  viewExperience: string;
  openRole: string;
  portraitAlt: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    name: "Ali Ghorbani",
    role: "Technical Partner",
    fig: "Fig. 01 · Portrait assembly",
    pitch: (
      <>
        I help startups and businesses <RedlineEm>design</RedlineEm>,{" "}
        <RedlineEm>build</RedlineEm>, and <RedlineEm>scale</RedlineEm> reliable
        web products.
      </>
    ),
    support: (
      <>
        Senior technical partner —{" "}
        <span className="redline-underline">architecture</span>,{" "}
        <span className="redline-underline">delivery</span>, and long-term
        product work. Not ticket hours.
      </>
    ),
    experience: "Experience",
    selectedExperience: "Selected delivery",
    services: "Services",
    blog: "Blog",
    contact: "Contact",
    present: "present",
    viewExperience: "Full timeline",
    openRole: "Open full timeline",
    portraitAlt: "Pencil portrait of Ali Ghorbani",
  },
  fa: {
    name: "علی قربانی",
    role: "شریک فنی",
    fig: "شکل ۰۱ · مونتاژ پرتره",
    pitch: (
      <>
        به استارتاپ‌ها و کسب‌وکارها کمک می‌کنم محصولات وب قابل‌اعتماد را{" "}
        <RedlineEm>طراحی</RedlineEm>، <RedlineEm>پیاده‌سازی</RedlineEm> و{" "}
        <RedlineEm>مقیاس‌پذیر</RedlineEm> کنند.
      </>
    ),
    support: (
      <>
        شریک فنی ارشد — <span className="redline-underline">معماری</span>،{" "}
        <span className="redline-underline">تحویل محصول</span> و همکاری بلندمدت.
        نه فروش ساعت کاری.
      </>
    ),
    experience: "سوابق",
    selectedExperience: "گزیده تحویل",
    services: "خدمات",
    blog: "بلاگ",
    contact: "تماس",
    present: "اکنون",
    viewExperience: "خط‌زمان کامل",
    openRole: "مشاهده خط‌زمان کامل",
    portraitAlt: "پرتره مدادی علی قربانی",
  },
};

type Props = {
  locale: Locale;
  experiences: ExperienceEntry[];
};

/** Prefer a real highlight (outcome) over résumé-title framing. */
function deliveryLine(entry: ExperienceEntry): string | null {
  return entry.highlights[0] ?? entry.summary ?? null;
}

export function HomeSplitPin({ locale, experiences }: Props) {
  const t = copy[locale];
  const selected = experiences.slice(0, 3);
  const timelineHref = `/${locale}/experience`;

  return (
    <PinWall>
      <SiteHeader locale={locale} />

      {/*
        Mobile: reading column first (pitch + Book above the fold).
        Desktop: portrait stays col 1 (sticky), reading col 2 — via col-start, not DOM order.
      */}
      <main className="flex flex-1 flex-col lg:grid lg:grid-cols-[minmax(320px,0.88fr)_minmax(0,1.22fr)] lg:items-start">
        {/* Reading / Persuade — source-first for mobile Calendly */}
        <section className="flex flex-col gap-9 px-5 pb-8 pt-8 sm:gap-11 sm:px-10 sm:pt-10 lg:col-start-2 lg:row-start-1 lg:gap-11 lg:px-14 lg:py-16 xl:px-16">
          <div
            className="pin-settle max-w-xl space-y-5 sm:space-y-6"
            style={{ ["--pin-rot" as string]: "0deg" }}
          >
            <span
              aria-hidden
              className="inline-block h-2.5 w-2.5 rotate-45 bg-redline"
            />
            <h1 className="font-display text-[1.85rem] font-semibold leading-[1.15] tracking-[-0.025em] text-ink sm:text-4xl sm:leading-[1.12]">
              {t.pitch}
            </h1>
            <p className="max-w-prose text-base leading-relaxed text-slate sm:text-lg">
              {t.support}
            </p>
            {/* Distill: one secondary Contact beside Book — not also in Sections */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
              <BookCta locale={locale} />
              <Link
                href={`/${locale}/contact`}
                className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-slate underline decoration-ink/25 underline-offset-4 hover:text-ink hover:decoration-ink/50"
              >
                {t.contact}
              </Link>
            </div>
          </div>

          <nav
            aria-label={locale === "fa" ? "بخش‌ها" : "Sections"}
            className="flex flex-wrap gap-x-6 gap-y-2 border-y border-ink/12 py-4 font-display text-xs font-semibold uppercase tracking-[0.18em] text-slate"
          >
            <Link className="hover:text-ink" href={timelineHref}>
              {t.experience}
            </Link>
            <Link className="hover:text-ink" href={`/${locale}/services`}>
              {t.services}
            </Link>
            <Link className="hover:text-ink" href={`/${locale}/blog`}>
              {t.blog}
            </Link>
          </nav>

          {selected.length > 0 ? (
            <div>
              <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-ink">
                  {t.selectedExperience}
                </h2>
                <Link
                  href={timelineHref}
                  className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-redline hover:underline"
                >
                  {t.viewExperience} →
                </Link>
              </div>
              <ol className="space-y-4">
                {selected.map((entry, i) => {
                  const proof = deliveryLine(entry);
                  const range = [
                    entry.startDate,
                    entry.endDate || (entry.current ? t.present : null),
                  ]
                    .filter(Boolean)
                    .join(" – ");

                  return (
                    <li key={entry.id}>
                      <Link
                        href={timelineHref}
                        aria-label={`${t.openRole}: ${entry.company}`}
                        className="group block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-redline"
                      >
                        <PinSheet
                          as="div"
                          className="px-5 py-5 transition-[box-shadow,transform] group-hover:-translate-y-0.5 sm:px-6"
                          rotate={i % 2 === 0 ? 0.45 : -0.55}
                          settleDelayMs={100 + i * 90}
                          tapes="strip"
                          registration={false}
                          insetRule={false}
                        >
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <p className="font-display text-lg font-semibold uppercase tracking-[0.03em] text-ink group-hover:text-redline">
                              {entry.company}
                            </p>
                            {range ? (
                              <p className="font-display text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-slate">
                                {range}
                              </p>
                            ) : null}
                          </div>

                          {proof ? (
                            <p className="mt-3 max-w-prose text-base leading-relaxed text-slate line-clamp-2">
                              {proof}
                            </p>
                          ) : entry.location ? (
                            <p className="mt-2 text-base text-slate">
                              {entry.location}
                            </p>
                          ) : null}

                          {/* Job title demoted — real highlight leads the partner story */}
                          {entry.title ? (
                            <p className="mt-3 font-display text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-ink/45">
                              {entry.title}
                            </p>
                          ) : null}
                        </PinSheet>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
          ) : null}
        </section>

        {/* Portrait assembly — compressed on mobile; sticky artifact on lg+ */}
        <section
          aria-label={t.name}
          className="relative flex justify-center px-5 pb-10 pt-2 sm:px-10 sm:pb-12 lg:col-start-1 lg:row-start-1 lg:sticky lg:top-0 lg:min-h-[calc(100vh-3.25rem)] lg:items-center lg:border-e lg:border-ink/12 lg:px-12 lg:py-14"
        >
          <PinSheet
            className="w-full max-w-[17.5rem] px-5 pb-7 pt-5 sm:max-w-sm sm:px-7 sm:pb-9 sm:pt-7 lg:max-w-[26rem] lg:px-8 lg:pb-11 lg:pt-8"
            rotate={-1.15}
            tapes="top-bottom"
            pins
          >
            <div className="flex items-start justify-between gap-3">
              <FigLabel>{t.fig}</FigLabel>
              <Crosshair className="mt-0.5 shrink-0 text-redline/70" size={16} />
            </div>

            <PortraitPlate className="mt-4 sm:mt-5">
              <Image
                src="/ali-portrait.webp"
                alt={t.portraitAlt}
                width={1200}
                height={1168}
                priority
                sizes="(max-width: 1024px) 70vw, 26rem"
                className={`h-auto w-full object-cover object-[center_16%] ${
                  locale === "fa" ? "-scale-x-100" : ""
                }`}
              />
            </PortraitPlate>

            <p className="mt-6 font-display text-[2.1rem] font-bold uppercase leading-[0.92] tracking-[-0.025em] text-ink sm:mt-8 sm:text-5xl lg:text-[3.35rem]">
              {t.name}
            </p>
            <p className="redline-underline mt-3 font-display text-sm font-semibold uppercase tracking-[0.16em] text-ink sm:mt-3.5">
              {t.role}
            </p>

            <div className="mt-6 flex items-end justify-between gap-4 border-t border-ink/15 pt-4 sm:mt-9">
              <TitleBlockMeta
                className="mt-0 flex-1 border-0 pt-0"
                rows={[
                  { label: "Drawn", value: "A.G." },
                  { label: "Scale", value: "Human" },
                  { label: "Site", value: "qrbni.dev · Istanbul" },
                ]}
              />
              <Crosshair className="mb-1 shrink-0" size={20} />
            </div>
          </PinSheet>
        </section>
      </main>
    </PinWall>
  );
}
