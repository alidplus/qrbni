"use client";

import { useEffect, useRef } from "react";
import type { Locale } from "@/i18n/config";

type Props = {
  locale: Locale;
  defaultOpen?: boolean;
};

const copy = {
  en: {
    title: "Privacy",
    paragraphs: [
      "This is a personal public website. If you use the contact form, your name, contact details, and message are stored in NocoDB so I can reply.",
      "Cloudflare Turnstile protects the form from bots. Your IP may be processed during verification; a hashed form may be kept for abuse triage.",
      "Cloudflare Web Analytics is used without advertising cookies.",
    ],
  },
  fa: {
    title: "حریم خصوصی",
    paragraphs: [
      "این سایت یک وب‌سایت شخصی عمومی است. اگر از فرم تماس استفاده کنید، نام، راه ارتباطی و پیام شما در NocoDB ذخیره می‌شود تا بتوانم پاسخ بدهم.",
      "برای جلوگیری از اسپم از Cloudflare Turnstile استفاده می‌شود. آدرس IP ممکن است هنگام تأیید Turnstile پردازش شود؛ نسخه هش‌شده برای عیب‌یابی نگهداری می‌شود.",
      "از Cloudflare Web Analytics بدون کوکی‌های تبلیغاتی استفاده می‌شود.",
    ],
  },
} as const;

/** Expandable privacy notice — opens for #privacy / ?privacy=1. */
export function PrivacyDisclosure({ locale, defaultOpen = false }: Props) {
  const t = copy[locale];
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const openIfTargeted = () => {
      const hash = window.location.hash === "#privacy";
      const query = new URLSearchParams(window.location.search).has("privacy");
      if ((hash || query || defaultOpen) && detailsRef.current) {
        detailsRef.current.open = true;
        if (hash) detailsRef.current.scrollIntoView({ block: "nearest" });
      }
    };
    openIfTargeted();
    window.addEventListener("hashchange", openIfTargeted);
    return () => window.removeEventListener("hashchange", openIfTargeted);
  }, [defaultOpen]);

  return (
    <details
      ref={detailsRef}
      id="privacy"
      className="group border-t border-ink/10 pt-6"
      open={defaultOpen || undefined}
    >
      <summary className="cursor-pointer list-none font-display text-xs font-semibold tracking-[0.14em] text-slate uppercase marker:content-none [&::-webkit-details-marker]:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-redline">
        <span className="inline-flex items-center gap-2 hover:text-ink">
          <span
            aria-hidden
            className="text-redline transition-transform group-open:rotate-90"
          >
            /
          </span>
          {t.title}
        </span>
      </summary>
      <div className="mt-4 space-y-3 text-base leading-relaxed text-slate">
        {t.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </details>
  );
}
