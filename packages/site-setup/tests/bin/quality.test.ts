import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { recordQuality } from "../../src/bin/quality.ts";
import { configOf, fakeSite, type FakeSite } from "./fixtures/fakeSite.ts";

/** Recording a quality run (src/bin/quality.ts) from the tools' outputs, into the site's history. */

const COUNT = { total: 10, covered: 9 };
const SUMMARY = JSON.stringify({
  total: { statements: COUNT, branches: COUNT, functions: COUNT, lines: COUNT },
});
const CONFIG = configOf();
const NO_DEAD_CODE = {
  files: 0,
  exports: 0,
  types: 0,
  enumMembers: 0,
  namespaceMembers: 0,
  duplicates: 0,
  dependencies: 0,
  devDependencies: 0,
  optionalPeerDependencies: 0,
  unlisted: 0,
  unresolved: 0,
  binaries: 0,
};
const SHA = "33904a7c0ffee00000000000000000000000beef";

/** A site whose tools report one complexity finding, no dead code and no unreachable code. */
const reporting = (): FakeSite =>
  fakeSite({
    outputs: {
      "oxlint -c .oxlintrc.complexity.json --format sarif src scripts": JSON.stringify({
        runs: [{ results: [1] }],
      }),
      "knip --reporter json --no-progress": JSON.stringify({ issues: [] }),
      "oxlint -A all -D no-unreachable -D no-unreachable-loop --format json src scripts tests":
        JSON.stringify({
          diagnostics: [],
        }),
    },
  });

/** A coverage run's folder with its summary in it. */
function summaryIn(scratch: string): string {
  const run = mkdtempSync(join(scratch, "coverage-"));
  const path = join(run, "coverage-summary.json");
  writeFileSync(path, SUMMARY);
  return path;
}

const historyOf = (root: string): unknown =>
  JSON.parse(readFileSync(join(root, "docs", "quality", "history.json"), "utf8"));

describe("recording a quality run", () => {
  it("records nothing without a coverage summary", () => {
    // Arrange
    const { site } = reporting();
    // Act
    const said = recordQuality(site, CONFIG, join(site.scratch, "none", "coverage-summary.json"));
    // Assert
    expect(said).toBe("No coverage summary (did the tests fail?): nothing recorded.");
    expect(existsSync(join(site.root, "docs"))).toBe(false);
  });

  it("adds the run's totals to the history, its SARIF kept with the run", () => {
    // Arrange
    const { site } = reporting();
    const summary = summaryIn(site.scratch);
    // Act
    recordQuality(site, CONFIG, summary);
    // Assert
    expect(historyOf(site.root)).toEqual([
      {
        date: "2026-10-20T08:00:00.000Z",
        commit: "no-commit",
        coverage: { statements: COUNT, branches: COUNT, functions: COUNT, lines: COUNT },
        complexityFindings: 1,
        deadCode: NO_DEAD_CODE,
        unreachableFindings: 0,
      },
    ]);
    expect(existsSync(join(summary, "..", "complexity.sarif"))).toBe(true);
  });

  it("names the commit git's files say, and replaces that commit's last run", () => {
    // Arrange
    const { site } = reporting();
    mkdirSync(join(site.root, ".git"));
    writeFileSync(join(site.root, ".git", "HEAD"), `${SHA}\n`);
    recordQuality(site, CONFIG, summaryIn(site.scratch));
    // Act
    const said = recordQuality(site, CONFIG, summaryIn(site.scratch));
    // Assert
    expect(historyOf(site.root)).toMatchObject([{ commit: "33904a7" }]);
    expect(said).toContain("Quality recorded in");
  });
});
