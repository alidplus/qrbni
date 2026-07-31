import { getCloudflareContext } from "@opennextjs/cloudflare";
import { PRODUCTION_HOST } from "@/config/site";
import { serverEnv } from "@/server/env";

const TELEGRAM_API = "https://api.telegram.org";

export type TelegramNotifyInput = {
  /** Request hostname — must be qrbni.dev. */
  host: string | null | undefined;
  text: string;
};

/** True only on apex production with both Telegram secrets set. */
export function isTelegramNotifyEnabled(
  host: string | null | undefined,
): boolean {
  if (!serverEnv.isProductionHost(host)) return false;
  return Boolean(serverEnv.telegramBotToken() && serverEnv.telegramChatId());
}

export function hostFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-host");
  const raw = forwarded?.split(",")[0]?.trim() || new URL(request.url).host;
  return raw.split(":")[0]?.toLowerCase() ?? "";
}

function defer(task: Promise<unknown>) {
  try {
    const { ctx } = getCloudflareContext();
    ctx.waitUntil(task);
  } catch {
    void task;
  }
}

/**
 * Fire-and-forget Telegram message. No-ops on preview/local/missing secrets.
 * Never throws to callers.
 */
export function notifyTelegram(input: TelegramNotifyInput): void {
  defer(sendTelegramMessage(input).catch(() => undefined));
}

export async function sendTelegramMessage(
  input: TelegramNotifyInput,
): Promise<boolean> {
  if (!isTelegramNotifyEnabled(input.host)) return false;

  const token = serverEnv.telegramBotToken();
  const chatId = serverEnv.telegramChatId();
  if (!token || !chatId) return false;

  const text = input.text.slice(0, 3900);
  const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  return res.ok;
}

export function formatContactTelegram(parts: {
  name: string;
  contact: string;
  message: string;
  path?: string;
}): string {
  return [
    "📩 Contact form · qrbni.dev",
    `Name: ${parts.name}`,
    `Contact: ${parts.contact}`,
    parts.path ? `Path: ${parts.path}` : null,
    "",
    parts.message,
  ]
    .filter((line) => line != null)
    .join("\n");
}

export function formatTelemetryTelegram(parts: {
  event: "site_visit" | "contact_visit" | "meeting_click";
  path?: string;
  locale?: string;
  referrer?: string;
}): string {
  const titles = {
    site_visit: "👁 Site visit",
    contact_visit: "📄 Contact page",
    meeting_click: "📅 Meeting click",
  } as const;

  return [
    `${titles[parts.event]} · ${PRODUCTION_HOST}`,
    parts.path ? `Path: ${parts.path}` : null,
    parts.locale ? `Locale: ${parts.locale}` : null,
    parts.referrer ? `Referrer: ${parts.referrer}` : null,
  ]
    .filter((line) => line != null)
    .join("\n");
}
