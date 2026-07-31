import {
  blogpostDbTableRowList,
  configureNocoClient,
  type BlogPostResponse,
} from "@/server/nocodb";
import type { Locale } from "@/i18n/config";

export type BlogPostDetail = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  bodyMarkdown: string;
  publishedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

export async function getPublishedPost(
  locale: Locale,
  slug: string,
): Promise<BlogPostDetail | null> {
  configureNocoClient();
  const { data, error } = await blogpostDbTableRowList({
    query: {
      limit: 1,
      where: `(Locale,eq,${locale})~and(Status,eq,published)~and(Slug,eq,${slug})`,
    },
  });
  if (error) throw error;
  const row = (data?.list?.[0] ?? null) as BlogPostResponse | null;
  if (!row?.Id || !row.Slug || !row.Title) return null;
  return {
    id: row.Id,
    slug: row.Slug,
    title: row.Title,
    excerpt: row.Excerpt ?? null,
    bodyMarkdown: row.BodyMarkdown ?? "",
    publishedAt: row.PublishedAt ?? null,
    seoTitle: row.SeoTitle ?? null,
    seoDescription: row.SeoDescription ?? null,
  };
}
