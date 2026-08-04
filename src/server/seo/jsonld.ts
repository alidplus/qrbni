import type { Locale } from "@/i18n/config";
import {
  SAME_AS,
  SITE_DESCRIPTION_EN,
  SITE_URL,
  siteDescription,
} from "@/server/seo/site";

export type JsonLd = Record<string, unknown>;

export function jsonLdScript(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data);
}

export function personJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ali Ghorbani",
    url: SITE_URL,
    image: `${SITE_URL}/ali-portrait.webp`,
    jobTitle: "Technical Partner",
    description: SITE_DESCRIPTION_EN,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Istanbul",
      addressCountry: "TR",
    },
    email: "mailto:ali.ghorbani.tr@gmail.com",
    telephone: "+989143252762",
    sameAs: [...SAME_AS],
    knowsAbout: [
      "Web architecture",
      "Full-stack product development",
      "Next.js",
      "React",
      "Node.js",
      "Cloudflare",
      "Technical partnership",
    ],
  };
}

export function professionalServiceJsonLd(input: {
  locale: Locale;
  offerings: Array<{ name: string; description?: string | null }>;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Ali Ghorbani — Technical Partner",
    url: `${SITE_URL}/${input.locale}/services`,
    description: siteDescription(input.locale),
    areaServed: "Worldwide",
    provider: {
      "@type": "Person",
      name: "Ali Ghorbani",
      url: SITE_URL,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: input.locale === "fa" ? "خدمات" : "Services",
      itemListElement: input.offerings.map((o, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: {
          "@type": "Service",
          name: o.name,
          description: o.description || undefined,
        },
      })),
    },
  };
}

export function blogPostingJsonLd(input: {
  locale: Locale;
  title: string;
  description?: string | null;
  slug: string;
  publishedAt?: string | null;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description || undefined,
    url: `${SITE_URL}/${input.locale}/blog/${input.slug}`,
    datePublished: input.publishedAt || undefined,
    inLanguage: input.locale === "fa" ? "fa" : "en",
    author: {
      "@type": "Person",
      name: "Ali Ghorbani",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Ali Ghorbani",
      url: SITE_URL,
    },
    mainEntityOfPage: `${SITE_URL}/${input.locale}/blog/${input.slug}`,
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
