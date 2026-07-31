import { listExperiences } from "@/domains/cv";
import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = { params: Promise<{ locale: string }> };

export default async function ExperienceSmokePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  let rows: Awaited<ReturnType<typeof listExperiences>> = [];
  let err: string | null = null;
  try {
    rows = await listExperiences(10);
  } catch (e) {
    err = e instanceof Error ? e.message : "Failed to load experience";
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <Link href={`/${locale}`} className="text-sm text-zinc-500 hover:text-zinc-800">
        ← Home
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">
        {locale === "fa" ? "سوابق (SDK)" : "Experience (SDK smoke)"}
      </h1>
      {err ? (
        <p className="mt-4 text-sm text-red-600">{err}</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {rows.map((row) => (
            <li key={String(row.Id)} className="border-b border-zinc-200 pb-3">
              <p className="font-medium text-zinc-900">{row.Company}</p>
              <p className="text-sm text-zinc-500">
                {[row.StartDate, row.EndDate || (row.Current ? "present" : null)]
                  .filter(Boolean)
                  .join(" – ")}
                {row.Location ? ` · ${row.Location}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
