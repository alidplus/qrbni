import type { Locale } from "@/i18n/config";
import { SiteHeader } from "@/ui/organisms/SiteHeader";

type Props = { locale: Locale };

export function PrivacyPin({ locale }: Props) {
  const isFa = locale === "fa";

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader locale={locale} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-8 lg:py-16">
        <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-ink uppercase sm:text-5xl">
          {isFa ? "حریم خصوصی" : "Privacy"}
        </h1>

        <div
          className="pin-sheet pin-settle relative mt-10 space-y-5 px-7 py-10 text-base leading-relaxed text-ink sm:px-10"
          style={{ ["--pin-rot" as string]: "-0.3deg" }}
        >
          <span
            aria-hidden
            className="tape absolute -top-1 start-8 h-3 w-12 -rotate-2"
          />
          {isFa ? (
            <>
              <p>
                این سایت یک وب‌سایت شخصی عمومی است. اگر از فرم تماس استفاده کنید، نام، راه
                ارتباطی و پیام شما در NocoDB ذخیره می‌شود تا بتوانم پاسخ بدهم.
              </p>
              <p>
                برای جلوگیری از اسپم از Cloudflare Turnstile استفاده می‌شود. آدرس IP ممکن
                است هنگام تأیید Turnstile پردازش شود؛ نسخه هش‌شده برای عیب‌یابی نگهداری
                می‌شود.
              </p>
              <p>از Cloudflare Web Analytics بدون کوکی‌های تبلیغاتی استفاده می‌شود.</p>
            </>
          ) : (
            <>
              <p>
                This is a personal public website. If you use the contact form, your name,
                contact details, and message are stored in NocoDB so I can reply.
              </p>
              <p>
                Cloudflare Turnstile protects the form from bots. Your IP may be processed
                during verification; a hashed form may be kept for abuse triage.
              </p>
              <p>Cloudflare Web Analytics is used without advertising cookies.</p>
            </>
          )}
          <p
            aria-hidden
            className="redline-mark pt-2 font-display text-xs font-bold tracking-[0.2em] uppercase"
          >
            NOTICE
          </p>
        </div>
      </main>
    </div>
  );
}
