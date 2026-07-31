import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { listExperienceTimeline } from "@/domains/cv";
import { ExperiencePin } from "@/ui/templates/ExperiencePin";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  return {
    title: locale === "fa" ? "سوابق" : "Experience",
    description:
      locale === "fa"
        ? "سوابق حرفه‌ای علی قربانی."
        : "Professional experience — Ali Ghorbani.",
    alternates: {
      languages: { en: "/en/experience", fa: "/fa/experience" },
      canonical: `/${locale}/experience`,
    },
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

  return <ExperiencePin locale={locale} entries={entries} />;
}
