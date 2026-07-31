import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import {
  defaultLocale,
  isLocale,
  localeDirection,
  type Locale,
} from "@/i18n/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
