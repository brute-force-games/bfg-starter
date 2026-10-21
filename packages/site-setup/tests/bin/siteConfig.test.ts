import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  describeSiteConfigProblem,
  readSiteConfig,
  type SiteConfigProblem,
} from "../../src/bin/siteConfig.ts";
import { fakeSite } from "./fixtures/fakeSite.ts";

/** The site's bfg-site.json (src/bin/siteConfig.ts): read with its defaults, or why it can't be. */

describe("a site's config", () => {
  it("is read with its defaults filled in", () => {
    // Arrange
    const { site } = fakeSite();
    writeFileSync(join(site.root, "bfg-site.json"), JSON.stringify({ devServerPort: 4330 }));
    // Act
    const reading = readSiteConfig(site.root);
    // Assert
    expect(reading).toEqual({
      kind: "read",
      config: {
        devServerPort: 4330,
        qualityFolder: "docs/quality",
        sources: ["src", "scripts"],
        staticChecks: [],
        unitProject: "unit",
        formatIgnoreFiles: [".gitignore"],
        smokePages: [],
        smokeSkip: [],
      },
    });
  });

  it("reads the site's games module", () => {
    // Arrange
    const { site } = fakeSite();
    const games = { games: "./src/games/registry.ts" };
    writeFileSync(
      join(site.root, "bfg-site.json"),
      JSON.stringify({ devServerPort: 4330, ...games }),
    );
    // Act
    const reading = readSiteConfig(site.root);
    // Assert
    expect(reading).toMatchObject({ kind: "read", config: games });
  });
});

describe("a site's config, unreadable", () => {
  it("can't be read when it's missing", () => {
    // Arrange
    const { site } = fakeSite();
    // Act
    const reading = readSiteConfig(site.root);
    // Assert
    expect(reading).toEqual({
      kind: "unreadable",
      problem: { kind: "missing", path: join(site.root, "bfg-site.json") },
    });
  });

  it.each([
    { what: "not JSON", file: "{", kind: "not-json" },
    { what: "without a port", file: "{}", kind: "invalid" },
  ])("can't be read when $what", ({ file, kind }) => {
    // Arrange
    const { site } = fakeSite();
    const path = join(site.root, "bfg-site.json");
    writeFileSync(path, file);
    // Act
    const reading = readSiteConfig(site.root);
    // Assert
    expect(reading).toMatchObject({ kind: "unreadable", problem: { kind, path } });
  });
});

describe("what a site's config problem says", () => {
  it.each<{ problem: SiteConfigProblem; words: string }>([
    {
      problem: { kind: "missing", path: "/s/bfg-site.json" },
      words: "No bfg-site.json at /s/bfg-site.json.",
    },
    {
      problem: { kind: "not-json", path: "/s/bfg-site.json" },
      words: "/s/bfg-site.json isn't JSON.",
    },
    {
      problem: { kind: "invalid", path: "/s/bfg-site.json", issues: "✖ devServerPort" },
      words: "/s/bfg-site.json isn't a site config:\n✖ devServerPort",
    },
  ])("says why: $problem.kind", ({ problem, words }) => {
    // Act
    const described = describeSiteConfigProblem(problem);
    // Assert
    expect(described).toContain(words);
  });
});
