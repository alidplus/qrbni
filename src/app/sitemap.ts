import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { listPublishedPosts } from "@/domains/blog";

const BASE = "https://qrbni.dev";

function languageAlternates(path: string): Record<string, string> {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  const en = `${BASE}/en${suffix === "/" ? "" : suffix}`;
  const fa = `${BASE}/fa${suffix === "/" ? "" : suffix}`;
  return {
    en,
    fa,
    "x-default": en,
  };
}

function entry(
  locale: string,
  path: string,
  lastModified?: Date | string | null,
  languages?: Record<string, string>,
): MetadataRoute.Sitemap[number] {
  const suffix = path === "" ? "" : path.startsWith("/") ? path : `/${path}`;
  const loc = `${BASE}/${locale}${suffix}`;
  const mod =
    lastModified instanceof Date
      ? lastModified
      : lastModified
        ? new Date(lastModified)
        : new Date();

  return {
    url: loc,
    lastModified: Number.isNaN(mod.getTime()) ? new Date() : mod,
    alternates: {
      languages: languages ?? languageAlternates(suffix || "/"),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["", "/services", "/blog", "/contact", "/experience"];

  const staticEntries = locales.flatMap((locale) =>
    staticPaths.map((path) => entry(locale, path)),
  );

  const postEntries: MetadataRoute.Sitemap = [];
  const byLocale: Record<string, Awaited<ReturnType<typeof listPublishedPosts>>> =
    { en: [], fa: [] };

  for (const locale of locales) {
    try {
      byLocale[locale] = await listPublishedPosts(locale);
    } catch {
      byLocale[locale] = [];
    }
  }

  const enSlugs = new Set(byLocale.en.map((p) => p.slug));
  const faSlugs = new Set(byLocale.fa.map((p) => p.slug));

  for (const locale of locales) {
    for (const post of byLocale[locale]) {
      const enUrl = enSlugs.has(post.slug)
        ? `${BASE}/en/blog/${post.slug}`
        : undefined;
      const faUrl = faSlugs.has(post.slug)
        ? `${BASE}/fa/blog/${post.slug}`
        : undefined;
      const languages: Record<string, string> = {
        "x-default": enUrl ?? faUrl ?? `${BASE}/${locale}/blog/${post.slug}`,
      };
      if (enUrl) languages.en = enUrl;
      if (faUrl) languages.fa = faUrl;

      postEntries.push(
        entry(
          locale,
          `/blog/${post.slug}`,
          post.publishedAt,
          languages,
        ),
      );
    }
  }

  return [...staticEntries, ...postEntries];
}
