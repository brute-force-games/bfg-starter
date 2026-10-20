import type { AstroUserConfig } from "astro";
import { LINKED_DEDUPE, LINKED_RUNTIME, siteAstroConfig } from "../src/astro.ts";

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
      vite: { server: { strictPort: true }, optimizeDeps: { include: [] }, worker: { format: "es" } },
    });
    expect(integrationNames(config)).toEqual(["@astrojs/react"]);
  });

  it("pre-bundles what the site’s own pages reach only by a dynamic import", () => {
    expect(siteAstroConfig({ ...SITE, optimize: ["mermaid"] }).vite?.optimizeDeps?.include).toEqual([
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
    expect(config.vite?.optimizeDeps?.include).toEqual([...LINKED_RUNTIME, "mermaid"]);
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
