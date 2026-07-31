import tableIds from "../../scripts/nocodb/.table-ids.json";

export type RevalidateScope = "cv" | "services" | "blog" | "settings" | "all";

const SCOPES: RevalidateScope[] = ["cv", "services", "blog", "settings", "all"];

export function isRevalidateScope(value: string): value is RevalidateScope {
  return (SCOPES as string[]).includes(value);
}

/** Tables that should trigger on-demand revalidation (not ContactMessage). */
export const webhookTableScopes: Record<string, Exclude<RevalidateScope, "all">> = {
  SiteSettings: "settings",
  Profile: "cv",
  ProfileLocale: "cv",
  Experience: "cv",
  ExperienceLocale: "cv",
  ExperienceHighlight: "cv",
  Project: "cv",
  ProjectLocale: "cv",
  Education: "cv",
  EducationLocale: "cv",
  Skill: "cv",
  Language: "cv",
  SocialLink: "cv",
  ServiceCategory: "services",
  ServiceCategoryLocale: "services",
  Service: "services",
  ServiceLocale: "services",
  BlogTag: "blog",
  BlogTagLocale: "blog",
  BlogCategory: "blog",
  BlogCategoryLocale: "blog",
  BlogPost: "blog",
};

const tableIdToName = Object.fromEntries(
  Object.entries(tableIds.tables).map(([name, id]) => [id, name]),
);

export function scopeFromTableId(tableId: string | null | undefined): RevalidateScope | null {
  if (!tableId) return null;
  const name = tableIdToName[tableId];
  if (!name) return null;
  return webhookTableScopes[name] ?? null;
}

export function scopeFromTableName(tableName: string | null | undefined): RevalidateScope | null {
  if (!tableName) return null;
  return webhookTableScopes[tableName] ?? null;
}

export function pathsForScope(scope: RevalidateScope): string[] {
  switch (scope) {
    case "cv":
      return ["/", "/en", "/fa", "/en/experience", "/fa/experience"];
    case "services":
      return ["/", "/en", "/fa", "/en/services", "/fa/services"];
    case "blog":
      return ["/en/blog", "/fa/blog"];
    case "settings":
      return ["/", "/en", "/fa", "/en/services", "/fa/services", "/en/blog", "/fa/blog", "/en/experience", "/fa/experience", "/en/contact", "/fa/contact"];
    case "all":
      return ["/", "/en", "/fa"];
  }
}

export function tagsForScope(scope: RevalidateScope): string[] {
  switch (scope) {
    case "cv":
      return ["cv", "experience"];
    case "services":
      return ["services"];
    case "blog":
      return ["blog"];
    case "settings":
      return ["settings", "cv", "services", "blog", "experience"];
    case "all":
      return ["cv", "services", "blog", "experience", "settings"];
  }
}

export type NocoWebhookBody = {
  type?: string;
  data?: {
    table_id?: string;
    table_name?: string;
  };
  paths?: string[];
  tags?: string[];
  scope?: string;
};
