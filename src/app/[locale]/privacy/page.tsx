import Link from "next/link";
import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ locale: string }> };

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const isFa = locale === "fa";

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 prose prose-zinc">
      <Link href={`/${locale}`} className="text-sm text-zinc-500 no-underline hover:text-zinc-800">
        ← Home
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">
        {isFa ? "حریم خصوصی" : "Privacy"}
      </h1>
      {isFa ? (
        <>
          <p>
            این سایت یک وب‌سایت شخصی عمومی است. اگر از فرم تماس استفاده کنید، نام، راه
            ارتباطی و پیام شما در NocoDB ذخیره می‌شود تا بتوانم پاسخ بدهم.
          </p>
          <p>
            برای جلوگیری از اسپم از Cloudflare Turnstile استفاده می‌شود. آدرس IP ممکن است
            هنگام تأیید Turnstile پردازش شود.
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
            Cloudflare Turnstile protects the form from bots. Your IP address may be
            processed during Turnstile verification.
          </p>
          <p>Cloudflare Web Analytics is used without advertising cookies.</p>
        </>
      )}
    </main>
  );
}
