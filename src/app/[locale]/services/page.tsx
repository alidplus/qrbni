import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { listServiceCatalog } from "@/domains/services";
import {
  breadcrumbJsonLd,
  localeAlternates,
  pageOpenGraph,
  pageTwitter,
  professionalServiceJsonLd,
} from "@/server/seo";
import { JsonLdScript } from "@/ui/molecules/JsonLd";
import { ServicesPin } from "@/ui/templates/ServicesPin";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const title = locale === "fa" ? "خدمات" : "Services";
  const description =
    locale === "fa"
      ? "خدمات توسعه محصول، معماری و شراکت فنی علی قربانی."
      : "Product development, architecture, and technical partnership with Ali Ghorbani.";
  const path = `/${locale}/services`;
  return {
    title,
    description,
    alternates: {
      languages: localeAlternates("/services"),
      canonical: path,
    },
    openGraph: pageOpenGraph({ locale, title, description, path }),
    twitter: pageTwitter({ title, description }),
  };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  let catalog: Awaited<ReturnType<typeof listServiceCatalog>> = [];
  try {
    catalog = await listServiceCatalog(locale);
  } catch {
    catalog = [];
  }

  const offerings = catalog.flatMap((group) =>
    group.services.map((s) => ({
      name: s.title,
      description: s.summary,
    })),
  );

  return (
    <>
      <JsonLdScript
        data={[
          professionalServiceJsonLd({ locale, offerings }),
          breadcrumbJsonLd([
            {
              name: locale === "fa" ? "خانه" : "Home",
              path: `/${locale}`,
            },
            {
              name: locale === "fa" ? "خدمات" : "Services",
              path: `/${locale}/services`,
            },
          ]),
        ]}
      />
      <ServicesPin locale={locale} catalog={catalog} />
    </>
  );
}
