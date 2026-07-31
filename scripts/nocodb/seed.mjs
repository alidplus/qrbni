/**
 * Seed NocoDB from cv.yaml + content/services.yaml (EN + FA locales).
 * Usage: set -a && source .env.local && set +a && node scripts/nocodb/seed.mjs
 *
 * Idempotent: aborts if SiteSettings already has rows.
 * For updates to an existing base, use: npm run nocodb:sync-content
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load as loadYaml } from "js-yaml";
import {
  bulletsMarkdown,
  highlightBodies,
  pickLabel,
  pickLocale,
} from "./locale-helpers.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const BASE_URL = (process.env.NOCODB_BASE_URL || "https://app.nocodb.com").replace(
  /\/$/,
  "",
);
const TOKEN = process.env.NOCODB_API_TOKEN;
const ids = JSON.parse(
  fs.readFileSync(path.join(__dirname, ".table-ids.json"), "utf8"),
).tables;

if (!TOKEN) {
  console.error("NOCODB_API_TOKEN missing");
  process.exit(1);
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

async function createRecords(tableTitle, records) {
  if (!records.length) return [];
  const tableId = ids[tableTitle];
  if (!tableId) throw new Error(`Unknown table ${tableTitle}`);
  const created = await api("POST", `/api/v2/tables/${tableId}/records`, records);
  const list = Array.isArray(created) ? created : [created];
  console.log(`+ ${tableTitle}: ${list.length} row(s)`);
  return list;
}

async function count(tableTitle) {
  const tableId = ids[tableTitle];
  const data = await api("GET", `/api/v2/tables/${tableId}/records?limit=1`);
  return data?.pageInfo?.totalRows ?? data?.list?.length ?? 0;
}

const cv = loadYaml(fs.readFileSync(path.join(ROOT, "cv.yaml"), "utf8"));
const servicesDoc = loadYaml(
  fs.readFileSync(path.join(ROOT, "content/services.yaml"), "utf8"),
);

const settingsCount = await count("SiteSettings");
if (settingsCount > 0) {
  console.log("Seed already present (SiteSettings rows > 0). Aborting.");
  console.log("Use: npm run nocodb:sync-content");
  process.exit(0);
}

await createRecords("SiteSettings", [
  {
    Key: "default",
    show_blog: true,
    show_services: true,
    show_projects: true,
    show_experience: true,
    show_contact_form: true,
    fa_locale_enabled: true,
    maintenance_mode: false,
    indexing_enabled: true,
    show_hireable: false,
    show_day_rate: false,
    day_rate_amount: cv.basics?.availability?.twine_day_rate?.amount ?? 250,
    day_rate_currency:
      cv.basics?.availability?.twine_day_rate?.currency ?? "USD",
    calendly_url: "https://calendly.com/alighorbani/30min",
    public_email: "ali.ghorbani.tr@gmail.com",
    public_phone: "+989143252762",
    public_location: "Istanbul",
    maintenance_message_en: "Back soon.",
    maintenance_message_fa: "به‌زودی برمی‌گردیم.",
  },
]);

const [profile] = await createRecords("Profile", [
  {
    Name: cv.basics.name,
    Slug: "ali-ghorbani",
    AvatarUrl: cv.basics.avatar?.github || cv.basics.avatar?.twine || null,
    GitHub: cv.basics.profiles?.github,
    LinkedIn: cv.basics.profiles?.linkedin,
    Twine: cv.basics.profiles?.twine,
    Hireable: Boolean(cv.basics.availability?.hireable),
    TotalExperience: cv.basics.total_experience_reported,
  },
]);

const profileId = profile.Id ?? profile.id;
await createRecords(
  "ProfileLocale",
  ["en", "fa"].map((locale) => ({
    ProfileId: profileId,
    Locale: locale,
    Headline: pickLocale(cv.basics.headline, locale),
    Summary: pickLocale(cv.basics.summary, locale),
    Label: pickLabel(cv.basics.label, locale),
  })),
);

await createRecords(
  "Language",
  (cv.languages || []).map((l, i) => ({
    Name: l.name,
    Proficiency: l.proficiency,
    Level: l.level,
    Sort: i + 1,
  })),
);

await createRecords(
  "SocialLink",
  [
    { Label: "LinkedIn", Url: cv.basics.profiles?.linkedin, Sort: 1 },
    { Label: "GitHub", Url: cv.basics.profiles?.github, Sort: 2 },
    { Label: "Twine", Url: cv.basics.profiles?.twine, Sort: 3 },
  ].filter((x) => x.Url),
);

const primarySkills = (cv.skills?.primary || []).map((s, i) => ({
  Name: s.name,
  Level: s.level,
  Group: "primary",
  Sort: i + 1,
}));
const alsoSkills = (cv.skills?.also_used || []).map((s, i) => ({
  Name: s,
  Level: null,
  Group: "also_used",
  Sort: 100 + i,
}));
await createRecords("Skill", [...primarySkills, ...alsoSkills]);

for (const [index, exp] of (cv.experience || []).entries()) {
  const [row] = await createRecords("Experience", [
    {
      Company: exp.company,
      CompanyUrl: exp.company_url || null,
      Website: exp.website || null,
      RelatedCompany: exp.related_company || null,
      Location: exp.location || null,
      StartDate: exp.start_date || null,
      EndDate: exp.end_date || null,
      Current: Boolean(exp.current),
      Sort: index + 1,
      Tech: (exp.tech || []).join(", "),
      DateNotes: exp.date_notes ? String(exp.date_notes).trim() : null,
    },
  ]);
  const experienceId = row.Id ?? row.id;
  await createRecords(
    "ExperienceLocale",
    ["en", "fa"].map((locale) => ({
      ExperienceId: experienceId,
      Locale: locale,
      Title: pickLocale(exp.title, locale) || (locale === "en" ? "Role" : "نقش"),
      Summary: pickLocale(exp.summary, locale),
    })),
  );
  const highlights = ["en", "fa"].flatMap((locale) =>
    highlightBodies(exp.highlights || [], locale).map((h) => ({
      ExperienceId: experienceId,
      Locale: locale,
      Body: h.body,
      Sort: h.sort,
    })),
  );
  await createRecords("ExperienceHighlight", highlights);
}

for (const [index, project] of (cv.projects || []).entries()) {
  const [row] = await createRecords("Project", [
    {
      Name: project.name,
      Role: project.role || null,
      Company: project.company || null,
      StartDate: project.start_date || null,
      EndDate: project.end_date || null,
      Current: Boolean(project.current),
      Sort: index + 1,
      Tech: (project.tech || []).join(", "),
      RelatedPosts: (project.related_posts || []).join("\n"),
    },
  ]);
  await createRecords(
    "ProjectLocale",
    ["en", "fa"]
      .map((locale) => ({
        ProjectId: row.Id ?? row.id,
        Locale: locale,
        Summary: pickLocale(project.summary, locale),
      }))
      .filter((r) => r.Summary),
  );
}

for (const [index, edu] of (cv.education || []).entries()) {
  const [row] = await createRecords("Education", [
    {
      Institution: edu.institution,
      InstitutionUrl: edu.institution_url || null,
      StartDate: edu.start_date || null,
      EndDate: edu.end_date || null,
      Location: edu.location || null,
      Sort: index + 1,
    },
  ]);
  await createRecords(
    "EducationLocale",
    ["en", "fa"].map((locale) => ({
      EducationId: row.Id ?? row.id,
      Locale: locale,
      Degree: pickLocale(edu.degree, locale),
      Field: pickLocale(edu.field, locale),
    })),
  );
}

for (const cat of servicesDoc.categories || []) {
  const [catRow] = await createRecords("ServiceCategory", [
    { Key: cat.key, Sort: cat.sort, Active: true },
  ]);
  const categoryId = catRow.Id ?? catRow.id;
  await createRecords(
    "ServiceCategoryLocale",
    ["en", "fa"].map((locale) => ({
      CategoryId: categoryId,
      Locale: locale,
      Title: pickLocale(cat.title, locale),
      Description: pickLocale(cat.description, locale),
    })),
  );
  for (const [i, svc] of (cat.services || []).entries()) {
    const [svcRow] = await createRecords("Service", [
      {
        CategoryId: categoryId,
        Key: svc.key,
        Sort: i + 1,
        Active: true,
        CtaType: "both",
      },
    ]);
    await createRecords(
      "ServiceLocale",
      ["en", "fa"].map((locale) => ({
        ServiceId: svcRow.Id ?? svcRow.id,
        Locale: locale,
        Title: pickLocale(svc.title, locale),
        Summary: pickLocale(svc.summary, locale),
        BulletsMarkdown: bulletsMarkdown(svc.bullets, locale),
      })),
    );
  }
}

await createRecords("BlogCategory", [{ Slug: "engineering", Sort: 1 }]);
const catList = await api(
  "GET",
  `/api/v2/tables/${ids.BlogCategory}/records?limit=1`,
);
const blogCategoryId = catList.list?.[0]?.Id;
if (blogCategoryId) {
  await createRecords("BlogCategoryLocale", [
    { CategoryId: blogCategoryId, Locale: "en", Name: "Engineering" },
    { CategoryId: blogCategoryId, Locale: "fa", Name: "مهندسی" },
  ]);
}

await createRecords("BlogPost", [
  {
    Slug: "hello-qrbni",
    Locale: "en",
    Status: "draft",
    Title: "Hello qrbni.dev",
    Excerpt: "Notes on building this site with Next.js, Workers, and NocoDB.",
    BodyMarkdown:
      "# Hello\n\nThis is a draft seed post. Publish it from NocoDB when ready.\n",
    SeoTitle: "Hello qrbni.dev",
    SeoDescription: "Building a personal site on Cloudflare Workers + NocoDB.",
    CategoryId: blogCategoryId ?? null,
    TagSlugs: "meta",
    RelatedSlugs: "",
  },
]);

console.log("Seed complete (EN + FA locales).");
