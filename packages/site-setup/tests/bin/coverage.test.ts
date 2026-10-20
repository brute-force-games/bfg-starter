import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { coverageRun, readCoverageAsk, type CoverageAsk } from "../../src/bin/coverage.ts";
import type { Check } from "../../src/bin/ports.ts";
import { configOf, fakeSite } from "./fixtures/fakeSite.ts";

/** `bfg-site coverage` (src/bin/coverage.ts): the unit tests with coverage, the ratchet, the record. */

const CONFIG = configOf();
const UNIT = "unit tests, with coverage";
const ASK: CoverageAsk = { record: false, runReports: undefined, vitestArgs: [] };
const MINIMUMS = { statements: 80, functions: 80, branches: 80, lines: 80 };

const REPORTS_DIRECTORY = "--coverage.reportsDirectory=";

/** Vitest's summary of a run that covered `covered`%, written where the run's check says, as Vitest would. */
const writesSummary =
  (covered: number) =>
  (check: Check): void => {
    const folder = check.args
      .filter((arg) => arg.startsWith(REPORTS_DIRECTORY))
      .join("")
      .slice(REPORTS_DIRECTORY.length);
    mkdirSync(folder, { recursive: true });
    const metric = { total: 100, covered };
    writeFileSync(
      join(folder, "coverage-summary.json"),
      JSON.stringify({
        total: { statements: metric, branches: metric, functions: metric, lines: metric },
      }),
    );
  };

/** The site's minimums file, written. */
function withMinimums(root: string): string {
  mkdirSync(join(root, "docs", "quality"), { recursive: true });
  const path = join(root, "docs", "quality", "coverage-minimum.json");
  writeFileSync(path, JSON.stringify(MINIMUMS));
  return path;
}

describe("reading a coverage run's arguments", () => {
  it("takes the record flag and verify's folder, and leaves the rest to Vitest", () => {
    // Act
    const ask = readCoverageAsk(["--record", "--reports=/r/run", "tests/unit/a.test.ts"]);
    // Assert
    expect(ask).toEqual({
      record: true,
      runReports: "/r/run",
      vitestArgs: ["tests/unit/a.test.ts"],
    });
  });
});

describe("a coverage run", () => {
  it("runs the unit project with coverage in a fresh folder, and exits as Vitest did", () => {
    // Arrange
    const { site, seen } = fakeSite({ statuses: { [UNIT]: 3 } });
    // Act
    const code = coverageRun(site, CONFIG, ASK);
    // Assert
    expect(code).toBe(3);
    expect(
      seen.ran.map((check) =>
        check.args.map((arg) => arg.replace(/bfg-site-coverage-\w+$/u, "bfg-site-coverage-*")),
      ),
    ).toEqual([
      [
        "vitest",
        "run",
        "--coverage",
        `${REPORTS_DIRECTORY}${join(site.scratch, "bfg-site-coverage-*")}`,
        "--project",
        "unit",
      ],
    ]);
    expect(seen.ran.map((check) => check.env)).toEqual([{}]);
  });

  it("runs the site's unit project, by the name it gives", () => {
    // Arrange
    const { site, seen } = fakeSite();
    // Act
    coverageRun(site, configOf({ unitProject: "app" }), ASK);
    // Assert
    expect(seen.ran.map((check) => check.args.slice(-2))).toEqual([["--project", "app"]]);
  });

  it("keeps its reports in verify's run folder, its tests' among them", () => {
    // Arrange
    const { site, seen } = fakeSite();
    // Act
    coverageRun(site, CONFIG, { ...ASK, runReports: "/r/run" });
    // Assert
    expect(seen.ran.map((check) => check.args)).toEqual([
      ["vitest", "run", "--coverage", `${REPORTS_DIRECTORY}/r/run/coverage`, "--project", "unit"],
    ]);
    expect(seen.ran.map((check) => check.env)).toEqual([
      { BFG_TEST_REPORT_DIR: "/r/run/tests/unit" },
    ]);
    expect(seen.said).toEqual(["Coverage report: /r/run/coverage/index.html"]);
  });
});

describe("a coverage run's ratchet", () => {
  it("raises the site's minimums to what a green run of the whole suite reached", () => {
    // Arrange
    const { site, seen } = fakeSite({ sideEffects: { [UNIT]: writesSummary(90) } });
    const path = withMinimums(site.root);
    // Act
    coverageRun(site, CONFIG, ASK);
    // Assert
    expect(JSON.parse(readFileSync(path, "utf8"))).toEqual({
      statements: 90,
      functions: 90,
      branches: 90,
      lines: 90,
    });
    expect(seen.said).toContain("Coverage minimum raised: statements 80% → 90%.");
  });

  it.each([
    { what: "a red run", statuses: { [UNIT]: 1 }, ask: ASK, covered: 90 },
    {
      what: "a run of some tests",
      statuses: {},
      ask: { ...ASK, vitestArgs: ["tests/unit/a.test.ts"] },
      covered: 90,
    },
    { what: "a run below the minimums", statuses: {}, ask: ASK, covered: 50 },
  ])("leaves the minimums alone after $what", ({ statuses, ask, covered }) => {
    // Arrange
    const { site } = fakeSite({ statuses, sideEffects: { [UNIT]: writesSummary(covered) } });
    const path = withMinimums(site.root);
    // Act
    coverageRun(site, CONFIG, ask);
    // Assert
    expect(JSON.parse(readFileSync(path, "utf8"))).toEqual(MINIMUMS);
  });

  it("has no ratchet in a site without minimums", () => {
    // Arrange
    const { site, seen } = fakeSite({ sideEffects: { [UNIT]: writesSummary(90) } });
    // Act
    coverageRun(site, CONFIG, ASK);
    // Assert
    expect(seen.said).toHaveLength(1);
  });
});

describe("a coverage run, recorded or stopped", () => {
  it("records the run when asked", () => {
    // Arrange
    const { site, seen } = fakeSite({
      sideEffects: { [UNIT]: writesSummary(90) },
      outputs: {
        "oxlint -c .oxlintrc.complexity.json --format sarif src scripts": JSON.stringify({
          runs: [],
        }),
        "knip --reporter json --no-progress": JSON.stringify({ issues: [] }),
        "oxlint -A all -D no-unreachable -D no-unreachable-loop --format json src scripts tests":
          JSON.stringify({
            diagnostics: [],
          }),
      },
    });
    // Act
    coverageRun(site, CONFIG, { ...ASK, record: true });
    // Assert
    expect(seen.said.at(-1)).toContain("Quality recorded in");
  });

  it("is red when a signal stopped Vitest", () => {
    // Arrange
    const { site } = fakeSite({ statuses: { [UNIT]: null } });
    // Act
    const code = coverageRun(site, CONFIG, ASK);
    // Assert
    expect(code).toBe(1);
  });
});
