import {
  configureNocoClient,
  experienceDbTableRowList,
  sitesettingsDbTableRowList,
} from "@/server/nocodb";

/**
 * Domain read helpers — server-only (Hey API SDK).
 */
export async function getSiteSettings() {
  configureNocoClient();
  const { data, error } = await sitesettingsDbTableRowList({
    query: { limit: 1 },
  });
  if (error) throw error;
  return data?.list?.[0] ?? null;
}

export async function listExperiences(limit = 50) {
  configureNocoClient();
  const { data, error } = await experienceDbTableRowList({
    query: { limit, sort: "Sort" },
  });
  if (error) throw error;
  return data?.list ?? [];
}
