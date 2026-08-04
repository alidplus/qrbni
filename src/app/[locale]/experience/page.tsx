import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { listExperienceTimeline } from "@/domains/cv";
import {
  breadcrumbJsonLd,
  localeAlternates,
  pageOpenGraph,
  pageTwitter,
} from "@/server/seo";
import { JsonLdScript } from "@/ui/molecules/JsonLd";
import { ExperiencePin } from "@/ui/templates/ExperiencePin";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const title = locale === "fa" ? "سوابق" : "Experience";
  const description =
    locale === "fa"
      ? "سوابق حرفه‌ای علی قربانی."
      : "Professional experience — Ali Ghorbani.";
  const path = `/${locale}/experience`;
  return {
    title,
    description,
    alternates: {
      languages: localeAlternates("/experience"),
      canonical: path,
    },
    openGraph: pageOpenGraph({ locale, title, description, path }),
    twitter: pageTwitter({ title, description }),
  };
}

export default async function ExperiencePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  let entries: Awaited<ReturnType<typeof listExperienceTimeline>> = [];
  try {
    entries = await listExperienceTimeline(locale);
  } catch {
    entries = [];
  }

  return (
    <>
      <JsonLdScript
        data={breadcrumbJsonLd([
          {
            name: locale === "fa" ? "خانه" : "Home",
            path: `/${locale}`,
          },
          {
            name: locale === "fa" ? "سوابق" : "Experience",
            path: `/${locale}/experience`,
          },
        ])}
      />
      <ExperiencePin locale={locale} entries={entries} />
    </>
  );
}
