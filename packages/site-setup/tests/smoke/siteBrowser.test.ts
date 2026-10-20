import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromiumOf, siteChromium } from "../../src/smoke/siteBrowser.ts";

/**
 * Finding the site's own Playwright (src/smoke/siteBrowser.ts); its browser, opening pages, is the
 * browser project's (tests/browser/smoke.test.ts).
 */

describe("the site's own Chromium", () => {
  it("comes from the site's install", () => {
    // Act: this repo's root has @playwright/test installed.
    const chromium = siteChromium(process.cwd());
    // Assert
    expect(chromium.name()).toBe("chromium");
  });

  it("says to install Playwright when the site has none", () => {
    // Arrange
    const root = mkdtempSync(join(tmpdir(), "bfg-site-no-playwright-"));
    // Act, Assert
    expect(() => siteChromium(root)).toThrow(`No @playwright/test in ${root}`);
  });
});

describe("the Chromium in a Playwright module", () => {
  const chromium = { launch: () => undefined };

  it.each([
    {
      what: "a function carrying it (Playwright's `test`)",
      module: Object.assign(() => undefined, { chromium }),
    },
    { what: "an object carrying it", module: { chromium } },
  ])("is found in $what", ({ module }) => {
    expect(chromiumOf(module)).toBe(chromium);
  });

  it.each([
    { what: "nothing", module: null },
    { what: "a string", module: "playwright" },
    { what: "an object without it", module: { firefox: chromium } },
    { what: "a Chromium that can't launch", module: { chromium: {} } },
    { what: "a Chromium that isn't an object", module: { chromium: "chromium" } },
    { what: "a missing Chromium", module: { chromium: null } },
  ])("isn't found in $what", ({ module }) => {
    expect(() => chromiumOf(module)).toThrow();
  });
});
