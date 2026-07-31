"use client";

import { useState, type FormEvent } from "react";
import type { Locale } from "@/i18n/config";
import { TurnstileField } from "@/ui/molecules/TurnstileField";

type Copy = {
  name: string;
  contact: string;
  message: string;
  submit: string;
  sending: string;
  success: string;
  successHint: string;
  errValidation: string;
  errForbidden: string;
  errServer: string;
};

const copy: Record<Locale, Copy> = {
  en: {
    name: "Name",
    contact: "Email or phone",
    message: "Message",
    submit: "Send message",
    sending: "Sending…",
    success: "Message received.",
    successHint: "I’ll reply when I can — or book 30 minutes if it’s urgent.",
    errValidation: "Check the fields and try again.",
    errForbidden: "Bot check failed. Reset and try again.",
    errServer: "Couldn’t send right now. Try again or email me.",
  },
  fa: {
    name: "نام",
    contact: "ایمیل یا تلفن",
    message: "پیام",
    submit: "ارسال پیام",
    sending: "در حال ارسال…",
    success: "پیام دریافت شد.",
    successHint: "در اولین فرصت پاسخ می‌دهم — اگر فوری است، ۳۰ دقیقه رزرو کنید.",
    errValidation: "فیلدها را بررسی کنید و دوباره بفرستید.",
    errForbidden: "تأیید امنیتی ناموفق بود. دوباره تلاش کنید.",
    errServer: "الان ارسال نشد. دوباره تلاش کنید یا ایمیل بزنید.",
  },
};

type Props = {
  locale: Locale;
  siteKey: string;
};

const fieldClass =
  "mt-2 w-full border-0 border-b border-ink/25 bg-transparent px-0 py-2.5 text-base text-ink placeholder:text-slate/70 focus:border-redline focus:outline-none focus:ring-0";

export function ContactForm({ locale, siteKey }: Props) {
  const t = copy[locale];
  const [token, setToken] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const contact = String(data.get("contact") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !contact || message.length < 8 || !token) {
      setStatus("error");
      setError(t.errValidation);
      return;
    }

    setStatus("sending");
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          message,
          turnstileToken: token,
        }),
      });
      const payload = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!res.ok || !payload?.ok) {
        setStatus("error");
        if (res.status === 403 || payload?.error === "forbidden") {
          setError(t.errForbidden);
        } else if (payload?.error === "validation") {
          setError(t.errValidation);
        } else {
          setError(t.errServer);
        }
        setToken(null);
        setResetSignal((n) => n + 1);
        return;
      }

      setStatus("ok");
      form.reset();
      setToken(null);
      setResetSignal((n) => n + 1);
    } catch {
      setStatus("error");
      setError(t.errServer);
      setToken(null);
      setResetSignal((n) => n + 1);
    }
  }

  if (status === "ok") {
    return (
      <div
        className="pin-settle space-y-3"
        role="status"
        style={{ ["--pin-rot" as string]: "0deg" }}
      >
        <p className="font-display text-2xl font-semibold text-ink">
          {t.success}
        </p>
        <p className="max-w-prose text-base leading-relaxed text-slate">
          {t.successHint}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7" noValidate>
      <div>
        <label
          htmlFor="contact-name"
          className="font-display text-xs font-semibold tracking-[0.14em] text-slate uppercase"
        >
          {t.name}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={120}
          className={fieldClass}
        />
      </div>
      <div>
        <label
          htmlFor="contact-channel"
          className="font-display text-xs font-semibold tracking-[0.14em] text-slate uppercase"
        >
          {t.contact}
        </label>
        <input
          id="contact-channel"
          name="contact"
          type="text"
          autoComplete="email"
          required
          maxLength={200}
          className={fieldClass}
          dir="ltr"
        />
      </div>
      <div>
        <label
          htmlFor="contact-message"
          className="font-display text-xs font-semibold tracking-[0.14em] text-slate uppercase"
        >
          {t.message}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={8}
          maxLength={5000}
          rows={5}
          className={`${fieldClass} resize-y`}
        />
      </div>

      <TurnstileField
        siteKey={siteKey}
        onToken={setToken}
        resetSignal={resetSignal}
      />

      {error ? (
        <p className="text-sm font-medium text-redline" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          disabled={status === "sending" || !token}
          className="inline-flex items-center justify-center bg-redline px-5 py-3 font-display text-sm font-bold tracking-[0.14em] text-paper uppercase transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-redline disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "sending" ? t.sending : t.submit}
        </button>
      </div>
    </form>
  );
}
