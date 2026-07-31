function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

/** Server-only env. Never import from Client Components. */
export const serverEnv = {
  nocodbBaseUrl: () =>
    process.env.NOCODB_BASE_URL ?? "https://app.nocodb.com",
  nocodbApiToken: () => required("NOCODB_API_TOKEN", process.env.NOCODB_API_TOKEN),
  turnstileSiteKey: () =>
    required("TURNSTILE_SITE_KEY", process.env.TURNSTILE_SITE_KEY),
  turnstileSecret: () =>
    process.env.TURNSTILE_SECRET ??
    process.env.TURNSTILE_SECRET_KEY ??
    (() => {
      throw new Error("Missing required env: TURNSTILE_SECRET");
    })(),
  revalidateSecret: () =>
    required("REVALIDATE_SECRET", process.env.REVALIDATE_SECRET),
  isPreviewHost: (host: string | null) =>
    Boolean(host?.includes("preview.qrbni.dev")),
};
