import { client } from "@/generated/nocodb/client.gen";
import { serverEnv } from "@/server/env";

let configured = false;

const RETRYABLE = new Set([408, 425, 429, 500, 502, 503, 504]);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetch with backoff — NocoDB cloud returns 429 under Worker fan-out. */
async function nocodbFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const maxAttempts = 4;
  let last: Response | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await fetch(input, init);
    last = response;
    if (!RETRYABLE.has(response.status) || attempt === maxAttempts) {
      return response;
    }
    const retryAfter = Number(response.headers.get("retry-after"));
    const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
      ? retryAfter * 1000
      : 250 * 2 ** (attempt - 1);
    console.warn(
      `[nocodb] HTTP ${response.status}; retry ${attempt}/${maxAttempts} in ${waitMs}ms`,
    );
    await sleep(waitMs);
  }

  return last as Response;
}

/** Configure the generated Hey API client (server-only). */
export function configureNocoClient() {
  if (configured) return client;

  client.setConfig({
    baseUrl: serverEnv.nocodbBaseUrl(),
    auth: () => serverEnv.nocodbApiToken(),
    fetch: nocodbFetch,
  });

  configured = true;
  return client;
}

export { client as nocoClient };
export * from "@/generated/nocodb";
