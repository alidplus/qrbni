import { permanentRedirect } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ locale: string }> };

/** Privacy lives as an expandable section on contact. */
export default async function PrivacyRedirectPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  // Hash is not sent in redirects; open via ?privacy=1 then client scrolls if #privacy used elsewhere.
  permanentRedirect(`/${locale}/contact?privacy=1`);
}
