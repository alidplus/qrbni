import { PRODUCTION_HOST } from "@/config/site";

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

export { PRODUCTION_HOST };

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
  /** Optional — production Telegram notify only. */
  telegramBotToken: () => process.env.TELEGRAM_BOT_TOKEN?.trim() || null,
  telegramChatId: () => process.env.TELEGRAM_CHAT_ID?.trim() || null,
  isPreviewHost: (host: string | null) =>
    Boolean(host?.includes("preview.qrbni.dev")),
  isProductionHost: (host: string | null | undefined) => {
    if (!host) return false;
    const h = host.split(":")[0]?.toLowerCase() ?? "";
    return h === PRODUCTION_HOST;
  },
};
