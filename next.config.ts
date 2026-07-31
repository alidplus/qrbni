import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Static export is NOT used — OpenNext Workers + ISR.
};

export default nextConfig;

// Enable getCloudflareContext() during `next dev`.
// https://opennext.js.org/cloudflare/bindings#local-access-to-bindings
initOpenNextCloudflareForDev();
