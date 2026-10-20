/// <reference types="vitest/config" />
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getViteConfig } from "astro/config";
import type { InlineConfig } from "vitest/node";
import { TEST_REPORT_DIR_ENV } from "./reports/reportRuns.ts";

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
  /**
   * Where this run's tests are reported as HTML (Vitest's html reporter), when it's one of a
   * verify's (BFG_TEST_REPORT_DIR): plain `vitest`, an IDE's runs, report nothing.
   */
  readonly testReportDir?: string;
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
  testReportDir,
}: SiteTestOptions = {}): InlineConfig {
  return {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    ...(testReportDir === undefined ? {} : { reporters: ["default", ["html", { outputDir: testReportDir }]] }),
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

/** The site's test config, this run's: its tests reported where `env` says (BFG_TEST_REPORT_DIR). */
/** The package Vitest's html reporter loads: a site that keeps test reports installs it. */
export const HTML_REPORTER_PACKAGE = "@vitest/ui";

/** Whether a package resolves from the site's folder. */
export type HasPackage = (name: string) => boolean;

/** Whether `name` resolves from the site at `root` (its node_modules, as Node looks). */
export const packageIn =
  (root: string): HasPackage =>
  (name) => {
    try {
      createRequire(join(root, "package.json")).resolve(`${name}/package.json`);
      return true;
    } catch {
      return false;
    }
  };

/** Why a run that keeps test reports can't: the html reporter's package isn't installed. */
export const missingHtmlReporter = (testReportDir: string): string =>
  `${TEST_REPORT_DIR_ENV} (${testReportDir}) asks for Vitest's HTML report, which needs ` +
  `${HTML_REPORTER_PACKAGE}: add it to the site's devDependencies, at its vitest's version.`;

export function siteTestConfigIn(
  options: SiteTestOptions,
  env: NodeJS.ProcessEnv,
  hasPackage: HasPackage = packageIn(process.cwd()),
): InlineConfig {
  const testReportDir = env[TEST_REPORT_DIR_ENV];
  if (testReportDir === undefined) {
    return siteTestConfig(options);
  }
  if (!hasPackage(HTML_REPORTER_PACKAGE)) {
    throw new Error(missingHtmlReporter(testReportDir));
  }
  return siteTestConfig({ ...options, testReportDir });
}

/** The site's Vitest config: its test stages, over its own Astro config. */
export const siteVitestConfig = (options: SiteTestOptions = {}) =>
  getViteConfig({ test: siteTestConfigIn(options, process.env) });
