import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { PrivacyPin } from "@/ui/templates/PrivacyPin";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  return {
    title: locale === "fa" ? "حریم خصوصی" : "Privacy",
    alternates: {
      languages: { en: "/en/privacy", fa: "/fa/privacy" },
      canonical: `/${locale}/privacy`,
    },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <PrivacyPin locale={locale} />;
}
