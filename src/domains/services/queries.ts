import { unstable_cache } from "next/cache";
import {
  configureNocoClient,
  serviceDbTableRowList,
  servicecategoryDbTableRowList,
  servicecategorylocaleDbTableRowList,
  servicelocaleDbTableRowList,
  type ServiceCategoryLocaleResponse,
  type ServiceCategoryResponse,
  type ServiceLocaleResponse,
  type ServiceResponse,
} from "@/server/nocodb";
import type { Locale } from "@/i18n/config";

export type ServiceOffering = {
  id: number;
  key: string;
  sort: number;
  ctaType: "contact" | "calendly" | "both";
  title: string;
  summary: string | null;
  bullets: string[];
};

export type ServiceCategoryGroup = {
  id: number;
  key: string;
  sort: number;
  title: string;
  description: string | null;
  services: ServiceOffering[];
};

function pickLocale<T extends { Locale?: string | null }>(
  rows: T[],
  locale: Locale,
): T | undefined {
  return rows.find((r) => r.Locale === locale) ?? rows.find((r) => r.Locale === "en");
}

function parseBullets(markdown: string | null | undefined): string[] {
  if (!markdown) return [];
  return markdown
    .split("\n")
    .map((line) => line.replace(/^\s*[-*]\s+/, "").trim())
    .filter(Boolean);
}

function normalizeCta(value: string | null | undefined): ServiceOffering["ctaType"] {
  if (value === "contact" || value === "calendly") return value;
  return "both";
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Active services grouped by category, with EN fallback for missing FA copy. */
export async function listServiceCatalog(locale: Locale): Promise<ServiceCategoryGroup[]> {
  return unstable_cache(
    async () => {
      configureNocoClient();

      // Fully sequential — Worker egress IPs hit NocoDB 429 hard under Promise.all.
      const categoriesRes = await servicecategoryDbTableRowList({
        query: { limit: 100, sort: "Sort", where: "(Active,checked)" },
      });
      if (categoriesRes.error) throw categoriesRes.error;
      await sleep(200);

      const categoryLocalesRes = await servicecategorylocaleDbTableRowList({
        query: { limit: 200 },
      });
      if (categoryLocalesRes.error) throw categoryLocalesRes.error;
      await sleep(200);

      const servicesRes = await serviceDbTableRowList({
        query: { limit: 200, sort: "Sort", where: "(Active,checked)" },
      });
      if (servicesRes.error) throw servicesRes.error;
      await sleep(200);

      const serviceLocalesRes = await servicelocaleDbTableRowList({
        query: { limit: 500 },
      });
      if (serviceLocalesRes.error) throw serviceLocalesRes.error;

      const categories = (categoriesRes.data?.list ?? []) as ServiceCategoryResponse[];
      const categoryLocales = (categoryLocalesRes.data?.list ??
        []) as ServiceCategoryLocaleResponse[];
      const services = (servicesRes.data?.list ?? []) as ServiceResponse[];
      const serviceLocales = (serviceLocalesRes.data?.list ??
        []) as ServiceLocaleResponse[];

      // Never poison the Data Cache with an empty catalog (429 soft-empty / partial).
      if (categories.length === 0) {
        throw new Error("[services] empty category list — not caching");
      }

      const groups = categories
        .map((cat) => {
          const catId = cat.Id;
          if (catId == null) return null;
          const catLocale = pickLocale(
            categoryLocales.filter((l) => l.CategoryId === catId),
            locale,
          );
          const offerings = services
            .filter((s) => s.CategoryId === catId && s.Id != null)
            .map((svc) => {
              const loc = pickLocale(
                serviceLocales.filter((l) => l.ServiceId === svc.Id),
                locale,
              );
              return {
                id: svc.Id as number,
                key: svc.Key ?? String(svc.Id),
                sort: svc.Sort ?? 0,
                ctaType: normalizeCta(svc.CtaType),
                title: loc?.Title ?? svc.Key ?? "Service",
                summary: loc?.Summary ?? null,
                bullets: parseBullets(loc?.BulletsMarkdown),
              } satisfies ServiceOffering;
            })
            .sort((a, b) => a.sort - b.sort);

          return {
            id: catId,
            key: cat.Key ?? String(catId),
            sort: cat.Sort ?? 0,
            title: catLocale?.Title ?? cat.Key ?? "Services",
            description: catLocale?.Description ?? null,
            services: offerings,
          } satisfies ServiceCategoryGroup;
        })
        .filter((g): g is ServiceCategoryGroup => Boolean(g))
        .sort((a, b) => a.sort - b.sort);

      if (groups.length === 0) {
        throw new Error("[services] empty catalog after join — not caching");
      }

      return groups;
    },
    ["service-catalog", locale],
    { tags: ["services"], revalidate: 900 },
  )();
}
