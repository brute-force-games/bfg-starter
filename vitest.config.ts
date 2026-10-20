import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { defineConfig } from "vitest/config";
import { z } from "zod";

/**
 * The setup's own tests (packages/site-setup/tests), held to its `coverageMinimum` (100): its
 * presets are code every site runs. Coverage leaves out only what the user approved
 * (packages/site-setup/coverageExclusions.approved.json). The example site runs its own tests, through the presets
 * (`npm run example:test`).
 */

const setup = z
  .object({ coverageMinimum: z.number().min(0).max(100) })
  .parse(JSON.parse(readFileSync("packages/site-setup/package.json", "utf8")));

const approved = z
  .object({
    exclusions: z.array(
      z.object({
        glob: z.string(),
        reason: z.object({ kind: z.literal("astro-hook"), checkedBy: z.string() }),
      }),
    ),
  })
  .parse(JSON.parse(readFileSync("packages/site-setup/coverageExclusions.approved.json", "utf8")));

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    cache: false,
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["packages/site-setup/tests/**/*.test.{ts,tsx}"],
          exclude: ["packages/site-setup/tests/browser/**"],
        },
      },
      // The e2e helpers, in a real headless Chromium: one file at a time, so it doesn't slow the
      // unit project, and still counted toward coverage.
      {
        extends: true,
        test: {
          name: "browser",
          include: ["packages/site-setup/tests/browser/**/*.test.ts"],
          fileParallelism: false,
          testTimeout: 20_000,
        },
      },
    ],
    coverage: {
      // Each run in a folder of its own (`npm run test:coverage` passes one), never a shared one.
      reportsDirectory: join(
        tmpdir(),
        `bfg-starter-coverage-${String(process.pid)}-${String(Date.now())}`,
      ),
      reporter: ["text-summary", "json-summary", "html"],
      include: ["packages/site-setup/src/**/*.{ts,tsx}"],
      exclude: approved.exclusions.map(({ glob }) => `packages/site-setup/${glob}`),
      thresholds: {
        lines: setup.coverageMinimum,
        branches: setup.coverageMinimum,
        functions: setup.coverageMinimum,
        statements: setup.coverageMinimum,
      },
    },
  },
});
