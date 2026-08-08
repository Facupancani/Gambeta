import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// Setup per the official Next.js 16 Vitest guide
// (node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md).
// Only unit/logic-layer tests live here — async Server Components aren't
// supported by Vitest (per that same guide), so page-level flows are
// covered by Playwright instead (see playwright.config.ts).
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    exclude: ["**/node_modules/**", "**/e2e/**"],
    // Default "forks" pool spawns child processes and timed out here —
    // the repo path has a space in it ("Botines E-commerce"), which is a
    // known trigger for Windows process-spawning issues. "threads" uses
    // worker_threads instead (no subprocess spawn), which sidesteps it.
    pool: "threads",
  },
});
