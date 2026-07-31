import { unstable_cache } from "next/cache";
import {
  configureNocoClient,
  experienceDbTableRowList,
  experiencehighlightDbTableRowList,
  experiencelocaleDbTableRowList,
  sitesettingsDbTableRowList,
  type ExperienceHighlightResponse,
  type ExperienceLocaleResponse,
  type ExperienceResponse,
} from "@/server/nocodb";
import type { Locale } from "@/i18n/config";

/**
 * Domain read helpers — server-only (Hey API SDK).
 */
export async function getSiteSettings() {
  return unstable_cache(
    async () => {
      configureNocoClient();
      const { data, error } = await sitesettingsDbTableRowList({
        query: { limit: 1 },
      });
      if (error) throw error;
      return data?.list?.[0] ?? null;
    },
    ["site-settings"],
    { tags: ["settings"], revalidate: 3600 },
  )();
}

export async function listExperiences(limit = 50) {
  return unstable_cache(
    async () => {
      configureNocoClient();
      const { data, error } = await experienceDbTableRowList({
        query: { limit, sort: "Sort" },
      });
      if (error) throw error;
      return data?.list ?? [];
    },
    ["experiences", String(limit)],
    { tags: ["cv", "experience"], revalidate: 3600 },
  )();
}

export type ExperienceEntry = {
  id: number;
  company: string;
  companyUrl: string | null;
  website: string | null;
  relatedCompany: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  current: boolean;
  tech: string[];
  title: string | null;
  summary: string | null;
  highlights: string[];
};

function pickLocale<T extends { Locale?: string | null }>(
  rows: T[],
  locale: Locale,
): T | undefined {
  return rows.find((r) => r.Locale === locale) ?? rows.find((r) => r.Locale === "en");
}

function parseTech(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(/[,;]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/** Full experience timeline with locale title/summary/highlights (EN fallback). */
export async function listExperienceTimeline(
  locale: Locale,
  limit = 50,
): Promise<ExperienceEntry[]> {
  return unstable_cache(
    async () => {
      configureNocoClient();

      const [expRes, localeRes, highlightRes] = await Promise.all([
        experienceDbTableRowList({ query: { limit, sort: "Sort" } }),
        experiencelocaleDbTableRowList({ query: { limit: 200 } }),
        experiencehighlightDbTableRowList({ query: { limit: 500, sort: "Sort" } }),
      ]);

      if (expRes.error) throw expRes.error;
      if (localeRes.error) throw localeRes.error;
      if (highlightRes.error) throw highlightRes.error;

      const experiences = (expRes.data?.list ?? []) as ExperienceResponse[];
      const locales = (localeRes.data?.list ?? []) as ExperienceLocaleResponse[];
      const highlights = (highlightRes.data?.list ??
        []) as ExperienceHighlightResponse[];

      return experiences
        .filter((row) => row.Id != null)
        .map((row) => {
          const id = row.Id as number;
          const loc = pickLocale(
            locales.filter((l) => l.ExperienceId === id),
            locale,
          );
          const forRole = highlights.filter((h) => h.ExperienceId === id);
          const preferred = forRole
            .filter((h) => h.Locale === locale)
            .sort((a, b) => (a.Sort ?? 0) - (b.Sort ?? 0));
          const fallback = forRole
            .filter((h) => h.Locale === "en")
            .sort((a, b) => (a.Sort ?? 0) - (b.Sort ?? 0));
          const chosen = preferred.length > 0 ? preferred : fallback;

          return {
            id,
            company: row.Company ?? "—",
            companyUrl: row.CompanyUrl ?? null,
            website: row.Website ?? null,
            relatedCompany: row.RelatedCompany ?? null,
            location: row.Location ?? null,
            startDate: row.StartDate ?? null,
            endDate: row.EndDate ?? null,
            current: Boolean(row.Current),
            tech: parseTech(row.Tech),
            title: loc?.Title ?? null,
            summary: loc?.Summary ?? null,
            highlights: chosen
              .map((h) => h.Body)
              .filter((b): b is string => Boolean(b)),
          } satisfies ExperienceEntry;
        });
    },
    ["experience-timeline", locale, String(limit)],
    { tags: ["cv", "experience"], revalidate: 3600 },
  )();
}
