import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { defineConfig } from "vitest/config";
import { z } from "zod";

/**
 * The setup's own tests (packages/site-setup/tests), held to its `coverageMinimum` (100): its
 * presets are code every site runs. The example site runs its own tests, through the presets
 * (`npm run example:test`).
 */

const setup = z
  .object({ coverageMinimum: z.number().min(0).max(100) })
  .parse(JSON.parse(readFileSync("packages/site-setup/package.json", "utf8")));

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["packages/site-setup/tests/**/*.test.ts"],
    cache: false,
    coverage: {
      // Each run in a folder of its own (`npm run test:coverage` passes one), never a shared one.
      reportsDirectory: join(tmpdir(), `bfg-starter-coverage-${String(process.pid)}-${String(Date.now())}`),
      reporter: ["text-summary", "json-summary", "html"],
      include: ["packages/site-setup/src/**/*.ts"],
      thresholds: {
        lines: setup.coverageMinimum,
        branches: setup.coverageMinimum,
        functions: setup.coverageMinimum,
        statements: setup.coverageMinimum,
      },
    },
  },
});
