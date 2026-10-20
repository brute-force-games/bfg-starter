/// <reference types="vitest/config" />
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getViteConfig } from "astro/config";
import type { InlineConfig } from "vitest/node";

/**
 * A Brute Force Games site's test stages, as Vitest runs them over its Astro config: unit,
 * integration and property, each a project (tests/unit, tests/integration, tests/property), and
 * coverage of the site's own code in a fresh folder per run, held to the minimums the site gives.
 * Loaded in plain Node before any bundler (review row 8): it imports only its peer tools and
 * node:. `siteTestConfig` is the test config itself, pure; `siteVitestConfig` wraps it in Astro's.
 */

/** A coverage gate: each metric's minimum, in percent. */
export interface CoverageMinimum {
  readonly statements: number;
  readonly branches: number;
  readonly functions: number;
  readonly lines: number;
}

export interface SiteTestOptions {
  /** Coverage minimums, by the glob each holds (the site's whole code, a folder of it); none: no gate. */
  readonly coverageMinimums?: Readonly<Record<string, CoverageMinimum>>;
  /** What coverage leaves out, by glob (each with its reason, in the site's own list). */
  readonly exclusions?: readonly string[];
  /** Where this run's coverage goes: a fresh folder of its own unless given one. */
  readonly coverageFolder?: string;
}

/** The stages Vitest runs, each a project over its own folder of tests. */
const STAGES = ["unit", "integration", "property"] as const;

/** A fresh folder for one run's coverage, never a shared ./coverage another run could clear. */
const freshCoverageFolder = (): string =>
  join(tmpdir(), `bfg-site-coverage-${String(process.pid)}-${String(Date.now())}`);

export function siteTestConfig({
  coverageMinimums = {},
  exclusions = [],
  coverageFolder = freshCoverageFolder(),
}: SiteTestOptions = {}): InlineConfig {
  return {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    // No results cache: it's one file every run reads and writes, and runs side by side must not
    // share state.
    cache: false,
    projects: STAGES.map((stage) => ({
      extends: true,
      test: { name: stage, include: [`tests/${stage}/**/*.test.{ts,tsx}`] },
    })),
    coverage: {
      reportsDirectory: coverageFolder,
      reporter: ["text-summary", "json-summary", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [...exclusions],
      thresholds: { ...coverageMinimums },
    },
  };
}

/** The site's Vitest config: its test stages, over its own Astro config. */
export const siteVitestConfig = (options: SiteTestOptions = {}) =>
  getViteConfig({ test: siteTestConfig(options) });
