"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        options: {
          sitekey: string;
          action?: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

type Props = {
  siteKey: string;
  onToken: (token: string | null) => void;
  resetSignal: number;
};

export function TurnstileField({ siteKey, onToken, resetSignal }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useEffect(() => {
    let cancelled = false;

    const mount = () => {
      if (cancelled || !hostRef.current || !window.turnstile) return;
      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
      hostRef.current.innerHTML = "";
      widgetIdRef.current = window.turnstile.render(hostRef.current, {
        sitekey: siteKey,
        action: "turnstile-spin-v2",
        theme: "light",
        callback: (token) => onTokenRef.current(token),
        "expired-callback": () => onTokenRef.current(null),
        "error-callback": () => onTokenRef.current(null),
      });
    };

    if (window.turnstile) mount();
    else {
      const id = window.setInterval(() => {
        if (window.turnstile) {
          window.clearInterval(id);
          mount();
        }
      }, 50);
      return () => {
        cancelled = true;
        window.clearInterval(id);
      };
    }

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  useEffect(() => {
    if (resetSignal === 0) return;
    onToken(null);
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, [resetSignal, onToken]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
      />
      <div
        ref={hostRef}
        className="cf-turnstile min-h-[65px]"
        data-action="turnstile-spin-v2"
      />
    </>
  );
}
