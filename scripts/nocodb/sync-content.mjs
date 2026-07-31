/**
 * Upsert bilingual CV + services content from cv.yaml / content/services.yaml
 * into an already-seeded NocoDB base (update EN, create missing FA).
 *
 * Usage:
 *   set -a && source .env.local && set +a && npm run nocodb:sync-content
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

async function listAll(tableTitle) {
  const tableId = ids[tableTitle];
  const out = [];
  let offset = 0;
  for (;;) {
    const data = await api(
      "GET",
      `/api/v2/tables/${tableId}/records?limit=200&offset=${offset}`,
    );
    const list = data?.list ?? [];
    out.push(...list);
    const page = data?.pageInfo;
    if (!page?.isLastPage && list.length) {
      offset += list.length;
      continue;
    }
    break;
  }
  return out;
}

async function createRows(tableTitle, records) {
  if (!records.length) return [];
  const tableId = ids[tableTitle];
  const created = await api("POST", `/api/v2/tables/${tableId}/records`, records);
  const list = Array.isArray(created) ? created : [created];
  console.log(`+ ${tableTitle}: ${list.length}`);
  return list;
}

async function updateRows(tableTitle, records) {
  if (!records.length) return [];
  const tableId = ids[tableTitle];
  // NocoDB v2 update expects Id on each record
  const updated = await api("PATCH", `/api/v2/tables/${tableId}/records`, records);
  const list = Array.isArray(updated) ? updated : [updated];
  console.log(`~ ${tableTitle}: ${list.length}`);
  return list;
}

function findLocaleRow(rows, foreignKey, foreignId, locale) {
  return rows.find(
    (r) => Number(r[foreignKey]) === Number(foreignId) && r.Locale === locale,
  );
}

const cv = loadYaml(fs.readFileSync(path.join(ROOT, "cv.yaml"), "utf8"));
const servicesDoc = loadYaml(
  fs.readFileSync(path.join(ROOT, "content/services.yaml"), "utf8"),
);

const profiles = await listAll("Profile");
const profile = profiles[0];
if (!profile?.Id) throw new Error("No Profile row — run seed first");
const profileId = profile.Id;

// Profile Locale
{
  const rows = await listAll("ProfileLocale");
  const patch = [];
  const create = [];
  for (const locale of ["en", "fa"]) {
    const payload = {
      ProfileId: profileId,
      Locale: locale,
      Headline: pickLocale(cv.basics.headline, locale),
      Summary: pickLocale(cv.basics.summary, locale),
      Label: pickLabel(cv.basics.label, locale),
    };
    const existing = findLocaleRow(rows, "ProfileId", profileId, locale);
    if (existing) patch.push({ Id: existing.Id, ...payload });
    else create.push(payload);
  }
  await updateRows("ProfileLocale", patch);
  await createRows("ProfileLocale", create);
}

// Experience + locales + highlights (match by Sort order)
{
  const experiences = (await listAll("Experience")).sort(
    (a, b) => (a.Sort ?? 0) - (b.Sort ?? 0),
  );
  const localeRows = await listAll("ExperienceLocale");
  const highlightRows = await listAll("ExperienceHighlight");
  const yamlExps = cv.experience || [];

  if (experiences.length !== yamlExps.length) {
    console.warn(
      `Experience count mismatch: NocoDB ${experiences.length} vs cv.yaml ${yamlExps.length}. Matching by Sort index.`,
    );
  }

  const localePatch = [];
  const localeCreate = [];
  const highlightCreate = [];
  const highlightPatch = [];
  const highlightDeleteIds = [];

  for (let i = 0; i < Math.min(experiences.length, yamlExps.length); i++) {
    const expRow = experiences[i];
    const exp = yamlExps[i];
    const experienceId = expRow.Id;

    for (const locale of ["en", "fa"]) {
      const payload = {
        ExperienceId: experienceId,
        Locale: locale,
        Title: pickLocale(exp.title, locale) || (locale === "en" ? "Role" : "نقش"),
        Summary: pickLocale(exp.summary, locale),
      };
      const existing = findLocaleRow(localeRows, "ExperienceId", experienceId, locale);
      if (existing) localePatch.push({ Id: existing.Id, ...payload });
      else localeCreate.push(payload);
    }

    // Replace highlights per locale: update in sort order, create extras, delete surplus
    for (const locale of ["en", "fa"]) {
      const desired = highlightBodies(exp.highlights || [], locale);
      const existing = highlightRows
        .filter(
          (h) =>
            Number(h.ExperienceId) === Number(experienceId) && h.Locale === locale,
        )
        .sort((a, b) => (a.Sort ?? 0) - (b.Sort ?? 0));

      const n = Math.max(desired.length, existing.length);
      for (let j = 0; j < n; j++) {
        const want = desired[j];
        const have = existing[j];
        if (want && have) {
          highlightPatch.push({
            Id: have.Id,
            ExperienceId: experienceId,
            Locale: locale,
            Body: want.body,
            Sort: want.sort,
          });
        } else if (want && !have) {
          highlightCreate.push({
            ExperienceId: experienceId,
            Locale: locale,
            Body: want.body,
            Sort: want.sort,
          });
        } else if (!want && have) {
          highlightDeleteIds.push(have.Id);
        }
      }
    }
  }

  await updateRows("ExperienceLocale", localePatch);
  await createRows("ExperienceLocale", localeCreate);
  await updateRows("ExperienceHighlight", highlightPatch);
  await createRows("ExperienceHighlight", highlightCreate);
  if (highlightDeleteIds.length) {
    await api("DELETE", `/api/v2/tables/${ids.ExperienceHighlight}/records`, {
      Id: highlightDeleteIds,
    });
    console.log(`- ExperienceHighlight: ${highlightDeleteIds.length}`);
  }
}

// Projects
{
  const projects = (await listAll("Project")).sort(
    (a, b) => (a.Sort ?? 0) - (b.Sort ?? 0),
  );
  const localeRows = await listAll("ProjectLocale");
  const yamlProjects = cv.projects || [];
  const patch = [];
  const create = [];
  for (let i = 0; i < Math.min(projects.length, yamlProjects.length); i++) {
    const row = projects[i];
    const project = yamlProjects[i];
    for (const locale of ["en", "fa"]) {
      const payload = {
        ProjectId: row.Id,
        Locale: locale,
        Summary: pickLocale(project.summary, locale),
      };
      const existing = findLocaleRow(localeRows, "ProjectId", row.Id, locale);
      if (existing) patch.push({ Id: existing.Id, ...payload });
      else create.push(payload);
    }
  }
  await updateRows("ProjectLocale", patch);
  await createRows("ProjectLocale", create);
}

// Education
{
  const education = (await listAll("Education")).sort(
    (a, b) => (a.Sort ?? 0) - (b.Sort ?? 0),
  );
  const localeRows = await listAll("EducationLocale");
  const yamlEdu = cv.education || [];
  const patch = [];
  const create = [];
  for (let i = 0; i < Math.min(education.length, yamlEdu.length); i++) {
    const row = education[i];
    const edu = yamlEdu[i];
    for (const locale of ["en", "fa"]) {
      const payload = {
        EducationId: row.Id,
        Locale: locale,
        Degree: pickLocale(edu.degree, locale),
        Field: pickLocale(edu.field, locale),
      };
      const existing = findLocaleRow(localeRows, "EducationId", row.Id, locale);
      if (existing) patch.push({ Id: existing.Id, ...payload });
      else create.push(payload);
    }
  }
  await updateRows("EducationLocale", patch);
  await createRows("EducationLocale", create);
}

// Services (match by Key)
{
  const categories = await listAll("ServiceCategory");
  const catLocales = await listAll("ServiceCategoryLocale");
  const services = await listAll("Service");
  const svcLocales = await listAll("ServiceLocale");
  const catPatch = [];
  const catCreate = [];
  const svcPatch = [];
  const svcCreate = [];

  for (const cat of servicesDoc.categories || []) {
    const catRow = categories.find((c) => c.Key === cat.key);
    if (!catRow) {
      console.warn(`Missing ServiceCategory Key=${cat.key}`);
      continue;
    }
    for (const locale of ["en", "fa"]) {
      const payload = {
        CategoryId: catRow.Id,
        Locale: locale,
        Title: pickLocale(cat.title, locale),
        Description: pickLocale(cat.description, locale),
      };
      const existing = findLocaleRow(catLocales, "CategoryId", catRow.Id, locale);
      if (existing) catPatch.push({ Id: existing.Id, ...payload });
      else catCreate.push(payload);
    }
    for (const svc of cat.services || []) {
      const svcRow = services.find((s) => s.Key === svc.key);
      if (!svcRow) {
        console.warn(`Missing Service Key=${svc.key}`);
        continue;
      }
      for (const locale of ["en", "fa"]) {
        const payload = {
          ServiceId: svcRow.Id,
          Locale: locale,
          Title: pickLocale(svc.title, locale),
          Summary: pickLocale(svc.summary, locale),
          BulletsMarkdown: bulletsMarkdown(svc.bullets, locale),
        };
        const existing = findLocaleRow(svcLocales, "ServiceId", svcRow.Id, locale);
        if (existing) svcPatch.push({ Id: existing.Id, ...payload });
        else svcCreate.push(payload);
      }
    }
  }

  await updateRows("ServiceCategoryLocale", catPatch);
  await createRows("ServiceCategoryLocale", catCreate);
  await updateRows("ServiceLocale", svcPatch);
  await createRows("ServiceLocale", svcCreate);
}

console.log("Content sync complete.");
