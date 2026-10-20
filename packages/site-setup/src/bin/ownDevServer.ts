import { DEV_SERVER_URL_ENV } from "../playwright.ts";
import { DEV_SERVER_CACHE_ENV } from "./devServerCaches.ts";
import type { Check } from "./ports.ts";

/**
 * The dev servers e2e runs against: the maintainer's, by default, found at E2E_BASE_URL or the
 * site's port; or (`--own-dev-server`) one verify starts for the run, on a free port, and stops
 * after it. verifyRun.ts runs them; this is their plan.
 */

/** How long verify waits for its own dev server to answer before calling e2e red. */
export const OWN_DEV_SERVER_WAIT_SECONDS = 180;

/** Where the maintainer's dev server is: E2E_BASE_URL's address, or the site's port's. */
export const yourDevServerUrl = (
  port: number,
  env: Readonly<Record<string, string | undefined>>,
): string => env[DEV_SERVER_URL_ENV] ?? `http://localhost:${String(port)}`;

/** A dev server of verify's own: the check that runs it, where it answers, and what e2e is told. */
export interface OwnDevServer {
  readonly check: Check;
  readonly baseUrl: string;
  readonly e2eEnv: Readonly<Record<string, string>>;
}

/** verify's own dev server, on `port`, its caches under `cacheFolder`. */
export function ownDevServer(port: number, cacheFolder: string): OwnDevServer {
  const baseUrl = `http://localhost:${String(port)}`;
  return {
    check: {
      name: "own dev server",
      program: "npx",
      // Beside the maintainer's: Astro allows one dev server per project unless told to ignore its
      // lock file, which this one then neither reads nor writes.
      args: ["astro", "dev", "--ignore-lock", "--port", String(port)],
      env: { [DEV_SERVER_CACHE_ENV]: cacheFolder },
    },
    baseUrl,
    e2eEnv: { [DEV_SERVER_URL_ENV]: baseUrl },
  };
}
