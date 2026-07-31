import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./openapi/nocodb-cv.openapi.json",
  output: "src/generated/nocodb",
  plugins: [
    "@hey-api/typescript",
    {
      name: "@hey-api/sdk",
      auth: true,
    },
    "@hey-api/client-fetch",
  ],
});
