import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// ISR cache: start with defaults; wire KV/R2 bindings in wrangler when ready.
export default defineCloudflareConfig();
