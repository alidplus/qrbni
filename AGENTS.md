# Agent instructions

This repository is **qrbni.dev** — Ali Ghorbani’s public site.

1. **Read [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)** before meaningful work. Cursor rules under `.cursor/rules/` reinforce it.
2. **Impeccable** owns design (`/impeccable`, `PRODUCT.md` / `DESIGN.md` once initialized).
3. **NocoDB** is the CMS (MCP + REST). **Hey API** generates the server-only typed SDK; commit codegen output; never put the API token in the browser.
4. **Git:** `feat/*` for parallel work → `main` (preview) → **tags** for production on Cloudflare Workers (OpenNext).
5. **Commits:** Conventional Commits; agents auto-commit coherent units.
6. **Turnstile:** see `turnstile.md` (existing widget).
7. Prefer Context7 for library docs; Cloudflare MCP for platform; NocoDB MCP for schema/data.

Do not delete NocoDB tables/columns without user confirmation.
