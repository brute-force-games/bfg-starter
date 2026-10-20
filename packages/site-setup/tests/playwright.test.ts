import { existsSync } from "node:fs";
import { devices } from "@playwright/test";
import { tmpdir } from "node:os";
import { runtimeImportsOf } from "./fixtures/imports.ts";
import { DEV_SERVER_GATE, playwrightConfigOf, sitePlaywrightConfig } from "../src/playwright.ts";

/** A site's end-to-end config (src/playwright.ts): its dev server, gated; one worker; its run's folder. */

const SITE = { port: 4330, devices };
const RUN = { outputDir: "/runs/e2e", baseUrl: "http://localhost:4330" };

describe("a site's e2e config", () => {
  it("tests the dev server the run chose, never starting one, and gates the run on it", () => {
    // Act
    const config = playwrightConfigOf(SITE, RUN);
    // Assert
    expect(config).toMatchObject({
      testDir: "tests/e2e",
      outputDir: "/runs/e2e",
      globalSetup: DEV_SERVER_GATE,
      workers: 1,
      fullyParallel: false,
      reporter: [["list"]],
      use: { baseURL: "http://localhost:4330", trace: "retain-on-failure" },
    });
    expect(config.webServer).toBeUndefined();
    expect(config.projects).toEqual([{ name: "chromium", use: { ...devices["Desktop Chrome"] } }]);
    expect(existsSync(DEV_SERVER_GATE)).toBe(true);
  });

  it("takes the site's own browsers and timeouts", () => {
    // Act
    const config = playwrightConfigOf(
      { ...SITE, projects: [{ name: "solo" }], timeout: 5, expectTimeout: 1 },
      RUN,
    );
    // Assert
    expect(config).toMatchObject({ projects: [{ name: "solo" }], timeout: 5, expect: { timeout: 1 } });
  });
});

describe("a site's e2e config, this run's", () => {
  it("makes the run's folder once, and leaves it and the site's dev server for the workers and the gate", () => {
    // Arrange
    const env: NodeJS.ProcessEnv = {};
    // Act
    const config = sitePlaywrightConfig(SITE, env);
    // Assert
    const made = env["E2E_RUN_DIR"];
    if (made === undefined) {
      throw new Error("no output folder was made");
    }
    expect(config.outputDir).toBe(made);
    expect(made.startsWith(tmpdir())).toBe(true);
    expect(existsSync(made)).toBe(true);
    expect(env["E2E_BASE_URL"]).toBe("http://localhost:4330");
    expect(config.use?.baseURL).toBe("http://localhost:4330");
  });

  it("keeps a folder the main process made, and goes where E2E_BASE_URL says", () => {
    // Act
    const config = sitePlaywrightConfig(SITE, {
      E2E_RUN_DIR: "/runs/given",
      E2E_BASE_URL: "http://127.0.0.1:9999",
    });
    // Assert
    expect(config).toMatchObject({ outputDir: "/runs/given", use: { baseURL: "http://127.0.0.1:9999" } });
  });

  it("adds Playwright's HTML report to a verify's run folder", () => {
    // Act
    const config = sitePlaywrightConfig(SITE, { E2E_RUN_DIR: "/runs/given", BFG_REPORT_DIR: "/reports/run" });
    // Assert
    expect(config.reporter).toEqual([["list"], ["html", { outputFolder: "/reports/run/e2e", open: "never" }]]);
  });
});

describe("the preset's imports", () => {
  it("takes only Playwright's types, never its code, so a site's runner loads one copy", () => {
    // A runtime import would resolve from bfg-starter's node_modules when a site links the setup
    // by file:, and Playwright refuses a second copy of itself.
    expect(runtimeImportsOf(new URL("../src/playwright.ts", import.meta.url), "@playwright/test")).toEqual([]);
  });
});
