import { configureNocoClient, listExperience, listSiteSettings } from "@/server/nocodb";

/**
 * Lightweight smoke helpers for domains — not used by routes yet.
 * Safe to call from Server Components / Route Handlers only.
 */
export async function getSiteSettings() {
  configureNocoClient();
  const { data, error } = await listSiteSettings({
    query: { limit: 1 },
  });
  if (error) throw error;
  return data?.list?.[0] ?? null;
}

export async function listExperiences(limit = 50) {
  configureNocoClient();
  const { data, error } = await listExperience({
    query: { limit, sort: "Sort" },
  });
  if (error) throw error;
  return data?.list ?? [];
}
