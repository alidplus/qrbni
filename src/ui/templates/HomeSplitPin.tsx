import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { ExperienceResponse } from "@/generated/nocodb";
import { BookCta, SiteHeader } from "@/ui/organisms/SiteHeader";

type Copy = {
  name: string;
  role: string;
  fig: string;
  pitch: string;
  support: string;
  experience: string;
  services: string;
  blog: string;
  contact: string;
  present: string;
  viewExperience: string;
  portraitAlt: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    name: "Ali Ghorbani",
    role: "Technical Partner",
    fig: "Fig. 01 · Portrait assembly",
    pitch: "I help startups and businesses design, build, and scale reliable web products.",
    support:
      "Senior technical partner — architecture, delivery, and long-term product work. Not ticket hours.",
    experience: "Experience",
    services: "Services",
    blog: "Blog",
    contact: "Contact",
    present: "present",
    viewExperience: "View experience",
    portraitAlt: "Pencil portrait of Ali Ghorbani",
  },
  fa: {
    name: "علی قربانی",
    role: "شریک فنی",
    fig: "شکل ۰۱ · مونتاژ پرتره",
    pitch:
      "به استارتاپ‌ها و کسب‌وکارها کمک می‌کنم محصولات وب قابل‌اعتماد طراحی، پیاده‌سازی و مقیاس‌پذیر کنند.",
    support:
      "شریک فنی ارشد — معماری، تحویل محصول و همکاری بلندمدت. نه فروش ساعت کاری.",
    experience: "سوابق",
    services: "خدمات",
    blog: "بلاگ",
    contact: "تماس",
    present: "اکنون",
    viewExperience: "مشاهده سوابق",
    portraitAlt: "پرتره مدادی علی قربانی",
  },
};

type Props = {
  locale: Locale;
  experiences: ExperienceResponse[];
};

