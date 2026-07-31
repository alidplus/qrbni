/**
 * NocoDB Hey API client wrapper — wired after `npm run codegen`.
 * Token and base URL must never reach the browser.
 */
export async function getNocoClient() {
  throw new Error(
    "NocoDB client not generated yet. Create tables, then run npm run codegen.",
  );
}
