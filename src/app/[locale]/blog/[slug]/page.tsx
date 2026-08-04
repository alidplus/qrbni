import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getPublishedPost } from "@/domains/blog/post";
import {
  blogPostingJsonLd,
  breadcrumbJsonLd,
  pageOpenGraph,
  pageTwitter,
} from "@/server/seo";
import { JsonLdScript } from "@/ui/molecules/JsonLd";
import { BlogPostPin } from "@/ui/templates/BlogPostPin";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const locale: Locale = raw;
  try {
    const post = await getPublishedPost(locale, slug);
    if (!post) return { title: locale === "fa" ? "پست" : "Post" };

    const title = post.seoTitle || post.title;
    const description = post.seoDescription || post.excerpt || undefined;
    const path = `/${locale}/blog/${post.slug}`;

    const otherLocale: Locale = locale === "fa" ? "en" : "fa";
    let twinSlug: string | null = null;
    try {
      const twin = await getPublishedPost(otherLocale, slug);
      if (twin) twinSlug = twin.slug;
    } catch {
      twinSlug = null;
    }

    const languages: Record<string, string> = {
      [locale]: path,
      "x-default":
        locale === "en" ? path : twinSlug ? `/en/blog/${twinSlug}` : path,
    };
    if (twinSlug) {
      languages[otherLocale] = `/${otherLocale}/blog/${twinSlug}`;
    }

    return {
      title,
      description,
      alternates: {
        canonical: path,
        languages,
      },
      openGraph: {
        ...pageOpenGraph({
          locale,
          title,
          description: description ?? "",
          path,
        }),
        type: "article",
        publishedTime: post.publishedAt ?? undefined,
      },
      twitter: pageTwitter({
        title,
        description: description ?? "",
      }),
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  let post = null;
  try {
    post = await getPublishedPost(locale, slug);
  } catch {
    notFound();
  }
  if (!post) notFound();

  return (
    <>
      <JsonLdScript
        data={[
          blogPostingJsonLd({
            locale,
            title: post.seoTitle || post.title,
            description: post.seoDescription || post.excerpt,
            slug: post.slug,
            publishedAt: post.publishedAt,
          }),
          breadcrumbJsonLd([
            {
              name: locale === "fa" ? "خانه" : "Home",
              path: `/${locale}`,
            },
            {
              name: locale === "fa" ? "بلاگ" : "Blog",
              path: `/${locale}/blog`,
            },
            {
              name: post.title,
              path: `/${locale}/blog/${post.slug}`,
            },
          ]),
        ]}
      />
      <BlogPostPin locale={locale} post={post} />
    </>
  );
}
