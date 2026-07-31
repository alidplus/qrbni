import Link from "next/link";
import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <Link href={`/${locale}`} className="text-sm text-zinc-500 hover:text-zinc-800">
        ← Home
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">
        {locale === "fa" ? "تماس" : "Contact"}
      </h1>
      <p className="mt-3 text-zinc-600">
        {locale === "fa"
          ? "فرم تماس + Turnstile در مرحله بعد."
          : "Contact form + Turnstile comes next."}
      </p>
      <ul className="mt-6 space-y-2 text-sm text-zinc-700">
        <li>
          <a className="underline" href="mailto:ali.ghorbani.tr@gmail.com">
            ali.ghorbani.tr@gmail.com
          </a>
        </li>
        <li dir="ltr">
          <a className="underline" href="tel:+989143252762">
            +98 914 325 2762
          </a>
        </li>
        <li>
          <a
            className="underline"
            href="https://calendly.com/alighorbani/30min"
            target="_blank"
            rel="noopener noreferrer"
          >
            Calendly · 30 min
          </a>
        </li>
      </ul>
    </main>
  );
}
