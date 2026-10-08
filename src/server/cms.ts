/**
 * Soft-load CMS data for public pages.
 * Logs failures (often NocoDB 429) instead of silently returning empty.
 */
export async function loadCms<T>(
  label: string,
  load: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    const data = await load();
    if (
      (Array.isArray(data) && data.length === 0) ||
      data === null ||
      data === undefined
    ) {
      console.warn(`[cms] ${label}: empty result`);
    }
    return data;
  } catch (error) {
    console.error(`[cms] ${label} failed`, error);
    return fallback;
  }
}
