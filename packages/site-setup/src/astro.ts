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
 * would fail to hydrate. Sealing's HPKE (identity), seeded randomness's HKDF and HMAC streams
 * (shared-types), the stores and their synchronizers (multiplayer-tinybase), and the schemas and
 * codecs every package uses.
 *
 * A bare entry (`zod`, `tinybase/synchronizers`) resolves from the site, so its package must be in
 * LINKED_DEDUPE (one copy, the site's); a package only a linked package uses, which the site
 * needn't install, is named through it, Vite's nested form: `"@brute-force-games/identity >
 * @hpke/core"`.
 */
export const LINKED_RUNTIME: readonly string[] = [
  "@brute-force-games/identity > @hpke/core",
  "@brute-force-games/shared-types > @noble/hashes/hkdf.js",
  "@brute-force-games/shared-types > @noble/hashes/hmac.js",
  "@brute-force-games/shared-types > @noble/hashes/sha2.js",
  "cbor2",
  "tinybase",
  "tinybase/persisters/persister-indexed-db",
  "tinybase/synchronizers",
  "tinybase/synchronizers/synchronizer-ws-client",
  "zod",
];

/**
 * What the setup's own components (src/components/, its PageReadyStatus island) import from
 * outside Brute Force Games' packages, pre-bundled for every site, linked or not: Vite would
 * otherwise find them on a site's first page load, re-optimize, and reload the page mid-use. A
 * test holds this list to the components' imports.
 */
export const SETUP_RUNTIME: readonly string[] = ["react"];

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
  /**
   * What else the site pre-bundles: what its own pages reach only by a dynamic import. A package
   * the site doesn't install, through the linked one that uses it: `"@brute-force-games/room >
   * some-lib"`.
   */
  optimize?: readonly string[];
}

/** The variable a build reads the site's URL from, when the config doesn't give one. */
export const SITE_URL_ENV = "SITE_URL";

/** The Vite settings for packages linked from `linked`, beside a site at `root`. */
/**
 * Brute Force Games' packages: every one exports its TypeScript sources (extensionless imports
 * and all), so Vite must compile them for the dev server's SSR as well as the browser. Left
 * external, Node loads them itself and can't resolve their imports (a 500 on every page in dev;
 * a build bundles them, so it passes). The setup's own components are among them.
 */
export const SOURCE_PACKAGES = /^@brute-force-games\//u;

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
      optimizeDeps: { include: [...SETUP_RUNTIME, ...runtime, ...optimize] },
      ssr: { noExternal: [SOURCE_PACKAGES] },
      // The facilitator's worker is bundled on its own, as modules.
      worker: { format: "es" },
    },
  };
}
