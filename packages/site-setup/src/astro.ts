import react from "@astrojs/react";
import type { AstroUserConfig, ViteUserConfig } from "astro";
import { devServerCachesFrom } from "./bin/devServerCaches.ts";

/**
 * A Brute Force Games site's Astro config: static pages with React islands, on its own dev port,
 * and, when it links bfg-core's packages by `file:`, the Vite settings that makes work. Loaded in
 * plain Node before any bundler (review row 8): it imports only its peer tools and node:.
 */

/**
 * What bfg-core's packages import at runtime, pre-bundled up front: Vite would otherwise find them
 * only once a page loads them, re-bundle mid-session ("504 Outdated Optimize Dep") and the page
 * would fail to hydrate. Sealing's HPKE (identity), the stores and their synchronizers
 * (multiplayer-tinybase), the logger, and the schemas and codecs every package uses.
 */
export const LINKED_RUNTIME: readonly string[] = [
  "@hpke/core",
  "cbor2",
  "tinybase",
  "tinybase/persisters/persister-indexed-db",
  "tinybase/synchronizers",
  "tinybase/synchronizers/synchronizer-ws-client",
  "zod",
];

/**
 * The packages a linked package would resolve from bfg-core's node_modules, one copy each from the
 * site's instead: one React (hooks break with two), one zod (identity checks its schemas), one
 * TinyBase (stores and synchronizers that talk to each other), one CBOR codec.
 */
export const LINKED_DEDUPE: readonly string[] = ["react", "react-dom", "zod", "tinybase", "cbor2"];

export interface SiteAstroOptions {
  /** The site's own folder (its astro.config.ts's `import.meta.dirname`). */
  root: string;
  /** Where it's served: its canonical URL; SITE_URL's if not given, else its dev server's. */
  site?: string;
  /** Its dev server's port: each site its own, so they run side by side. */
  port: number;
  /** Where the `file:`-linked bfg-core (and bfg-games) checkouts are, if it links them. */
  linked?: string;
  /** What else the site pre-bundles: what its own pages reach only by a dynamic import. */
  optimize?: readonly string[];
}

/** The variable a build reads the site's URL from, when the config doesn't give one. */
export const SITE_URL_ENV = "SITE_URL";

/** The Vite settings for packages linked from `linked`, beside a site at `root`. */
const linkedVite = (root: string, linked: string): ViteUserConfig => ({
  server: { strictPort: true, fs: { allow: [root, linked] } },
  resolve: { dedupe: [...LINKED_DEDUPE] },
});

export function siteAstroConfig(
  { root, site, port, linked, optimize = [] }: SiteAstroOptions,
  env: NodeJS.ProcessEnv = process.env,
): AstroUserConfig {
  const runtime = linked === undefined ? [] : LINKED_RUNTIME;
  // A dev server of verify's own keeps its caches in its run's folder, never the maintainer's.
  const caches = devServerCachesFrom(env);
  return {
    ...(caches === undefined ? {} : { cacheDir: caches.astro }),
    output: "static",
    site: site ?? env[SITE_URL_ENV] ?? `http://localhost:${String(port)}`,
    integrations: [react()],
    server: { port },
    vite: {
      ...(linked === undefined ? { server: { strictPort: true } } : linkedVite(root, linked)),
      ...(caches === undefined ? {} : { cacheDir: caches.vite }),
      optimizeDeps: { include: [...runtime, ...optimize] },
      // The facilitator's worker is bundled on its own, as modules.
      worker: { format: "es" },
    },
  };
}
