/** Shared EN/FA field helpers for seed + sync. */

export function pickLocale(value, locale) {
  if (value == null) return null;
  if (typeof value === "string") {
    return locale === "en" ? value.trim() : null;
  }
  if (typeof value === "object") {
    const raw = value[locale] ?? (locale === "fa" ? null : value.en);
    if (raw == null) return null;
    return String(raw).trim();
  }
  return String(value).trim();
}

export function pickLabel(value, locale) {
  if (Array.isArray(value)) {
    return locale === "en" ? value.join(" · ") : null;
  }
  if (value && typeof value === "object") {
    const arr = value[locale] ?? (locale === "fa" ? null : value.en);
    return Array.isArray(arr) ? arr.join(" · ") : pickLocale(arr, locale);
  }
  return null;
}

export function bulletsMarkdown(bullets, locale) {
  const list = bullets?.[locale] ?? (locale === "en" ? bullets?.en : null);
  if (!Array.isArray(list) || !list.length) return null;
  return list.map((b) => `- ${b}`).join("\n");
}

export function highlightBodies(highlights, locale) {
  if (!Array.isArray(highlights)) return [];
  return highlights
    .map((h, i) => {
      const body =
        typeof h === "string"
          ? locale === "en"
            ? h.trim()
            : null
          : pickLocale(h, locale);
      if (!body) return null;
      return { body, sort: i + 1 };
    })
    .filter(Boolean);
}
