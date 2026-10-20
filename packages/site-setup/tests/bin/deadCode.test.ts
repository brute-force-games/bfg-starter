import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { deadCodeGate } from "../../src/bin/deadCode.ts";
import { configOf, fakeSite } from "./fixtures/fakeSite.ts";

/** `bfg-site dead-code` (src/bin/deadCode.ts): knip's findings against the site's baseline file. */

const KNIP = "knip --reporter json --no-progress";
const knipFinding = (exports: number, files: number): string =>
  JSON.stringify({
    issues: [
      {
        file: "a.ts",
        exports: Array.from({ length: exports }, String),
        files: Array.from({ length: files }, String),
      },
    ],
  });
const CONFIG = configOf();

/** The site's baseline file, written with `baseline`. */
function withBaseline(root: string, baseline: object): string {
  const folder = join(root, "docs", "quality");
  mkdirSync(folder, { recursive: true });
  const path = join(folder, "dead-code-baseline.json");
  writeFileSync(path, JSON.stringify(baseline));
  return path;
}

describe("the dead-code gate, run", () => {
  it("holds a site without a baseline to zero", () => {
    // Arrange
    const { site, seen } = fakeSite({ outputs: { [KNIP]: knipFinding(1, 0) } });
    // Act
    const code = deadCodeGate(site, CONFIG);
    // Assert
    expect(code).toBe(1);
    expect(seen.complained).toHaveLength(1);
    expect(seen.said).toEqual([]);
  });

  it("lowers the baseline it's under, writing it whole, and passes", () => {
    // Arrange
    const { site, seen } = fakeSite({ outputs: { [KNIP]: knipFinding(1, 0) } });
    const path = withBaseline(site.root, { exports: 4, types: 0 });
    // Act
    const code = deadCodeGate(site, CONFIG);
    // Assert
    expect(code).toBe(0);
    expect(JSON.parse(readFileSync(path, "utf8"))).toEqual({ exports: 1, types: 0 });
    expect(seen.said).toEqual([
      "knip: unused exports baseline lowered, 4 → 1.",
      "knip: no dead code held at zero; 1 unused exports and 0 unused types, within their baseline.",
    ]);
  });

  it("leaves a baseline it's at alone", () => {
    // Arrange
    const { site } = fakeSite({ outputs: { [KNIP]: knipFinding(1, 0) } });
    const path = withBaseline(site.root, { exports: 1, types: 0 });
    const before = readFileSync(path, "utf8");
    // Act
    deadCodeGate(site, CONFIG);
    // Assert
    expect(readFileSync(path, "utf8")).toBe(before);
  });
});
