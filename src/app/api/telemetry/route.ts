import { NextResponse } from "next/server";
import {
  formatTelemetryTelegram,
  hostFromRequest,
  isTelegramNotifyEnabled,
  notifyTelegram,
} from "@/server/telegram";

export const dynamic = "force-dynamic";

const EVENTS = ["site_visit", "contact_visit", "meeting_click"] as const;
type TelemetryEvent = (typeof EVENTS)[number];

function isTelemetryEvent(value: string): value is TelemetryEvent {
  return (EVENTS as readonly string[]).includes(value);
}

type Body = {
  event?: unknown;
  path?: unknown;
  locale?: unknown;
  referrer?: unknown;
};

function asShortString(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return undefined;
  return trimmed;
}

export async function POST(request: Request) {
  const host = hostFromRequest(request);

  // Quiet no-op outside production (preview/local).
  if (!isTelegramNotifyEnabled(host)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event = asShortString(body.event, 40);
  if (!event || !isTelemetryEvent(event)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  notifyTelegram({
    host,
    text: formatTelemetryTelegram({
      event,
      path: asShortString(body.path, 200),
      locale: asShortString(body.locale, 8),
      referrer: asShortString(body.referrer, 300),
    }),
  });

  return NextResponse.json({ ok: true });
}
