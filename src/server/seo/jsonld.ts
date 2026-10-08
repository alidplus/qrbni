import type { Locale } from "@/i18n/config";
import {
  SAME_AS,
  SITE_DESCRIPTION_EN,
  SITE_NAME,
  SITE_URL,
  siteDescription,
} from "@/server/seo/site";

export type JsonLd = Record<string, unknown>;

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function jsonLdScript(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data);
}

export function personJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Ali Ghorbani",
    url: SITE_URL,
    image: `${SITE_URL}/ali-portrait.webp`,
    jobTitle: "Technical Partner",
    description: SITE_DESCRIPTION_EN,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tehran",
      addressCountry: "IR",
    },
    email: "mailto:ali.ghorbani.tr@gmail.com",
    telephone: "+989143252762",
    sameAs: [...SAME_AS],
    knowsAbout: [
      "Web architecture",
      "Full-stack product development",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "NestJS",
      "React",
      "Vue",
      "PostgreSQL",
      "Next.js",
      "Cloudflare",
      "Technical partnership",
      "AI-assisted software engineering",
    ],
  };
}

export function webSiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION_EN,
    inLanguage: ["en", "fa"],
    publisher: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
  };
}

export function profilePageJsonLd(locale: Locale): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/${locale}#profile`,
    url: `${SITE_URL}/${locale}`,
    name: locale === "fa" ? "علی قربانی" : "Ali Ghorbani",
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": PERSON_ID },
    about: { "@id": PERSON_ID },
    inLanguage: locale === "fa" ? "fa" : "en",
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
    provider: { "@id": PERSON_ID },
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
  const url = `${SITE_URL}/${input.locale}/blog/${input.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: input.title,
    description: input.description || undefined,
    url,
    datePublished: input.publishedAt || undefined,
    inLanguage: input.locale === "fa" ? "fa" : "en",
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
    mainEntityOfPage: url,
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
