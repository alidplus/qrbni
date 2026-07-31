import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { LocaleDocument } from "@/ui/molecules/LocaleDocument";
import { SiteVisitBeacon } from "@/ui/molecules/Telemetry";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <LocaleDocument locale={locale} />
      <SiteVisitBeacon locale={locale} />
      {children}
    </>
  );
}

export type LocaleParams = { locale: Locale };
