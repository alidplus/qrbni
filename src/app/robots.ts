import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { serverEnv } from "@/server/env";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host");
  if (serverEnv.isPreviewHost(host)) {
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
