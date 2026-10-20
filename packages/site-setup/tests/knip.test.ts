import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { CONTENT_ENTRIES, DEAD_CODE_RULES, siteKnipConfig } from "../src/knip.ts";

/** A site's dead-code check (src/knip.ts): every kind held at zero, and what knip can't follow. */

let site = "";

beforeEach(() => {
  site = mkdtempSync(join(tmpdir(), "bfg-site-knip-"));
});

afterEach(() => {
  rmSync(site, { recursive: true, force: true });
});

describe("a site's knip config", () => {
  it("holds every kind of dead code at zero", () => {
    // Act
    const config = siteKnipConfig({ root: site });
    // Assert
    expect(config).toEqual({
      entry: [],
      ignore: [],
      ignoreDependencies: [],
      rules: DEAD_CODE_RULES,
    });
    expect(new Set(Object.values(DEAD_CODE_RULES))).toEqual(new Set(["error"]));
  });

  it("makes the content collections an entry, for a site with a content/ folder", () => {
    // Arrange
    mkdirSync(join(site, "content"));
    // Act, Assert
    expect(siteKnipConfig({ root: site }).entry).toEqual([...CONTENT_ENTRIES]);
  });

  it("adds the site's own entries, ignored files and packages run by name", () => {
    // Act
    const config = siteKnipConfig({
      entry: ["src/routes/Injected.astro"],
      ignore: ["src/generated/**"],
      ignoreDependencies: ["sarif-explorer"],
      root: site,
    });
    // Assert
    expect(config).toMatchObject({
      entry: ["src/routes/Injected.astro"],
      ignore: ["src/generated/**"],
      ignoreDependencies: ["sarif-explorer"],
    });
  });

  it("looks for content where knip runs, by default", () => {
    // The setup's own folder has no content/: no content entry.
    expect(siteKnipConfig().entry).toEqual([]);
  });
});
