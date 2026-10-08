import { client } from "@/generated/nocodb/client.gen";
import { serverEnv } from "@/server/env";

let configured = false;

const RETRYABLE = new Set([408, 425, 429, 500, 502, 503, 504]);
const MAX_ATTEMPTS = 3;
/** Cap waits — NocoDB often sends Retry-After: 30 which blows SSG/CI budgets. */
const MAX_WAIT_MS = 2000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetch with short backoff — NocoDB cloud returns 429 under Worker/CI fan-out. */
async function nocodbFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  let last: Response | undefined;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const response = await fetch(input, init);
    last = response;
    if (!RETRYABLE.has(response.status) || attempt === MAX_ATTEMPTS) {
      return response;
    }
    const retryAfter = Number(response.headers.get("retry-after"));
    const hinted =
      Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 250 * 2 ** (attempt - 1);
    const waitMs = Math.min(hinted, MAX_WAIT_MS);
    console.warn(
      `[nocodb] HTTP ${response.status}; retry ${attempt}/${MAX_ATTEMPTS} in ${waitMs}ms`,
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
