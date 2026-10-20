import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { smokeCommand } from "../../src/bin/smoke.ts";
import { HEALTHY } from "../fixtures/smokePages.ts";
import { configOf, fakeSite } from "./fixtures/fakeSite.ts";

/** `bfg-site smoke` (src/bin/smoke.ts): the dev server in play, page by page. */

const YOURS = "http://localhost:4330";

/** Gives the site's src/pages an index page. */
function withIndexPage(root: string): void {
  mkdirSync(join(root, "src", "pages"), { recursive: true });
  writeFileSync(join(root, "src", "pages", "index.astro"), "");
}

describe("bfg-site smoke, passing", () => {
  it("passes, saying so, when every page of your dev server is healthy", async () => {
    // Arrange
    const { site, seen } = fakeSite({ pages: { [YOURS]: HEALTHY, [`${YOURS}/`]: HEALTHY } });
    withIndexPage(site.root);
    // Act
    const status = await smokeCommand([], site, configOf());
    // Assert
    expect(status).toBe(0);
    expect(seen.said).toEqual(["Smoke: 1 pages healthy at http://localhost:4330."]);
    expect(seen.smoke.visited).toEqual([`${YOURS}/`]);
  });

  it("checks the dev server E2E_BASE_URL names, as verify's own", async () => {
    // Arrange
    const own = "http://localhost:4999";
    const { site, seen } = fakeSite(
      { pages: { [own]: HEALTHY, [`${own}/`]: HEALTHY } },
      { E2E_BASE_URL: own },
    );
    withIndexPage(site.root);
    // Act
    const status = await smokeCommand([], site, configOf());
    // Assert
    expect(status).toBe(0);
    expect(seen.smoke.visited).toEqual([`${own}/`]);
  });

});

describe("bfg-site smoke, failing", () => {
  it("fails, complaining of each failed page, when one isn't", async () => {
    // Arrange
    const { site, seen } = fakeSite({
      pages: { [YOURS]: HEALTHY, [`${YOURS}/`]: { ...HEALTHY, status: 500 } },
    });
    withIndexPage(site.root);
    // Act
    const status = await smokeCommand([], site, configOf());
    // Assert
    expect(status).toBe(1);
    expect(seen.complained[0]).toBe("  ✗ /: HTTP 500");
  });

  it("fails when no dev server answers, never starting one", async () => {
    // Arrange
    const { site, seen } = fakeSite();
    // Act
    const status = await smokeCommand([], site, configOf());
    // Assert
    expect(status).toBe(1);
    expect(seen.complained).toEqual([
      "No dev server at http://localhost:4330. Start it with `npm run dev`, then run this again.",
    ]);
    expect(seen.started).toEqual([]);
  });

  it("takes no arguments", async () => {
    const { site, seen } = fakeSite();
    await expect(smokeCommand(["--fast"], site, configOf())).resolves.toBe(2);
    expect(seen.complained).toEqual(["Usage: bfg-site smoke"]);
  });
});
