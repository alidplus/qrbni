import type { MetadataRoute } from "next";
import { isIndexingEnabled } from "@/server/seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const indexing = await isIndexingEnabled();

  if (!indexing) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://qrbni.dev/sitemap.xml",
  };
}
