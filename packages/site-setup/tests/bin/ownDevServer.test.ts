import { devServerCaches, devServerCachesFrom } from "../../src/bin/devServerCaches.ts";
import { ownDevServer, yourDevServerUrl } from "../../src/bin/ownDevServer.ts";

/** The dev servers e2e runs against (src/bin/ownDevServer.ts), and an own one's caches. */

describe("the dev servers e2e runs against", () => {
  it.each([
    { what: "at the site's port", env: {}, url: "http://localhost:4330" },
    {
      what: "where E2E_BASE_URL says",
      env: { E2E_BASE_URL: "http://box:9000" },
      url: "http://box:9000",
    },
  ])("finds yours $what", ({ env, url }) => {
    // Act
    const found = yourDevServerUrl(4330, env);
    // Assert
    expect(found).toBe(url);
  });

  it("starts its own beside yours, its caches in the run's folder, and tells e2e where", () => {
    // Act
    const server = ownDevServer(4999, "/run/dev-server-cache");
    // Assert
    expect(server).toEqual({
      check: {
        name: "own dev server",
        program: "npx",
        args: ["astro", "dev", "--ignore-lock", "--port", "4999"],
        env: { BFG_DEV_SERVER_CACHE: "/run/dev-server-cache" },
      },
      baseUrl: "http://localhost:4999",
      e2eEnv: { E2E_BASE_URL: "http://localhost:4999" },
    });
  });
});

describe("an own dev server's caches", () => {
  it("are Astro's and Vite's, under the run's folder", () => {
    // Act
    const caches = devServerCaches("/run/cache");
    // Assert
    expect(caches).toEqual({ astro: "/run/cache/astro", vite: "/run/cache/vite" });
  });

  it.each([
    {
      what: "the run's own, when asked",
      env: { BFG_DEV_SERVER_CACHE: "/c" },
      caches: { astro: "/c/astro", vite: "/c/vite" },
    },
    { what: "the usual ones, when not", env: {}, caches: undefined },
  ])("are $what", ({ env, caches }) => {
    // Act
    const found = devServerCachesFrom(env);
    // Assert
    expect(found).toEqual(caches);
  });
});
