import { describeSiteConfigProblem, readSiteConfig } from "./bin/siteConfig.ts";
import { DEV_SERVER_URL_ENV } from "./playwright.ts";
import { openSiteBrowser } from "./smoke/siteBrowser.ts";
import { smokeLines, smokePasses, smokeSite, type SmokePorts } from "./smoke/smokeCheck.ts";

/**
 * The dev-server gate: Playwright's global setup (./playwright sets it), which aborts the whole
 * run before any test unless the site's dev server is healthy: the smoke check (smoke/), every page
 * answering, opening without an error and reading Ready. It says what's wrong, or how to start the
 * server. End-to-end tests never start a server of their own. Loaded in plain Node (review row 8).
 */

/**
 * Whether a dev server answers at `baseUrl`, with anything, never throwing: an error page is still
 * a server, and the smoke check says what's wrong with it.
 */
export const devServerAnswersAt = (
  baseUrl: string,
  fetchPage: typeof fetch,
): Promise<"up" | "down"> =>
  fetchPage(baseUrl).then(
    () => "up",
    () => "down",
  );

/** The gate: the site at `root`, on the dev server the run's config chose (in `env`), healthy. */
export async function devServerGate(
  env: NodeJS.ProcessEnv,
  root: string,
  ports: SmokePorts,
): Promise<void> {
  const baseUrl = env[DEV_SERVER_URL_ENV];
  if (baseUrl === undefined) {
    throw new Error(`${DEV_SERVER_URL_ENV} isn't set: is this the site setup's Playwright config?`);
  }
  const reading = readSiteConfig(root);
  if (reading.kind === "unreadable") {
    throw new Error(describeSiteConfigProblem(reading.problem));
  }
  const outcome = await smokeSite(root, reading.config, baseUrl, ports);
  if (!smokePasses(outcome)) {
    throw new Error(smokeLines(outcome).join("\n"));
  }
}

export default (): Promise<void> =>
  devServerGate(process.env, process.cwd(), {
    fetchPage: fetch,
    openBrowser: () => openSiteBrowser(process.cwd()),
  });
