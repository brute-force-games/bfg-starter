import { readFileSync } from "node:fs";
import { z } from "zod";

/**
 * The scripts every site starts with (the README's "The scripts a site starts with"), held in the
 * example, the site new ones are made from.
 */

const SITE_SCRIPTS = {
  dev: "astro dev",
  "check:watch": "astro check --watch",
  build: "astro build",
  typecheck: "astro sync && astro check && tsc --noEmit",
  test: "vitest run --project unit",
  "test:e2e": "playwright test",
  smoke: "bfg-site smoke",
  lint: "oxlint --type-aware && knip",
  format: "oxfmt --ignore-path .gitignore",
  "format:check": "oxfmt --check --ignore-path .gitignore",
  verify: "bfg-site verify",
};

describe("the example's scripts", () => {
  it("are every script a site starts with", () => {
    // Arrange
    const packageJson = new URL("../../../example/package.json", import.meta.url);
    // Act
    const { scripts } = z
      .object({ scripts: z.record(z.string(), z.string()) })
      .parse(JSON.parse(readFileSync(packageJson, "utf8")));
    // Assert
    expect(scripts).toMatchObject(SITE_SCRIPTS);
  });
});
