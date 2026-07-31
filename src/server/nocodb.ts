import { client } from "@/generated/nocodb/client.gen";
import { serverEnv } from "@/server/env";

let configured = false;

/** Configure the generated Hey API client (server-only). */
export function configureNocoClient() {
  if (configured) return client;

  client.setConfig({
    baseUrl: serverEnv.nocodbBaseUrl(),
    auth: () => serverEnv.nocodbApiToken(),
  });

  configured = true;
  return client;
}

export { client as nocoClient };
export * from "@/generated/nocodb";
