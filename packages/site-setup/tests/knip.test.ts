import { CONTENT_ENTRIES, DEAD_CODE_RULES, siteKnipConfig } from "../src/knip.ts";

/** A site's dead-code check (src/knip.ts): every kind held at zero, and what knip can't follow. */

describe("a site's knip config", () => {
  it("holds every kind of dead code at zero, its content collections an entry", () => {
    // Act
    const config = siteKnipConfig();
    // Assert
    expect(config).toEqual({
      entry: [...CONTENT_ENTRIES],
      ignore: [],
      ignoreDependencies: [],
      rules: DEAD_CODE_RULES,
    });
    expect(new Set(Object.values(DEAD_CODE_RULES))).toEqual(new Set(["error"]));
  });

  it("adds the site's own entries, ignored files and packages run by name", () => {
    // Act
    const config = siteKnipConfig({
      entry: ["src/routes/Injected.astro"],
      ignore: ["src/generated/**"],
      ignoreDependencies: ["sarif-explorer"],
    });
    // Assert
    expect(config).toMatchObject({
      entry: [...CONTENT_ENTRIES, "src/routes/Injected.astro"],
      ignore: ["src/generated/**"],
      ignoreDependencies: ["sarif-explorer"],
    });
  });
});
