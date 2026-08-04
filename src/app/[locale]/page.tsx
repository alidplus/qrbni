import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { listExperienceTimeline } from "@/domains/cv";
import {
  breadcrumbJsonLd,
  localeAlternates,
  pageOpenGraph,
  pageTwitter,
  personJsonLd,
  siteDescription,
  siteTitle,
} from "@/server/seo";
import { JsonLdScript } from "@/ui/molecules/JsonLd";
import { HomeSplitPin } from "@/ui/templates/HomeSplitPin";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const title = siteTitle(locale);
  const description = siteDescription(locale);
  const path = `/${locale}`;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: path,
      languages: localeAlternates(""),
    },
    openGraph: pageOpenGraph({ locale, title, description, path }),
    twitter: pageTwitter({ title, description }),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;

  let experiences: Awaited<ReturnType<typeof listExperienceTimeline>> = [];
  try {
    experiences = await listExperienceTimeline(locale, 8);
  } catch {
    experiences = [];
  }

  return (
    <>
      <JsonLdScript
        data={[
          personJsonLd(),
          breadcrumbJsonLd([
            {
              name: locale === "fa" ? "خانه" : "Home",
              path: `/${locale}`,
            },
          ]),
        ]}
      />
      <HomeSplitPin locale={locale} experiences={experiences} />
    </>
  );
}
