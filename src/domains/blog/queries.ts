import { unstable_cache } from "next/cache";
import {
  blogpostDbTableRowList,
  configureNocoClient,
  type BlogPostResponse,
} from "@/server/nocodb";
import type { Locale } from "@/i18n/config";

export type BlogListItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
};

/** Published posts for a locale (no EN fallback — posts are locale-specific). */
export async function listPublishedPosts(locale: Locale): Promise<BlogListItem[]> {
  return unstable_cache(
    async () => {
      configureNocoClient();
      const { data, error } = await blogpostDbTableRowList({
        query: {
          limit: 100,
          sort: "-PublishedAt",
          where: `(Locale,eq,${locale})~and(Status,eq,published)`,
        },
      });
      if (error) throw error;

      const list = (data?.list ?? []) as BlogPostResponse[];
      return list
        .filter((row) => row.Id != null && row.Slug && row.Title)
        .map((row) => ({
          id: row.Id as number,
          slug: row.Slug as string,
          title: row.Title as string,
          excerpt: row.Excerpt ?? null,
          publishedAt: row.PublishedAt ?? null,
        }));
    },
    ["blog-list", locale],
    { tags: ["blog"], revalidate: 3600 },
  )();
}
