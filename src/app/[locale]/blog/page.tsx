import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { listPublishedPosts } from "@/domains/blog";
import {
  breadcrumbJsonLd,
  localeAlternates,
  pageOpenGraph,
  pageTwitter,
} from "@/server/seo";
import { JsonLdScript } from "@/ui/molecules/JsonLd";
import { BlogIndexPin } from "@/ui/templates/BlogIndexPin";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const title = locale === "fa" ? "بلاگ" : "Blog";
  const description =
    locale === "fa"
      ? "یادداشت‌های فنی علی قربانی."
      : "Technical notes from Ali Ghorbani.";
  const path = `/${locale}/blog`;
  return {
    title,
    description,
    alternates: {
      languages: localeAlternates("/blog"),
      canonical: path,
    },
    openGraph: pageOpenGraph({ locale, title, description, path }),
    twitter: pageTwitter({ title, description }),
  };
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  let posts: Awaited<ReturnType<typeof listPublishedPosts>> = [];
  try {
    posts = await listPublishedPosts(locale);
  } catch {
    posts = [];
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
            name: locale === "fa" ? "بلاگ" : "Blog",
            path: `/${locale}/blog`,
          },
        ])}
      />
      <BlogIndexPin locale={locale} posts={posts} />
    </>
  );
}
