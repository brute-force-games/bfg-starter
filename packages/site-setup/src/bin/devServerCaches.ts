import { join } from "node:path";

/**
 * A dev server of verify's own (`bfg-site verify --own-dev-server`) keeps its caches in its run's
 * folder, never the maintainer's (`node_modules/.astro`, `node_modules/.vite`), so it can't
 * re-bundle their running server's dependencies. verify sets this variable to the folder; the
 * Astro preset reads it. Plain node: only, so the preset can load it before any bundler.
 */
export const DEV_SERVER_CACHE_ENV = "BFG_DEV_SERVER_CACHE";

/** Astro's and Vite's caches, under one folder. */
export interface DevServerCaches {
  readonly astro: string;
  readonly vite: string;
}

export const devServerCaches = (folder: string): DevServerCaches => ({
  astro: join(folder, "astro"),
  vite: join(folder, "vite"),
});

/** The caches `env` asks for: a run's own, or undefined for the usual ones. */
export function devServerCachesFrom(
  env: Readonly<Record<string, string | undefined>>,
): DevServerCaches | undefined {
  const folder = env[DEV_SERVER_CACHE_ENV];
  return folder === undefined ? undefined : devServerCaches(folder);
}
