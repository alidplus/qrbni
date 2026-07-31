import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { serverEnv } from "@/server/env";
import { ContactPin } from "@/ui/templates/ContactPin";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ privacy?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const title = locale === "fa" ? "تماس" : "Contact";
  const description =
    locale === "fa"
      ? "رزرو ۳۰ دقیقه یا ارسال پیام به علی قربانی."
      : "Book 30 minutes or send a message to Ali Ghorbani.";
  return {
    title,
    description,
    alternates: {
      languages: { en: "/en/contact", fa: "/fa/contact" },
      canonical: `/${locale}/contact`,
    },
  };
}

export default async function ContactPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const query = await searchParams;
  const privacyOpen = query.privacy !== undefined;
  const siteKey = serverEnv.turnstileSiteKey();

  return (
    <ContactPin locale={locale} siteKey={siteKey} privacyOpen={privacyOpen} />
  );
}
