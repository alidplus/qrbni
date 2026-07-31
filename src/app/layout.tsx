import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://qrbni.dev"),
  title: {
    default: "Ali Ghorbani",
    template: "%s · Ali Ghorbani",
  },
  description:
    "I help startups and businesses design, build, and scale reliable web products.",
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
    </html>
  );
}
