import { NextResponse } from "next/server";

/**
 * Contact POST stub — Turnstile verify + NocoDB insert in a later slice.
 */
export async function POST() {
  return NextResponse.json(
    { ok: false, error: "Contact intake not wired yet" },
    { status: 501 },
  );
}
