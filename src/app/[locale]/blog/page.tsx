import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { listPublishedPosts } from "@/domains/blog";
import { BlogIndexPin } from "@/ui/templates/BlogIndexPin";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  return {
    title: locale === "fa" ? "بلاگ" : "Blog",
    description:
      locale === "fa"
        ? "یادداشت‌های فنی علی قربانی."
        : "Technical notes from Ali Ghorbani.",
    alternates: {
      languages: { en: "/en/blog", fa: "/fa/blog" },
      canonical: `/${locale}/blog`,
    },
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

  return <BlogIndexPin locale={locale} posts={posts} />;
}
