import { tmpdir } from "node:os";
import { siteTestConfig, siteVitestConfig } from "../src/vitest.ts";

/** A site's test stages (src/vitest.ts): the three projects, and coverage in a folder per run. */

describe("a site's test config", () => {
  it("runs the unit, integration and property stages, each over its own tests", () => {
    // Act
    const config = siteTestConfig();
    // Assert
    expect(config.projects).toEqual([
      { extends: true, test: { name: "unit", include: ["tests/unit/**/*.test.{ts,tsx}"] } },
      { extends: true, test: { name: "integration", include: ["tests/integration/**/*.test.{ts,tsx}"] } },
      { extends: true, test: { name: "property", include: ["tests/property/**/*.test.{ts,tsx}"] } },
    ]);
    expect(config).toMatchObject({ environment: "jsdom", globals: true, cache: false });
  });

  it("writes each run's coverage to a fresh folder of its own, with no gate unless given", () => {
    // Act
    const coverage = siteTestConfig().coverage;
    // Assert
    expect(coverage?.reportsDirectory?.startsWith(tmpdir())).toBe(true);
    expect(coverage).toMatchObject({ include: ["src/**/*.{ts,tsx}"], exclude: [], thresholds: {} });
  });

  it("holds coverage to the site's minimums, leaving out its exclusions", () => {
    // Arrange
    const minimum = { statements: 95, branches: 90, functions: 95, lines: 95 };
    // Act
    const coverage = siteTestConfig({
      coverageMinimums: { "src/**": minimum },
      exclusions: ["src/**/*.stories.tsx"],
      coverageFolder: "/runs/one",
    }).coverage;
    // Assert
    expect(coverage).toMatchObject({
      reportsDirectory: "/runs/one",
      exclude: ["src/**/*.stories.tsx"],
      thresholds: { "src/**": minimum },
    });
  });
});

describe("a site's Vitest config", () => {
  it("is Astro's, with the site's test stages in it", () => {
    expect(siteVitestConfig()).toBeTypeOf("function");
  });
});
