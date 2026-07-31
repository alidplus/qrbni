#!/usr/bin/env node
/**
 * Create NocoDB → site revalidate webhooks for CMS tables.
 *
 * Usage:
 *   SITE_URL=https://preview.qrbni.dev npm run nocodb:webhooks
 *   SITE_URL=https://qrbni.dev npm run nocodb:webhooks
 *
 * Requires NOCODB_API_TOKEN with Meta webhook permissions (hookList/hookCreate).
 * If the token is data-only, the script prints a dashboard checklist instead.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    const key = trimmed.slice(0, i).trim();
    let val = trimmed.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

loadEnvLocal();

const BASE_URL = process.env.NOCODB_BASE_URL || "https://app.nocodb.com";
const TOKEN = process.env.NOCODB_API_TOKEN;
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;
const SITE_URL = (process.env.SITE_URL || "https://preview.qrbni.dev").replace(
  /\/$/,
  "",
);

const ids = JSON.parse(
  fs.readFileSync(path.join(__dirname, ".table-ids.json"), "utf8"),
);

const SKIP = new Set(["ContactMessage"]);

const SCOPE_BY_TABLE = {
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
  return { ok: res.ok, status: res.status, data };
}

function printManualGuide() {
  console.log(`
Manual setup (NocoDB UI) — API token lacks webhook Meta permissions.

For each CMS table (not ContactMessage):
  1. Open the table → Details → Webhooks → Add New Webhook
  2. Trigger: After insert, update, and delete
  3. Action: HTTP Request · POST
  4. URL: ${SITE_URL}/api/revalidate
     (or ${SITE_URL}/api/revalidate?scope=cv|services|blog|settings)
  5. Header: Authorization = Bearer <REVALIDATE_SECRET from .env.local / CF secrets>
  6. Body: default event JSON (site maps data.table_id → paths/tags)

Then re-run with a token that includes Meta webhook permissions:
  SITE_URL=${SITE_URL} npm run nocodb:webhooks
`);
}

function hookPayload(title, scope) {
  const notification = {
    type: "URL",
    payload: {
      method: "POST",
      path: `${SITE_URL}/api/revalidate?scope=${scope}`,
      body: "{{ json event }}",
      headers: [
        {
          name: "Authorization",
          value: `Bearer ${REVALIDATE_SECRET}`,
          enabled: true,
        },
        {
          name: "Content-Type",
          value: "application/json",
          enabled: true,
        },
      ],
      parameters: [],
      auth: "",
    },
  };

  return {
    title,
    description: `qrbni revalidate (${scope}) → ${SITE_URL}`,
    active: true,
    async: true,
    env: "all",
    event: "after",
    operation: ["insert", "update", "delete"],
    condition: false,
    notification: JSON.stringify(notification),
    version: "v3",
  };
}

async function listHooks(tableId) {
  return api("GET", `/api/v2/meta/tables/${tableId}/hooks`);
}

async function createHook(tableId, payload) {
  return api("POST", `/api/v2/meta/tables/${tableId}/hooks`, payload);
}

async function main() {
  if (!TOKEN) {
    console.error("NOCODB_API_TOKEN missing");
    process.exit(1);
  }
  if (!REVALIDATE_SECRET) {
    console.error("REVALIDATE_SECRET missing");
    process.exit(1);
  }

  console.log(`Site: ${SITE_URL}`);
  console.log(`NocoDB: ${BASE_URL}`);

  const probe = await listHooks(ids.tables.Experience);
  if (!probe.ok) {
    console.error(
      `hookList failed (${probe.status}):`,
      typeof probe.data === "string" ? probe.data : JSON.stringify(probe.data),
    );
    printManualGuide();
    process.exit(2);
  }

  let created = 0;
  let skipped = 0;

  for (const [tableName, tableId] of Object.entries(ids.tables)) {
    if (SKIP.has(tableName)) continue;
    const scope = SCOPE_BY_TABLE[tableName];
    if (!scope) continue;

    const title = `qrbni revalidate · ${tableName}`;
    const existing = await listHooks(tableId);
    if (!existing.ok) {
      console.error(`x list ${tableName}: ${existing.status}`);
      printManualGuide();
      process.exit(1);
    }
    const list =
      existing.data?.list ??
      (Array.isArray(existing.data) ? existing.data : []);
    if (list.some((h) => String(h.title || "").startsWith(title))) {
      console.log(`= ${tableName}: already configured`);
      skipped++;
      continue;
    }

    const res = await createHook(tableId, hookPayload(title, scope));
    if (res.ok) {
      console.log(`+ ${tableName}`);
      created++;
      continue;
    }

    // Older API shapes: one hook per operation
    let okAny = false;
    for (const op of ["insert", "update", "delete"]) {
      const single = {
        ...hookPayload(`${title} · ${op}`, scope),
        operation: op,
        title: `${title} · ${op}`,
      };
      const r2 = await createHook(tableId, single);
      if (r2.ok) {
        console.log(`+ ${tableName} (${op})`);
        created++;
        okAny = true;
      } else {
        console.error(
          `x ${tableName} (${op}): ${r2.status} ${JSON.stringify(r2.data)}`,
        );
      }
    }
    if (!okAny) {
      printManualGuide();
      process.exit(1);
    }
  }

  console.log(`Done. created=${created} skipped=${skipped}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
