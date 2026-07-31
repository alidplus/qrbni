import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { listServiceCatalog } from "@/domains/services";
import { ServicesPin } from "@/ui/templates/ServicesPin";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  return {
    title: locale === "fa" ? "خدمات" : "Services",
    description:
      locale === "fa"
        ? "خدمات توسعه محصول، معماری و شراکت فنی علی قربانی."
        : "Product development, architecture, and technical partnership with Ali Ghorbani.",
    alternates: {
      languages: { en: "/en/services", fa: "/fa/services" },
      canonical: `/${locale}/services`,
    },
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

  return <ServicesPin locale={locale} catalog={catalog} />;
}
