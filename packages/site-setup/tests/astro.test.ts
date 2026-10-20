import type { AstroUserConfig } from "astro";
import { readdirSync, readFileSync } from "node:fs";
import { LINKED_DEDUPE, LINKED_RUNTIME, SETUP_RUNTIME, SOURCE_PACKAGES, siteAstroConfig } from "../src/astro.ts";

/** A site's Astro config (src/astro.ts): static, React, its port; linked packages' Vite settings. */

const SITE = { root: "/sites/one", site: "https://one.example", port: 4400 };

/** The names of a config's integrations; a config with none fails the test. */
function integrationNames(config: AstroUserConfig): string[] {
  const { integrations } = config;
  if (integrations === undefined) {
    throw new Error("the config has no integrations");
  }
  return integrations.flat().flatMap((integration) => (integration ? [integration.name] : []));
}

describe("a site's Astro config", () => {
  it("is static pages with React islands, at its URL, on its own port", () => {
    // Act
    const config = siteAstroConfig(SITE);
    // Assert
    expect(config).toMatchObject({
      output: "static",
      site: "https://one.example",
      server: { port: 4400 },
      vite: { server: { strictPort: true }, optimizeDeps: { include: [...SETUP_RUNTIME] }, worker: { format: "es" } },
    });
    expect(integrationNames(config)).toEqual(["@astrojs/react"]);
  });

  it("pre-bundles what the site’s own pages reach only by a dynamic import", () => {
    expect(siteAstroConfig({ ...SITE, optimize: ["mermaid"] }).vite?.optimizeDeps?.include).toEqual([
      ...SETUP_RUNTIME,
      "mermaid",
    ]);
  });
});

describe("a site's Astro config, its URL", () => {
  const UNNAMED = { root: "/sites/one", port: 4400 };
  const FROM_ENV = { SITE_URL: "https://env.example" };

  it.each([
    { given: "the config's", options: SITE, env: FROM_ENV, url: "https://one.example" },
    { given: "SITE_URL's", options: UNNAMED, env: FROM_ENV, url: "https://env.example" },
    { given: "its dev server's", options: UNNAMED, env: {}, url: "http://localhost:4400" },
  ])("is $given when that's the first there is", ({ options, env, url }) => {
    expect(siteAstroConfig(options, env).site).toBe(url);
  });
});

describe("a site's Astro config, linking bfg-core's packages", () => {
  it("serves the linked checkouts, one copy of the shared packages, their runtime pre-bundled", () => {
    // Act
    const config = siteAstroConfig({ ...SITE, linked: "/sites", optimize: ["mermaid"] });
    // Assert
    expect(config.vite?.server).toEqual({ strictPort: true, fs: { allow: ["/sites/one", "/sites"] } });
    expect(config.vite?.resolve?.dedupe).toEqual([...LINKED_DEDUPE]);
    expect(config.vite?.optimizeDeps?.include).toEqual([...SETUP_RUNTIME, ...LINKED_RUNTIME, "mermaid"]);
  });
});

describe("a site's Astro config, on a dev server of verify's own", () => {
  it("keeps Astro's and Vite's caches in the run's folder", () => {
    // Act
    const config = siteAstroConfig(SITE, { BFG_DEV_SERVER_CACHE: "/runs/one/dev-server" });
    // Assert
    expect(config.cacheDir).toBe("/runs/one/dev-server/astro");
    expect(config.vite?.cacheDir).toBe("/runs/one/dev-server/vite");
  });

  it("leaves the usual caches alone otherwise", () => {
    // Act
    const config = siteAstroConfig(SITE, {});
    // Assert
    expect(config.cacheDir).toBeUndefined();
    expect(config.vite?.cacheDir).toBeUndefined();
  });
});

/** The package a bare optimize entry names: `tinybase` for `tinybase/synchronizers`, a scope kept. */
const packageOf = (entry: string): string =>
  entry.split("/").slice(0, entry.startsWith("@") ? 2 : 1).join("/");

describe("the linked runtime's entries", () => {
  it("are each, if bare, a package the site dedupes, so they resolve to the site's one copy", () => {
    const bare = LINKED_RUNTIME.filter((entry) => !entry.includes(" > "));
    expect(bare.map((entry) => packageOf(entry)).filter((name) => !LINKED_DEDUPE.includes(name))).toEqual([]);
  });

  it("name what only a linked package uses through it, Vite's nested form", () => {
    expect(LINKED_RUNTIME).toContain("@brute-force-games/identity > @hpke/core");
  });
});

describe("a site's Astro config, its packages in dev SSR", () => {
  it.each([
    { what: "linking bfg-core", options: { ...SITE, linked: "/sites" } },
    { what: "linking nothing (the setup's own components still come from source)", options: SITE },
  ])("compiles every Brute Force Games package for SSR, never leaves it to Node: $what", ({ options }) => {
    expect(siteAstroConfig(options, {}).vite?.ssr?.noExternal).toEqual([SOURCE_PACKAGES]);
  });

  it.each([
    { name: "@brute-force-games/room-view", source: true },
    { name: "@brute-force-games/site-setup/components/PageReadyStatus", source: true },
    { name: "react", source: false },
    { name: "@astrojs/react", source: false },
  ])("counts $name as a source package: $source", ({ name, source }) => {
    expect(SOURCE_PACKAGES.test(name)).toBe(source);
  });
});

/** The packages the setup's components import (src/components/): third-party, by package name. */
function componentPackages(): string[] {
  const folder = new URL("../src/components/", import.meta.url);
  const specs = readdirSync(folder).flatMap((file) =>
    [...readFileSync(new URL(file, folder), "utf8").matchAll(/\bfrom\s+"([^".][^"]*)"/gu)].map(([, spec]) => String(spec)),
  );
  const names = specs
    .filter((spec) => !SOURCE_PACKAGES.test(spec))
    .map((spec) => spec.split("/").slice(0, spec.startsWith("@") ? 2 : 1).join("/"));
  return [...new Set(names)].toSorted();
}

describe("what the setup's own components need, pre-bundled", () => {
  it("is in every site's config, linked or not, so a first visit never re-optimizes", () => {
    expect(siteAstroConfig(SITE, {}).vite?.optimizeDeps?.include).toEqual(expect.arrayContaining([...SETUP_RUNTIME]));
    expect(siteAstroConfig({ ...SITE, linked: "/sites" }, {}).vite?.optimizeDeps?.include).toEqual(
      expect.arrayContaining([...SETUP_RUNTIME]),
    );
  });

  it("covers every third-party package the components import", () => {
    expect(componentPackages()).toEqual([...SETUP_RUNTIME].toSorted());
  });
});
