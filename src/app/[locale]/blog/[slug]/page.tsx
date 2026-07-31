import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getPublishedPost } from "@/domains/blog/post";
import { BlogPostPin } from "@/ui/templates/BlogPostPin";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const locale: Locale = raw;
  try {
    const post = await getPublishedPost(locale, slug);
    if (!post) return { title: locale === "fa" ? "پست" : "Post" };
    return {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || undefined,
      alternates: { canonical: `/${locale}/blog/${post.slug}` },
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

  return <BlogPostPin locale={locale} post={post} />;
}
