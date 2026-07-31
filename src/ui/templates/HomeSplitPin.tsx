import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { ExperienceResponse } from "@/generated/nocodb";
import { BookCta, SiteHeader } from "@/ui/organisms/SiteHeader";

type Copy = {
  name: string;
  pitch: string;
  support: string;
  experience: string;
  services: string;
  blog: string;
  contact: string;
  present: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    name: "Ali Ghorbani",
    pitch: "I help startups and businesses design, build, and scale reliable web products.",
    support:
      "Senior technical partner — architecture, delivery, and long-term product work. Not ticket hours.",
    experience: "Experience",
    services: "Services",
    blog: "Blog",
    contact: "Contact",
    present: "present",
  },
  fa: {
    name: "علی قربانی",
    pitch:
      "به استارتاپ‌ها و کسب‌وکارها کمک می‌کنم محصولات وب قابل‌اعتماد طراحی، پیاده‌سازی و مقیاس‌پذیر کنند.",
    support:
      "شریک فنی ارشد — معماری، تحویل محصول و همکاری بلندمدت. نه فروش ساعت کاری.",
    experience: "سوابق",
    services: "خدمات",
    blog: "بلاگ",
    contact: "تماس",
    present: "اکنون",
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

      <main className="flex flex-1 flex-col lg:grid lg:grid-cols-[minmax(280px,0.95fr)_minmax(0,1.15fr)] lg:items-stretch">
        {/* Left pin sheet */}
        <section
          aria-label={t.name}
          className="relative flex items-center justify-center px-6 py-14 sm:px-10 lg:border-e lg:border-ink/10 lg:px-12 lg:py-20"
        >
          <div
            className="pin-sheet pin-settle relative w-full max-w-md px-8 py-14 sm:px-10 sm:py-16"
            style={{ ["--pin-rot" as string]: "-1.1deg" }}
          >
            <span
              aria-hidden
              className="tape absolute -top-2 left-8 h-4 w-16 -rotate-3"
            />
            <span
              aria-hidden
              className="tape absolute -top-1 right-10 h-4 w-14 rotate-6"
            />
            <p className="font-display text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-slate">
              qrbni.dev · Istanbul
            </p>
            <h1 className="mt-5 font-display text-5xl font-bold uppercase leading-[0.95] tracking-[-0.02em] text-ink sm:text-6xl lg:text-7xl">
              {t.name}
            </h1>
            <p
              aria-hidden
              className="redline-mark mt-8 font-display text-xs font-bold uppercase tracking-[0.2em]"
            >
              {locale === "fa" ? "بازبینی / تأیید" : "Reviewed · Partner"}
            </p>
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
          <div className="pin-settle max-w-xl space-y-5" style={{ ["--pin-rot" as string]: "0deg" }}>
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
            <Link className="hover:text-redline" href={`/${locale}/contact#privacy`}>
              {locale === "fa" ? "حریم خصوصی" : "Privacy"}
            </Link>
          </nav>

          {experiences.length > 0 ? (
            <ol className="space-y-3 border-t border-ink/10 pt-8">
              {experiences.slice(0, 4).map((row, i) => (
                <li
                  key={String(row.Id ?? i)}
                  className="pin-sheet relative px-4 py-3"
                  style={{
                    ["--pin-rot" as string]: i % 2 === 0 ? "0.4deg" : "-0.5deg",
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
                      {[row.StartDate, row.EndDate || (row.Current ? t.present : null)]
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
          ) : null}
        </section>
      </main>
    </div>
  );
}
