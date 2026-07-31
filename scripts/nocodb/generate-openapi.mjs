/**
 * Build a local OpenAPI 3 spec from NocoDB Meta table schemas.
 * Needed because the API token lacks swaggerJson permission.
 *
 * Usage: set -a && source .env.local && set +a && node scripts/nocodb/generate-openapi.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const BASE_URL = (process.env.NOCODB_BASE_URL || "https://app.nocodb.com").replace(
  /\/$/,
  "",
);
const TOKEN = process.env.NOCODB_API_TOKEN;
const ids = JSON.parse(
  fs.readFileSync(path.join(__dirname, ".table-ids.json"), "utf8"),
);

if (!TOKEN) {
  console.error("NOCODB_API_TOKEN missing");
  process.exit(1);
}

function uidtToSchema(uidt) {
  switch (uidt) {
    case "Number":
    case "Decimal":
    case "Currency":
    case "Percent":
    case "Rating":
    case "Year":
    case "Duration":
      return { type: ["number", "null"] };
    case "Checkbox":
      return { type: ["boolean", "null"] };
    case "JSON":
      return { type: ["object", "null"], additionalProperties: true };
    case "Attachment":
      return { type: ["array", "null"], items: { type: "object", additionalProperties: true } };
    case "ID":
      return { type: ["integer", "null"] };
    default:
      return { type: ["string", "null"] };
  }
}

function isWritable(col) {
  if (col.system) return false;
  if (col.pk || col.ai) return false;
  const skip = new Set([
    "ID",
    "CreatedTime",
    "LastModifiedTime",
    "CreatedBy",
    "LastModifiedBy",
    "Order",
    "Deleted",
    "Meta",
    "Formula",
    "Lookup",
    "Rollup",
    "Barcode",
    "QrCode",
    "Button",
  ]);
  return !skip.has(col.uidt);
}

async function api(pathname) {
  const res = await fetch(`${BASE_URL}${pathname}`, {
    headers: { "xc-token": TOKEN, Accept: "application/json" },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`${pathname} → ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

const paths = {};
const schemas = {};
const tags = [];

for (const [title, tableId] of Object.entries(ids.tables)) {
  const meta = await api(`/api/v2/meta/tables/${tableId}`);
  const columns = (meta.columns || []).filter((c) => !c.system || c.uidt === "ID");
  const props = {};
  const writeProps = {};

  for (const col of columns) {
    const schema = uidtToSchema(col.uidt);
    props[col.title] = { ...schema, description: col.uidt };
    if (isWritable(col)) {
      writeProps[col.title] = { ...schema, description: col.uidt };
    }
  }

  const recordName = `${title}Record`;
  const writeName = `${title}Write`;
  schemas[recordName] = {
    type: "object",
    additionalProperties: true,
    properties: props,
  };
  schemas[writeName] = {
    type: "object",
    additionalProperties: true,
    properties: writeProps,
  };
  schemas[`${title}ListResponse`] = {
    type: "object",
    properties: {
      list: { type: "array", items: { $ref: `#/components/schemas/${recordName}` } },
      pageInfo: {
        type: "object",
        additionalProperties: true,
        properties: {
          totalRows: { type: "integer" },
          page: { type: "integer" },
          pageSize: { type: "integer" },
          isFirstPage: { type: "boolean" },
          isLastPage: { type: "boolean" },
        },
      },
    },
  };

  tags.push({ name: title, description: `Table ${title} (${tableId})` });
  const basePath = `/api/v2/tables/${tableId}/records`;

  paths[basePath] = {
    get: {
      operationId: `list${title}`,
      tags: [title],
      summary: `List ${title}`,
      parameters: [
        { name: "limit", in: "query", schema: { type: "integer" } },
        { name: "offset", in: "query", schema: { type: "integer" } },
        { name: "where", in: "query", schema: { type: "string" } },
        { name: "sort", in: "query", schema: { type: "string" } },
        { name: "fields", in: "query", schema: { type: "string" } },
      ],
      responses: {
        "200": {
          description: "OK",
          content: {
            "application/json": {
              schema: { $ref: `#/components/schemas/${title}ListResponse` },
            },
          },
        },
      },
      security: [{ xcToken: [] }],
    },
    post: {
      operationId: `create${title}`,
      tags: [title],
      summary: `Create ${title} record(s)`,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              oneOf: [
                { $ref: `#/components/schemas/${writeName}` },
                { type: "array", items: { $ref: `#/components/schemas/${writeName}` } },
              ],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "OK",
          content: {
            "application/json": {
              schema: {
                oneOf: [
                  { $ref: `#/components/schemas/${recordName}` },
                  { type: "array", items: { $ref: `#/components/schemas/${recordName}` } },
                ],
              },
            },
          },
        },
      },
      security: [{ xcToken: [] }],
    },
    patch: {
      operationId: `update${title}`,
      tags: [title],
      summary: `Update ${title} record(s)`,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              oneOf: [
                {
                  allOf: [
                    { $ref: `#/components/schemas/${writeName}` },
                    {
                      type: "object",
                      required: ["Id"],
                      properties: { Id: { type: "integer" } },
                    },
                  ],
                },
                {
                  type: "array",
                  items: {
                    allOf: [
                      { $ref: `#/components/schemas/${writeName}` },
                      {
                        type: "object",
                        required: ["Id"],
                        properties: { Id: { type: "integer" } },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "OK",
          content: {
            "application/json": {
              schema: {
                oneOf: [
                  { $ref: `#/components/schemas/${recordName}` },
                  { type: "array", items: { $ref: `#/components/schemas/${recordName}` } },
                ],
              },
            },
          },
        },
      },
      security: [{ xcToken: [] }],
    },
    delete: {
      operationId: `delete${title}`,
      tags: [title],
      summary: `Delete ${title} record(s)`,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              oneOf: [
                {
                  type: "object",
                  required: ["Id"],
                  properties: { Id: { type: "integer" } },
                },
                {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["Id"],
                    properties: { Id: { type: "integer" } },
                  },
                },
              ],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "OK",
          content: {
            "application/json": {
              schema: { type: "object", additionalProperties: true },
            },
          },
        },
      },
      security: [{ xcToken: [] }],
    },
  };

  paths[`${basePath}/{recordId}`] = {
    get: {
      operationId: `get${title}`,
      tags: [title],
      summary: `Get ${title} by id`,
      parameters: [
        {
          name: "recordId",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      responses: {
        "200": {
          description: "OK",
          content: {
            "application/json": {
              schema: { $ref: `#/components/schemas/${recordName}` },
            },
          },
        },
      },
      security: [{ xcToken: [] }],
    },
  };

  console.log(`+ ${title} (${Object.keys(writeProps).length} writable fields)`);
}

const openapi = {
  openapi: "3.1.0",
  info: {
    title: "qrbni NocoDB CV base",
    version: "1.0.0",
    description:
      "Generated from NocoDB Meta API because the PAT lacks swaggerJson. Regenerate with npm run nocodb:openapi.",
  },
  servers: [{ url: BASE_URL }],
  tags,
  paths,
  components: {
    securitySchemes: {
      xcToken: {
        type: "apiKey",
        in: "header",
        name: "xc-token",
      },
    },
    schemas,
  },
  security: [{ xcToken: [] }],
};

const outDir = path.join(ROOT, "openapi");
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "nocodb-cv.openapi.json");
fs.writeFileSync(outFile, JSON.stringify(openapi, null, 2));
console.log(`Wrote ${outFile}`);
console.log(`Operations: ${Object.keys(paths).length * 2}+ paths for ${tags.length} tables`);
