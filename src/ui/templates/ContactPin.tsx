import type { Locale } from "@/i18n/config";
import { BookCta, SiteHeader } from "@/ui/organisms/SiteHeader";
import { ContactForm } from "@/ui/organisms/ContactForm";
import { PrivacyDisclosure } from "@/ui/molecules/PrivacyDisclosure";

type Copy = {
  title: string;
  support: string;
  channels: string;
  formTitle: string;
  email: string;
  phone: string;
  place: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    title: "Contact",
    support:
      "Prefer a live review? Book 30 minutes. For async notes, leave a message — it lands in my inbox, not a ticket queue.",
    channels: "Direct",
    formTitle: "Message",
    email: "Email",
    phone: "Phone",
    place: "Istanbul",
  },
  fa: {
    title: "تماس",
    support:
      "برای گفتگوی زنده ۳۰ دقیقه رزرو کنید. برای پیام غیرهم‌زمان همین‌جا بنویسید — مستقیم به صندوق من می‌رسد، نه صف تیکت.",
    channels: "ارتباط مستقیم",
    formTitle: "پیام",
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
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader locale={locale} />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-5 py-12 sm:px-8 lg:grid lg:max-w-6xl lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 lg:py-16">
        <section className="flex flex-col justify-center">
          <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-ink uppercase sm:text-5xl">
            {t.title}
          </h1>
          <p className="mt-5 max-w-prose text-base leading-relaxed text-slate sm:text-lg">
            {t.support}
          </p>
          <div className="mt-8">
            <BookCta locale={locale} />
          </div>

          <div className="mt-12 space-y-5 border-t border-ink/10 pt-8">
            <p className="font-display text-xs font-semibold tracking-[0.16em] text-slate uppercase">
              {t.channels}
            </p>
            <ul className="space-y-3 text-base text-ink">
              <li>
                <span className="me-2 font-display text-xs font-semibold tracking-[0.12em] text-slate uppercase">
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
                <span className="me-2 font-display text-xs font-semibold tracking-[0.12em] text-slate uppercase">
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
          </div>
        </section>

        <section
          aria-label={t.formTitle}
          className="flex items-start justify-center lg:justify-end"
        >
          <div
            className="pin-sheet pin-settle relative w-full max-w-lg px-7 py-10 sm:px-10 sm:py-12"
            style={{ ["--pin-rot" as string]: "0.6deg" }}
          >
            <span
              aria-hidden
              className="tape absolute -top-2 start-8 h-4 w-16 -rotate-2"
            />
            <span
              aria-hidden
              className="tape absolute -top-1 end-10 h-4 w-14 rotate-5"
            />
            <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink uppercase">
              {t.formTitle}
            </h2>
            <p
              aria-hidden
              className="redline-mark mt-2 font-display text-xs font-bold tracking-[0.2em] uppercase"
            >
              ACTION
            </p>
            <div className="mt-8">
              <ContactForm locale={locale} siteKey={siteKey} />
            </div>
            <div className="mt-8">
              <PrivacyDisclosure locale={locale} defaultOpen={privacyOpen} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
