import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices, type PlaywrightTestConfig, type Project } from "@playwright/test";

/**
 * A Brute Force Games site's end-to-end tests (tests/e2e/), modelled on site-bruteforce.games': a
 * real browser against the dev server its maintainer started (on its own port, or E2E_BASE_URL),
 * never one Playwright starts (`webServer` is unset), and no run at all without it (the gate,
 * devServerUp.ts). One worker; each run's output in a fresh folder of its own. Loaded in plain Node before any bundler (review row 8).
 */

/** The variable each run's output folder is in: made once, inherited by Playwright's workers. */
export const E2E_RUN_DIR_ENV = "E2E_RUN_DIR";

/**
 * The variable that points the tests at another dev server than the site's own port; the config
 * sets it to the one it chose, for the gate (devServerUp.ts).
 */
export const DEV_SERVER_URL_ENV = "E2E_BASE_URL";

export interface SitePlaywrightOptions {
  /** The site's dev server's port: where its tests go, unless E2E_BASE_URL says. */
  readonly port: number;
  /** The site's browsers; one Chrome unless given. */
  readonly projects?: readonly Project[];
  /** How long one test may take, and one expectation wait (ms). */
  readonly timeout?: number;
  readonly expectTimeout?: number;
}

/** What a run of the site's tests has: its output folder, and where its dev server is. */
export interface E2ERun {
  readonly outputDir: string;
  readonly baseUrl: string;
}

/** The dev-server gate: Playwright's global setup, by its file. */
export const DEV_SERVER_GATE = fileURLToPath(new URL("devServerUp.ts", import.meta.url));

const CHROME: readonly Project[] = [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }];

/** The site's Playwright config for `run`. */
export function playwrightConfigOf(
  { projects = CHROME, timeout = 120_000, expectTimeout = 30_000 }: SitePlaywrightOptions,
  run: E2ERun,
): PlaywrightTestConfig {
  return defineConfig({
    testDir: "tests/e2e",
    outputDir: run.outputDir,
    testMatch: "**/*.spec.ts",
    globalSetup: DEV_SERVER_GATE,
    timeout,
    expect: { timeout: expectTimeout },
    fullyParallel: false,
    workers: 1,
    reporter: [["list"]],
    use: { baseURL: run.baseUrl, trace: "retain-on-failure" },
    projects: [...projects],
  });
}

/**
 * The site's Playwright config, this run's: its output folder made fresh once (in the main
 * process; its workers read this config too, and find the folder in the environment), and its
 * dev server's address, E2E_BASE_URL's or the site's port's, left there for the gate.
 */
export function sitePlaywrightConfig(
  options: SitePlaywrightOptions,
  env: NodeJS.ProcessEnv = process.env,
): PlaywrightTestConfig {
  const outputDir = env[E2E_RUN_DIR_ENV] ?? mkdtempSync(join(tmpdir(), "bfg-site-e2e-"));
  const baseUrl = env[DEV_SERVER_URL_ENV] ?? `http://localhost:${String(options.port)}`;
  env[E2E_RUN_DIR_ENV] = outputDir;
  env[DEV_SERVER_URL_ENV] = baseUrl;
  return playwrightConfigOf(options, { outputDir, baseUrl });
}
