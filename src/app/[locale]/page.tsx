import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { listExperienceTimeline } from "@/domains/cv";
import { loadCms } from "@/server/cms";
import {
  breadcrumbJsonLd,
  localeAlternates,
  pageOpenGraph,
  pageTwitter,
  personJsonLd,
  profilePageJsonLd,
  siteDescription,
  siteTitle,
  webSiteJsonLd,
} from "@/server/seo";
import { JsonLdScript } from "@/ui/molecules/JsonLd";
import { HomeSplitPin } from "@/ui/templates/HomeSplitPin";

/** Request-time CMS — avoid build-time NocoDB fan-out / 429 timeouts. */
export const dynamic = "force-dynamic";

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

  const experiences = await loadCms(
    `experience-timeline:${locale}:home`,
    () => listExperienceTimeline(locale, 8),
    [],
  );

  return (
    <>
      <JsonLdScript
        data={[
          personJsonLd(),
          webSiteJsonLd(),
          profilePageJsonLd(locale),
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
