/** @type {import('@hey-api/openapi-ts').UserConfig} */
export default {
  // Input filled after NocoDB tables exist (base swagger or Data API v3 OpenAPI).
  // Example: input: { path: process.env.NOCODB_OPENAPI_URL }
  input: process.env.NOCODB_OPENAPI_URL ?? "https://data-apis-v3.nocodb.com/openapi.json",
  output: "src/generated/nocodb",
  plugins: ["@hey-api/typescript", "@hey-api/sdk"],
};
