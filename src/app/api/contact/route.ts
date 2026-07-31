import { NextResponse } from "next/server";
import { createContactMessage } from "@/domains/contact";
import {
  clientIpFromRequest,
  hashIp,
  verifyTurnstileToken,
} from "@/server/turnstile";

export const dynamic = "force-dynamic";

type Body = {
  name?: unknown;
  contact?: unknown;
  message?: unknown;
  turnstileToken?: unknown;
  "cf-turnstile-response"?: unknown;
};

function asTrimmedString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const name = asTrimmedString(body.name, 120);
  const contact = asTrimmedString(body.contact, 200);
  const message = asTrimmedString(body.message, 5000);
  const token =
    asTrimmedString(body.turnstileToken, 4096) ??
    asTrimmedString(body["cf-turnstile-response"], 4096);

  if (!name || !contact || !message || message.length < 8) {
    return NextResponse.json(
      { ok: false, error: "validation" },
      { status: 400 },
    );
  }
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 },
    );
  }

  const ip = clientIpFromRequest(request);
  const ok = await verifyTurnstileToken(token, ip);
  if (!ok) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 },
    );
  }

  try {
    const ipHash = ip ? await hashIp(ip) : null;
    await createContactMessage({ name, contact, message, ipHash });
  } catch {
    return NextResponse.json(
      { ok: false, error: "server" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
