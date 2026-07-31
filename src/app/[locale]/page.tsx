import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { listExperiences } from "@/domains/cv";
import { HomeSplitPin } from "@/ui/templates/HomeSplitPin";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();

  let experiences: Awaited<ReturnType<typeof listExperiences>> = [];
  try {
    experiences = await listExperiences(8);
  } catch {
    experiences = [];
  }

  return <HomeSplitPin locale={raw} experiences={experiences} />;
}
