/**
 * Bootstrap NocoDB schema for qrbni.dev (Meta API v2).
 * Usage: node --env-file=.env.local scripts/nocodb/bootstrap-schema.mjs
 *
 * Relations use Number parent_id FKs (API-stable). Links can be added later in UI.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const BASE_ID = "p4cutoefjsz0z2t";
const BASE_URL = (process.env.NOCODB_BASE_URL || "https://app.nocodb.com").replace(
  /\/$/,
  "",
);
const TOKEN = process.env.NOCODB_API_TOKEN;

if (!TOKEN) {
  console.error("NOCODB_API_TOKEN missing");
  process.exit(1);
}

const statePath = path.join(ROOT, "scripts/nocodb/.table-ids.json");

function col(title, uidt, extra = {}) {
  return {
    title,
    column_name: title,
    uidt,
    ...extra,
  };
}

function idCols() {
  return [
    col("Id", "ID", { pk: true, ai: true, rqd: true }),
    col("CreatedAt", "DateTime"),
    col("UpdatedAt", "DateTime"),
  ];
}

async function api(method, pathname, body) {
  const res = await fetch(`${BASE_URL}${pathname}`, {
    method,
    headers: {
      "xc-token": TOKEN,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    throw new Error(
      `${method} ${pathname} → ${res.status}: ${typeof data === "string" ? data : JSON.stringify(data)}`,
    );
  }
  return data;
}

async function listTables() {
  const data = await api("GET", `/api/v2/meta/bases/${BASE_ID}/tables`);
  return data.list || [];
}

async function createTable(title, columns) {
  const existing = (await listTables()).find(
    (t) => t.title === title || t.table_name === title,
  );
  if (existing) {
    console.log(`= exists ${title} (${existing.id})`);
    return existing;
  }

  const payload = {
    table_name: title,
    title,
    columns: [...idCols(), ...columns],
  };
  const created = await api(
    "POST",
    `/api/v2/meta/bases/${BASE_ID}/tables`,
    payload,
  );
  console.log(`+ created ${title} (${created.id})`);
  return created;
}

const localeSelect = {
  uidt: "SingleSelect",
  dtxp: "'en','fa'",
};

const tables = [
  {
    title: "SiteSettings",
    columns: [
      col("Key", "SingleLineText"),
      col("show_blog", "Checkbox"),
      col("show_services", "Checkbox"),
      col("show_projects", "Checkbox"),
      col("show_experience", "Checkbox"),
      col("show_contact_form", "Checkbox"),
      col("fa_locale_enabled", "Checkbox"),
      col("maintenance_mode", "Checkbox"),
      col("indexing_enabled", "Checkbox"),
      col("show_hireable", "Checkbox"),
      col("show_day_rate", "Checkbox"),
      col("day_rate_amount", "Number"),
      col("day_rate_currency", "SingleLineText"),
      col("default_og_image", "URL"),
      col("calendly_url", "URL"),
      col("public_email", "Email"),
      col("public_phone", "PhoneNumber"),
      col("public_location", "SingleLineText"),
      col("maintenance_message_en", "LongText"),
      col("maintenance_message_fa", "LongText"),
    ],
  },
  {
    title: "Profile",
    columns: [
      col("Name", "SingleLineText"),
      col("Slug", "SingleLineText"),
      col("AvatarUrl", "URL"),
      col("GitHub", "URL"),
      col("LinkedIn", "URL"),
      col("Twine", "URL"),
      col("Hireable", "Checkbox"),
      col("TotalExperience", "SingleLineText"),
    ],
  },
  {
    title: "ProfileLocale",
    columns: [
      col("ProfileId", "Number"),
      col("Locale", "SingleSelect", localeSelect),
      col("Headline", "SingleLineText"),
      col("Summary", "LongText"),
      col("Label", "LongText"),
    ],
  },
  {
    title: "Experience",
    columns: [
      col("Company", "SingleLineText"),
      col("CompanyUrl", "URL"),
      col("Website", "URL"),
      col("RelatedCompany", "SingleLineText"),
      col("Location", "SingleLineText"),
      col("StartDate", "SingleLineText"),
      col("EndDate", "SingleLineText"),
      col("Current", "Checkbox"),
      col("Sort", "Number"),
      col("Tech", "LongText"),
      col("DateNotes", "LongText"),
    ],
  },
  {
    title: "ExperienceLocale",
    columns: [
      col("ExperienceId", "Number"),
      col("Locale", "SingleSelect", localeSelect),
      col("Title", "SingleLineText"),
      col("Summary", "LongText"),
    ],
  },
  {
    title: "ExperienceHighlight",
    columns: [
      col("ExperienceId", "Number"),
      col("Locale", "SingleSelect", localeSelect),
      col("Body", "LongText"),
      col("Sort", "Number"),
    ],
  },
  {
    title: "Project",
    columns: [
      col("Name", "SingleLineText"),
      col("Role", "SingleLineText"),
      col("Company", "SingleLineText"),
      col("StartDate", "SingleLineText"),
      col("EndDate", "SingleLineText"),
      col("Current", "Checkbox"),
      col("Sort", "Number"),
      col("Tech", "LongText"),
      col("RelatedPosts", "LongText"),
    ],
  },
  {
    title: "ProjectLocale",
    columns: [
      col("ProjectId", "Number"),
      col("Locale", "SingleSelect", localeSelect),
      col("Summary", "LongText"),
    ],
  },
  {
    title: "Education",
    columns: [
      col("Institution", "SingleLineText"),
      col("InstitutionUrl", "URL"),
      col("StartDate", "SingleLineText"),
      col("EndDate", "SingleLineText"),
      col("Location", "SingleLineText"),
      col("Sort", "Number"),
    ],
  },
  {
    title: "EducationLocale",
    columns: [
      col("EducationId", "Number"),
      col("Locale", "SingleSelect", localeSelect),
      col("Degree", "SingleLineText"),
      col("Field", "SingleLineText"),
    ],
  },
  {
    title: "Skill",
    columns: [
      col("Name", "SingleLineText"),
      col("Level", "Number"),
      col("Group", "SingleSelect", {
        uidt: "SingleSelect",
        dtxp: "'primary','also_used'",
      }),
      col("Sort", "Number"),
    ],
  },
  {
    title: "Language",
    columns: [
      col("Name", "SingleLineText"),
      col("Proficiency", "SingleLineText"),
      col("Level", "Number"),
      col("Sort", "Number"),
    ],
  },
  {
    title: "SocialLink",
    columns: [
      col("Label", "SingleLineText"),
      col("Url", "URL"),
      col("Sort", "Number"),
    ],
  },
  {
    title: "ServiceCategory",
    columns: [col("Key", "SingleLineText"), col("Sort", "Number"), col("Active", "Checkbox")],
  },
  {
    title: "ServiceCategoryLocale",
    columns: [
      col("CategoryId", "Number"),
      col("Locale", "SingleSelect", localeSelect),
      col("Title", "SingleLineText"),
      col("Description", "LongText"),
    ],
  },
  {
    title: "Service",
    columns: [
      col("CategoryId", "Number"),
      col("Key", "SingleLineText"),
      col("Sort", "Number"),
      col("Active", "Checkbox"),
      col("CtaType", "SingleSelect", {
        uidt: "SingleSelect",
        dtxp: "'contact','calendly','both'",
      }),
    ],
  },
  {
    title: "ServiceLocale",
    columns: [
      col("ServiceId", "Number"),
      col("Locale", "SingleSelect", localeSelect),
      col("Title", "SingleLineText"),
      col("Summary", "LongText"),
      col("BulletsMarkdown", "LongText"),
    ],
  },
  {
    title: "BlogTag",
    columns: [col("Slug", "SingleLineText")],
  },
  {
    title: "BlogTagLocale",
    columns: [
      col("TagId", "Number"),
      col("Locale", "SingleSelect", localeSelect),
      col("Name", "SingleLineText"),
    ],
  },
  {
    title: "BlogCategory",
    columns: [col("Slug", "SingleLineText"), col("Sort", "Number")],
  },
  {
    title: "BlogCategoryLocale",
    columns: [
      col("CategoryId", "Number"),
      col("Locale", "SingleSelect", localeSelect),
      col("Name", "SingleLineText"),
    ],
  },
  {
    title: "BlogPost",
    columns: [
      col("Slug", "SingleLineText"),
      col("Locale", "SingleSelect", localeSelect),
      col("Status", "SingleSelect", {
        uidt: "SingleSelect",
        dtxp: "'draft','published'",
      }),
      col("PublishedAt", "DateTime"),
      col("Title", "SingleLineText"),
      col("Excerpt", "LongText"),
      col("BodyMarkdown", "LongText"),
      col("SeoTitle", "SingleLineText"),
      col("SeoDescription", "LongText"),
      col("OgImage", "URL"),
      col("CategoryId", "Number"),
      col("TagSlugs", "LongText"),
      col("RelatedSlugs", "LongText"),
    ],
  },
  {
    title: "ContactMessage",
    columns: [
      col("Name", "SingleLineText"),
      col("Contact", "SingleLineText"),
      col("Message", "LongText"),
      col("Status", "SingleSelect", {
        uidt: "SingleSelect",
        dtxp: "'new','read','archived'",
      }),
      col("TurnstileOk", "Checkbox"),
      col("IpHash", "SingleLineText"),
    ],
  },
];

const ids = {};
for (const def of tables) {
  const t = await createTable(def.title, def.columns);
  ids[def.title] = t.id;
}

fs.mkdirSync(path.dirname(statePath), { recursive: true });
fs.writeFileSync(statePath, JSON.stringify({ baseId: BASE_ID, tables: ids }, null, 2));
console.log(`Wrote ${statePath}`);
console.log(`Tables: ${Object.keys(ids).length}`);
