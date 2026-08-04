import { locales } from "@/i18n/config";
import { listPublishedPosts } from "@/domains/blog";

const BASE = "https://qrbni.dev";

export const dynamic = "force-dynamic";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/** W3C date (YYYY-MM-DD) — safest lastmod for Google parsers. */
function toLastmod(value?: Date | string | null): string | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function languageLinks(pathSuffix: string): string {
  const suffix = pathSuffix === "/" ? "" : pathSuffix;
  const en = `${BASE}/en${suffix}`;
  const fa = `${BASE}/fa${suffix}`;
  return [
    `<xhtml:link rel="alternate" hreflang="en" href="${escapeXml(en)}" />`,
    `<xhtml:link rel="alternate" hreflang="fa" href="${escapeXml(fa)}" />`,
    `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(en)}" />`,
  ].join("");
}

function urlEntry(input: {
  loc: string;
  lastmod?: string | null;
  linksHtml: string;
}): string {
  const parts = [`<loc>${escapeXml(input.loc)}</loc>`];
  // Schema order: loc → lastmod → xhtml alternates (Next MetadataRoute puts
  // xhtml before lastmod, which fails strict sitemap XSD and can trip GSC).
  if (input.lastmod) {
    parts.push(`<lastmod>${input.lastmod}</lastmod>`);
  }
  parts.push(input.linksHtml);
  return `<url>${parts.join("")}</url>`;
}

export async function GET() {
  const staticPaths = ["", "/services", "/blog", "/contact", "/experience"];
  const entries: string[] = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      const suffix = path || "";
      entries.push(
        urlEntry({
          loc: `${BASE}/${locale}${suffix}`,
          // Omit synthetic "now" lastmod on static routes — Google ignores it.
          lastmod: null,
          linksHtml: languageLinks(suffix || "/"),
        }),
      );
    }
  }

  const byLocale: Record<
    string,
    Awaited<ReturnType<typeof listPublishedPosts>>
  > = { en: [], fa: [] };

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
      const path = `/blog/${post.slug}`;
      const enUrl = enSlugs.has(post.slug)
        ? `${BASE}/en/blog/${post.slug}`
        : undefined;
      const faUrl = faSlugs.has(post.slug)
        ? `${BASE}/fa/blog/${post.slug}`
        : undefined;
      const xDefault = enUrl ?? faUrl ?? `${BASE}/${locale}/blog/${post.slug}`;

      const links = [
        enUrl
          ? `<xhtml:link rel="alternate" hreflang="en" href="${escapeXml(enUrl)}" />`
          : "",
        faUrl
          ? `<xhtml:link rel="alternate" hreflang="fa" href="${escapeXml(faUrl)}" />`
          : "",
        `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(xDefault)}" />`,
      ].join("");

      entries.push(
        urlEntry({
          loc: `${BASE}/${locale}${path}`,
          lastmod: toLastmod(post.publishedAt),
          linksHtml: links,
        }),
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
