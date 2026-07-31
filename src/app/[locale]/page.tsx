import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

const copy: Record<
  Locale,
  { headline: string; sub: string; ctaServices: string; ctaBlog: string; ctaContact: string }
> = {
  en: {
    headline: "Ali Ghorbani",
    sub: "I help startups and businesses design, build, and scale reliable web products.",
    ctaServices: "Services",
    ctaBlog: "Blog",
    ctaContact: "Contact",
  },
  fa: {
    headline: "علی قربانی",
    sub: "به استارتاپ‌ها و کسب‌وکارها کمک می‌کنم محصولات وب قابل‌اعتماد طراحی، پیاده‌سازی و مقیاس‌پذیر کنند.",
    ctaServices: "خدمات",
    ctaBlog: "بلاگ",
    ctaContact: "تماس",
  },
};

export default async function HomePage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const t = copy[locale];

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-8 px-6 py-24">
      <div className="flex gap-3 text-sm text-zinc-500">
        <Link href="/en" className={locale === "en" ? "text-zinc-900" : ""}>
          EN
        </Link>
        <span aria-hidden>/</span>
        <Link href="/fa" className={locale === "fa" ? "text-zinc-900" : ""}>
          FA
        </Link>
      </div>
      <div className="space-y-4">
        <p className="text-sm tracking-wide text-zinc-500">qrbni.dev</p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          {t.headline}
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-zinc-600">{t.sub}</p>
      </div>
      <nav className="flex flex-wrap gap-4 text-sm font-medium">
        <Link className="underline-offset-4 hover:underline" href={`/${locale}/services`}>
          {t.ctaServices}
        </Link>
        <Link className="underline-offset-4 hover:underline" href={`/${locale}/blog`}>
          {t.ctaBlog}
        </Link>
        <Link className="underline-offset-4 hover:underline" href={`/${locale}/contact`}>
          {t.ctaContact}
        </Link>
      </nav>
      <p className="text-xs text-zinc-400">
        Scaffold spine · content from NocoDB next · design via Impeccable
      </p>
    </main>
  );
}
