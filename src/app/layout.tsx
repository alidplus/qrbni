import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from 'next/script'
import { Barlow_Condensed, Source_Sans_3, Vazirmatn } from "next/font/google";
import {
  defaultLocale,
  isLocale,
  localeDirection,
  type Locale,
} from "@/i18n/config";
import "./globals.css";

const faFontVars = {
  "--font-barlow": "var(--font-vazirmatn)",
  "--font-source": "var(--font-vazirmatn)",
} as CSSProperties;

const display = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Source_Sans_3({
  variable: "--font-source",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/** Persian UI + display — https://fonts.google.com/specimen/Vazirmatn */
const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

const siteDescription =
  "I help startups and businesses design, build, and scale reliable web products.";

const siteTitle = "Ali Ghorbani — Technical Partner";

export const metadata: Metadata = {
  metadataBase: new URL("https://qrbni.dev"),
  title: {
    default: siteTitle,
    template: "%s · Ali Ghorbani",
  },
  description: siteDescription,
  applicationName: "qrbni.dev",
  authors: [{ name: "Ali Ghorbani", url: "https://qrbni.dev" }],
  creator: "Ali Ghorbani",
  publisher: "Ali Ghorbani",
  keywords: [
    "Ali Ghorbani",
    "technical partner",
    "full stack",
    "software architecture",
    "Next.js",
    "React",
    "Node.js",
    "Cloudflare",
    "Istanbul",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-icon.png", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-icon-precomposed.png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["fa_IR"],
    url: "https://qrbni.dev",
    siteName: "qrbni.dev",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/ali-portrait.webp",
        width: 1200,
        height: 1168,
        alt: "Pencil portrait of Ali Ghorbani",
        type: "image/webp",
      },
      {
        url: "/android-icon-192x192.png",
        width: 192,
        height: 192,
        alt: "qrbni.dev",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/ali-portrait.webp",
        alt: "Pencil portrait of Ali Ghorbani",
      },
    ],
  },
  other: {
    "msapplication-TileColor": "#F7F4EF",
    "msapplication-TileImage": "/ms-icon-144x144.png",
  },
};

async function resolveLocale(): Promise<Locale> {
  const headerLocale = (await headers()).get("x-locale");
  if (headerLocale && isLocale(headerLocale)) return headerLocale;
  return defaultLocale;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await resolveLocale();
  const dir = localeDirection(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${vazirmatn.variable} h-full antialiased`}
      data-locale={locale}
      style={locale === "fa" ? faFontVars : undefined}
    >
      <body className="min-h-full flex flex-col font-sans">
        {/*
          THESIS: Partnership as rigorous review — the senior who marks the drawing and leaves you clearer; refuse neon résumé swagger and soft card grids.
          OWN-WORLD: Plotter paper, title-block grotesk, masking tape, red grease-pencil marks, stamped ACTION CTA.
          STORY: Visitor meets Ali as a technical partner, scans proof on pinned sheets, books 30 minutes.
          FIRST VIEWPORT: Split pin — tall taped name sheet + reading column with Calendly primary; experience plots below/stack.
          FORM: Redline Pin-up · Split Pin (comp-b) · seed f9889c92 / chosen challenger-pinup.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
        */}
        {children}
      </body>
      <Script src="https://scripts.simpleanalyticscdn.com/latest.js"  />
    </html>
  );
}