export function HomeSplitPin({ locale, experiences }: Props) {
  const t = copy[locale];

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader locale={locale} />

      <main className="flex flex-1 flex-col lg:grid lg:grid-cols-[minmax(300px,0.92fr)_minmax(0,1.18fr)] lg:items-stretch">
        {/* Left pin sheet — portrait assembly (comp-b) */}
        <section
          aria-label={t.name}
          className="relative flex items-start justify-center px-6 py-12 sm:px-10 lg:border-e lg:border-ink/10 lg:px-12 lg:py-16"
        >
          <div
            className="pin-sheet pin-settle relative w-full max-w-md px-6 pb-10 pt-7 sm:px-8 sm:pb-12 sm:pt-8"
            style={{ ["--pin-rot" as string]: "-1.1deg" }}
          >
            <span
              aria-hidden
              className="tape absolute -top-2 start-8 h-4 w-16 -rotate-3"
            />
            <span
              aria-hidden
              className="tape absolute -top-1 end-10 h-4 w-14 rotate-6"
            />
            <span
              aria-hidden
              className="tape absolute -bottom-2 start-1/2 h-3.5 w-20 -translate-x-1/2 rotate-1"
            />

            <p className="font-display text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-slate">
              {t.fig}
            </p>

            <div className="portrait-frame relative mt-5 overflow-hidden">
              <Image
                src="/ali-portrait.webp"
                alt={t.portraitAlt}
                width={1200}
                height={1168}
                priority
                sizes="(max-width: 1024px) 90vw, 28rem"
                className="h-auto w-full object-cover object-[center_18%]"
              />
              {/* Construction marks — geometric, not doodle */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-4 start-2 w-px bg-ink/15"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-4 end-2 w-px bg-ink/15"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute start-3 end-3 top-3 h-px bg-ink/10"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute start-3 end-3 bottom-3 h-px bg-ink/10"
              />
            </div>

            <h1 className="mt-7 font-display text-4xl font-bold uppercase leading-[0.95] tracking-[-0.02em] text-ink sm:text-5xl lg:text-6xl">
              {t.name}
            </h1>
            <p className="mt-3 font-display text-sm font-semibold uppercase tracking-[0.14em] text-ink underline decoration-redline decoration-2 underline-offset-6">
              {t.role}
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-ink/15 pt-4 font-display text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-slate">
              <div>
                <dt className="inline text-ink/50">Drawn · </dt>
                <dd className="inline">A.G.</dd>
              </div>
              <div>
                <dt className="inline text-ink/50">Scale · </dt>
                <dd className="inline">Human</dd>
              </div>
              <div className="col-span-2">
                <dt className="inline text-ink/50">Site · </dt>
                <dd className="inline">qrbni.dev · Istanbul</dd>
              </div>
            </dl>

            <div
              aria-hidden
              className="pointer-events-none absolute inset-3 border border-ink/10"
            />
            <div
              aria-hidden
              className="absolute bottom-5 start-6 h-5 w-5 border-b-2 border-s-2 border-redline"
            />
            <div
              aria-hidden
              className="absolute bottom-5 end-6 h-5 w-5 border-b-2 border-e-2 border-redline"
            />
          </div>
        </section>

        {/* Right reading column */}
        <section className="flex flex-col justify-center gap-10 px-6 py-12 sm:px-10 lg:px-14 lg:py-20">
          <div
            className="pin-settle max-w-xl space-y-5"
            style={{ ["--pin-rot" as string]: "0deg" }}
          >
            <h2 className="font-display text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-4xl">
              {t.pitch}
            </h2>
            <p className="max-w-prose text-base leading-relaxed text-slate sm:text-lg">
              {t.support}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <BookCta locale={locale} />
              <Link
                href={`/${locale}/contact`}
                className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-ink underline decoration-redline decoration-2 underline-offset-4 hover:text-redline"
              >
                {t.contact}
              </Link>
            </div>
          </div>

          <nav
            aria-label={locale === "fa" ? "بخش‌ها" : "Sections"}
            className="flex flex-wrap gap-x-5 gap-y-2 font-display text-xs font-semibold uppercase tracking-[0.16em] text-slate"
          >
            <Link className="hover:text-redline" href={`/${locale}/experience`}>
              {t.experience}
            </Link>
            <Link className="hover:text-redline" href={`/${locale}/services`}>
              {t.services}
            </Link>
            <Link className="hover:text-redline" href={`/${locale}/blog`}>
              {t.blog}
            </Link>
            <Link
              className="hover:text-redline"
              href={`/${locale}/contact#privacy`}
            >
              {locale === "fa" ? "حریم خصوصی" : "Privacy"}
            </Link>
          </nav>

          {experiences.length > 0 ? (
            <div className="border-t border-ink/10 pt-8">
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-ink underline decoration-ink/30 underline-offset-6">
                  {t.experience}
                </h3>
                <Link
                  href={`/${locale}/experience`}
                  className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-redline hover:underline"
                >
                  {t.viewExperience} →
                </Link>
              </div>
              <ol className="space-y-3">
                {experiences.slice(0, 4).map((row, i) => (
                  <li
                    key={String(row.Id ?? i)}
                    className="pin-sheet relative px-4 py-3"
                    style={{
                      ["--pin-rot" as string]:
                        i % 2 === 0 ? "0.4deg" : "-0.5deg",
                      transform: `rotate(var(--pin-rot))`,
                    }}
                  >
                    <span
                      aria-hidden
                      className="tape absolute -top-1 start-4 h-3 w-10 -rotate-2"
                    />
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-display text-base font-semibold uppercase tracking-[0.04em] text-ink">
                        {row.Company}
                      </p>
                      <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate">
                        {[
                          row.StartDate,
                          row.EndDate || (row.Current ? t.present : null),
                        ]
                          .filter(Boolean)
                          .join(" – ")}
                      </p>
                    </div>
                    {row.Location ? (
                      <p className="mt-1 text-sm text-slate">{row.Location}</p>
                    ) : null}
                    <span
                      aria-hidden
                      className="redline-mark absolute end-3 top-3 font-display text-[0.65rem] font-bold"
                    >
                      /
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
