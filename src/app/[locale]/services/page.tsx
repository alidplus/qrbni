import Link from "next/link";
import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ locale: string }> };

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <Link href={`/${locale}`} className="text-sm text-zinc-500 hover:text-zinc-800">
        ← Home
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">
        {locale === "fa" ? "خدمات" : "Services"}
      </h1>
      <p className="mt-3 text-zinc-600">
        {locale === "fa"
          ? "فهرست خدمات به‌زودی از NocoDB بارگذاری می‌شود."
          : "Service list will load from NocoDB next."}
      </p>
    </main>
  );
}
