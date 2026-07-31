import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import {
  Crosshair,
  FigLabel,
  PinSheet,
  PinWall,
  RedlineEm,
  TitleBlockMeta,
} from "@/ui/atoms";
import { BookCta, SiteHeader } from "@/ui/organisms/SiteHeader";
import { ContactForm } from "@/ui/organisms/ContactForm";
import { PrivacyDisclosure } from "@/ui/molecules/PrivacyDisclosure";

type Copy = {
  title: string;
  support: ReactNode;
  channels: string;
  channelsFig: string;
  formTitle: string;
  formFig: string;
  formHint: string;
  email: string;
  phone: string;
  place: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    title: "Contact",
    support: (
      <>
        Prefer a live review? <RedlineEm>Book 30 minutes</RedlineEm>. For async
        notes, leave a message — it lands in my inbox, not a ticket queue.
      </>
    ),
    channels: "Direct",
    channelsFig: "Fig. 01 · Channels",
    formTitle: "Message",
    formFig: "Fig. 02 · Message pin",
    formHint: "Async fallback — Calendly stays primary.",
    email: "Email",
    phone: "Phone",
    place: "Istanbul",
  },
  fa: {
    title: "تماس",
    support: (
      <>
        برای گفتگوی زنده <RedlineEm>۳۰ دقیقه رزرو کنید</RedlineEm>. برای پیام
        غیرهم‌زمان همین‌جا بنویسید — مستقیم به صندوق من می‌رسد، نه صف تیکت.
      </>
    ),
    channels: "ارتباط مستقیم",
    channelsFig: "شکل ۰۱ · کانال‌ها",
    formTitle: "پیام",
    formFig: "شکل ۰۲ · پین پیام",
    formHint: "مسیر غیرهم‌زمان — رزرو تقویم اولویت دارد.",
    email: "ایمیل",
    phone: "تلفن",
    place: "استانبول",
  },
};

type Props = {
  locale: Locale;
  siteKey: string;
  privacyOpen?: boolean;
};

export function ContactPin({ locale, siteKey, privacyOpen = false }: Props) {
  const t = copy[locale];

  return (
    <PinWall>
      <SiteHeader locale={locale} />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-5 py-12 sm:px-8 lg:grid lg:max-w-6xl lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-14 lg:py-16">
        <section className="flex flex-col gap-8">
          <div>
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
            <p className="mt-5 max-w-prose text-base leading-relaxed text-slate sm:text-lg">
              {t.support}
            </p>
            <div className="mt-8">
              <BookCta locale={locale} />
            </div>
          </div>

          <PinSheet
            className="px-6 py-7 sm:px-8"
            rotate={-0.55}
            tapes="strip"
            pins
            registration={false}
            insetRule={false}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <FigLabel>{t.channelsFig}</FigLabel>
              <Crosshair className="shrink-0 text-redline/45" size={12} />
            </div>
            <h2 className="font-display text-lg font-semibold uppercase tracking-[0.08em] text-ink">
              {t.channels}
            </h2>
            <ul className="mt-5 space-y-3.5 text-base text-ink">
              <li>
                <span className="me-2 font-display text-xs font-semibold uppercase tracking-[0.12em] text-slate">
                  {t.email}
                </span>
                <a
                  className="underline decoration-redline/40 underline-offset-4 hover:decoration-redline"
                  href="mailto:ali.ghorbani.tr@gmail.com"
                >
                  ali.ghorbani.tr@gmail.com
                </a>
              </li>
              <li>
                <span className="me-2 font-display text-xs font-semibold uppercase tracking-[0.12em] text-slate">
                  {t.phone}
                </span>
                <a
                  className="underline decoration-redline/40 underline-offset-4 hover:decoration-redline"
                  href="tel:+989143252762"
                  dir="ltr"
                >
                  +98 914 325 2762
                </a>
              </li>
              <li className="text-slate">{t.place}</li>
            </ul>
            <TitleBlockMeta
              className="mt-6"
              rows={[
                { label: locale === "fa" ? "روش" : "Mode", value: "Direct" },
                { label: locale === "fa" ? "مکان" : "Site", value: "Istanbul" },
              ]}
            />
          </PinSheet>
        </section>

        <section
          aria-label={t.formTitle}
          className="flex items-start justify-center lg:justify-end lg:pt-2"
        >
          <PinSheet
            className="w-full max-w-lg px-7 py-9 sm:px-10 sm:py-11"
            rotate={0.65}
            tapes="top"
            pins
            registration
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <FigLabel>{t.formFig}</FigLabel>
              <Crosshair className="shrink-0 text-redline/50" size={14} />
            </div>
            <h2 className="font-display text-2xl font-semibold uppercase tracking-[-0.02em] text-ink">
              {t.formTitle}
            </h2>
            <p className="mt-2 max-w-prose text-base leading-relaxed text-slate">
              {t.formHint}
            </p>
            <div className="mt-8">
              <ContactForm locale={locale} siteKey={siteKey} />
            </div>
            <div className="mt-8">
              <PrivacyDisclosure locale={locale} defaultOpen={privacyOpen} />
            </div>
            <TitleBlockMeta
              className="mt-8"
              rows={[
                {
                  label: locale === "fa" ? "روش" : "Method",
                  value: locale === "fa" ? "غیرهم‌زمان" : "Async",
                },
                { label: locale === "fa" ? "سایت" : "Site", value: "qrbni.dev" },
              ]}
            />
          </PinSheet>
        </section>
      </main>
    </PinWall>
  );
}
