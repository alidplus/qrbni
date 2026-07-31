/**
 * Fetch live NocoDB base swagger (v2) and normalize for Hey API.
 * Requires PAT with swaggerJson permission.
 *
 * Usage: set -a && source .env.local && set +a && node scripts/nocodb/generate-openapi.mjs
 *
 * Fallback: META_OPENAPI=1 uses Meta-derived generator (scripts/nocodb/generate-openapi-from-meta.mjs)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const BASE_URL = (process.env.NOCODB_BASE_URL || "https://app.nocodb.com").replace(
  /\/$/,
  "",
);
const TOKEN = process.env.NOCODB_API_TOKEN;
const BASE_ID = "p4cutoefjsz0z2t";
const outFile = path.join(ROOT, "openapi/nocodb-cv.openapi.json");

if (process.env.META_OPENAPI === "1") {
  const r = spawnSync(
    process.execPath,
    [path.join(__dirname, "generate-openapi-from-meta.mjs")],
    { stdio: "inherit", env: process.env },
  );
  process.exit(r.status ?? 1);
}

if (!TOKEN) {
  console.error("NOCODB_API_TOKEN missing");
  process.exit(1);
}

const url = `${BASE_URL}/api/v2/meta/bases/${BASE_ID}/swagger.json`;
const res = await fetch(url, {
  headers: { "xc-token": TOKEN, Accept: "application/json" },
});
const text = await res.text();
if (!res.ok) {
  console.error(`Live swagger failed ${res.status}: ${text}`);
  console.error("Retry with META_OPENAPI=1 for Meta-derived fallback.");
  process.exit(1);
}

let spec;
try {
  spec = JSON.parse(text);
} catch {
  console.error("Swagger response was not JSON");
  process.exit(1);
}

spec.servers = [{ url: BASE_URL }];
spec.info = spec.info || {};
spec.info.title = spec.info.title || "qrbni NocoDB CV base";
spec.info.description = [
  spec.info.description || "",
  "Fetched live from NocoDB v2 base swagger.",
  `Source: /api/v2/meta/bases/${BASE_ID}/swagger.json`,
  "Regenerate: npm run nocodb:openapi",
]
  .filter(Boolean)
  .join("\n");

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(spec, null, 2));
console.log(`Wrote ${outFile}`);
console.log(`openapi ${spec.openapi} · paths ${Object.keys(spec.paths || {}).length}`);
