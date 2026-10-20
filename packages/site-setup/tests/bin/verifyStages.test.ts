import type { ReportTarget } from "../../src/reports/reportRuns.ts";
import type { Check } from "../../src/bin/ports.ts";
import type { StageName, VerifyRun } from "../../src/bin/verifyArgs.ts";
import {
  e2eGate,
  goesOn,
  passes,
  stagesOf,
  verdictOf,
  type CheckResult,
  type E2EDecision,
  type E2EGate,
  type E2EServer,
  type Stage,
  type StageDevServer,
  type StageResult,
  type Verdict,
} from "../../src/bin/verifyStages.ts";
import { configOf } from "./fixtures/fakeSite.ts";

/** The test stages and their rules (src/bin/verifyStages.ts). */

const VERIFY: VerifyRun = { kind: "verify", devServer: { kind: "yours" } };
const VERIFY_OWN: VerifyRun = { kind: "verify", devServer: { kind: "own" } };
const BUILD: VerifyRun = { kind: "build" };
const UNIT: VerifyRun = { kind: "stage", stage: "unit", devServer: { kind: "yours" } };
const NO_REPORTS: ReportTarget = { kind: "none" };
const REPORTS: ReportTarget = { kind: "folder", dir: "/r/run" };
const CONFIG = configOf();

const LINT: Check = { name: "lint", program: "npx", args: ["oxlint"], env: {} };
const passed: CheckResult = { check: LINT, outcome: { kind: "passed" }, seconds: 1 };
const failed: CheckResult = { check: LINT, outcome: { kind: "failed", status: 1 }, seconds: 1 };
const green = (stage: StageName): StageResult => ({ stage, checks: [passed, passed] });
const red = (stage: StageName): StageResult => ({ stage, checks: [passed, failed] });

/** A check, as a test reads it: its command line and its variables. */
interface PlannedCheck {
  readonly line: string;
  readonly env: Readonly<Record<string, string>>;
}

/** A stage, as a test reads it: its name, each check's command line and variables, its server. */
interface StagePlan {
  readonly name: StageName;
  readonly prepare: readonly string[];
  readonly checks: readonly PlannedCheck[];
  readonly devServer: StageDevServer;
}

const lineOf = (check: Check): string => [check.program, ...check.args].join(" ");
const planOf = (stage: Stage): StagePlan => ({
  name: stage.name,
  prepare: stage.prepare.map(lineOf),
  checks: stage.checks.map((check) => ({ line: lineOf(check), env: check.env })),
  devServer: stage.devServer,
});
const plain = (line: string): PlannedCheck => ({ line, env: {} });

const NONE: StageDevServer = { kind: "none" };
const STATIC_CHECKS = [
  plain("npx bfg-site check-node"),
  plain("npx oxfmt --check --ignore-path .gitignore"),
  plain("npx oxlint --type-aware"),
  plain("npx bfg-site dead-code"),
  plain("npx astro check"),
  plain("npx tsc --noEmit"),
];
const staticPlan = (checks: readonly PlannedCheck[]): StagePlan => ({
  name: "static",
  prepare: ["npx astro sync"],
  checks,
  devServer: NONE,
});

describe("the stages a run runs", () => {
  it("are every stage for verify, cheapest first, e2e last on your dev server", () => {
    // Act
    const stages = stagesOf(VERIFY, CONFIG, NO_REPORTS).map((stage) => planOf(stage));
    // Assert
    expect(stages).toEqual([
      staticPlan(STATIC_CHECKS),
      { name: "unit", prepare: [], checks: [plain("npx bfg-site coverage")], devServer: NONE },
      {
        name: "integration",
        prepare: [],
        checks: [plain("npx vitest run --project integration")],
        devServer: NONE,
      },
      {
        name: "property",
        prepare: [],
        checks: [plain("npx vitest run --project property")],
        devServer: NONE,
      },
      {
        name: "e2e",
        prepare: [],
        checks: [plain("npx playwright test")],
        devServer: { kind: "yours" },
      },
    ]);
  });

  it("put e2e on a dev server of verify's own when asked", () => {
    // Act
    const stages = stagesOf(VERIFY_OWN, CONFIG, NO_REPORTS).map((stage) => planOf(stage));
    // Assert
    expect(stages.map((stage) => stage.devServer)).toEqual([
      NONE,
      NONE,
      NONE,
      NONE,
      { kind: "own" },
    ]);
  });
});

describe("the stages the build and one stage run", () => {
  it("are every stage but e2e for the build, its coverage recorded, its reports kept", () => {
    // Act
    const stages = stagesOf(BUILD, CONFIG, REPORTS).map((stage) => planOf(stage));
    // Assert
    expect(stages).toEqual([
      staticPlan([...STATIC_CHECKS, plain("npx bfg-site complexity /r/run")]),
      {
        name: "unit",
        prepare: [],
        checks: [plain("npx bfg-site coverage --record --reports=/r/run")],
        devServer: NONE,
      },
      {
        name: "integration",
        prepare: [],
        checks: [
          {
            line: "npx vitest run --project integration",
            env: { BFG_TEST_REPORT_DIR: "/r/run/tests/integration" },
          },
        ],
        devServer: NONE,
      },
      {
        name: "property",
        prepare: [],
        checks: [
          {
            line: "npx vitest run --project property",
            env: { BFG_TEST_REPORT_DIR: "/r/run/tests/property" },
          },
        ],
        devServer: NONE,
      },
    ]);
  });
});

describe("the stages one stage runs", () => {
  it("are one stage alone, its coverage not recorded", () => {
    // Act
    const stages = stagesOf(UNIT, CONFIG, NO_REPORTS).map((stage) => planOf(stage));
    // Assert
    expect(stages).toEqual([
      { name: "unit", prepare: [], checks: [plain("npx bfg-site coverage")], devServer: NONE },
    ]);
  });

  it("check the format with every ignore file the site names", () => {
    // Arrange
    const config = configOf({ formatIgnoreFiles: [".gitignore", ".oxfmtignore"] });
    const run: VerifyRun = { kind: "stage", stage: "static", devServer: { kind: "yours" } };
    // Act
    const [stage] = stagesOf(run, config, NO_REPORTS).map((each) => planOf(each));
    // Assert
    expect(stage).toEqual(
      staticPlan([
        plain("npx bfg-site check-node"),
        plain("npx oxfmt --check --ignore-path .gitignore --ignore-path .oxfmtignore"),
        ...STATIC_CHECKS.slice(2),
      ]),
    );
  });

  it("run the site's own static checks beside the shared ones", () => {
    // Arrange
    const config = configOf({
      staticChecks: [{ name: "codegen", program: "npx", args: ["codegen", "check"] }],
    });
    const run: VerifyRun = { kind: "stage", stage: "static", devServer: { kind: "yours" } };
    // Act
    const stages = stagesOf(run, config, NO_REPORTS).map((stage) => planOf(stage));
    // Assert
    expect(stages).toEqual([staticPlan([...STATIC_CHECKS, plain("npx codegen check")])]);
  });
});

describe("a run's rules", () => {
  it.each<{ run: VerifyRun; result: StageResult; on: boolean }>([
    { run: BUILD, result: red("static"), on: false },
    { run: BUILD, result: green("static"), on: true },
    { run: VERIFY, result: red("static"), on: true },
  ])("go on after a stage, for $run.kind, unless the build's is red", ({ run, result, on }) => {
    // Act
    const goes = goesOn(run, result);
    // Assert
    expect(goes).toBe(on);
  });
});

describe("e2e's gate", () => {
  it.each<{ what: string; below: StageResult[]; server: E2EServer; gate: E2EGate }>([
    {
      what: "a stage below is red",
      below: [red("static")],
      server: { kind: "own" },
      gate: { kind: "skip", reason: "red-below" },
    },
    {
      what: "your dev server is down",
      below: [green("static")],
      server: { kind: "yours", answers: "down" },
      gate: { kind: "skip", reason: "no-dev-server" },
    },
    {
      what: "your dev server is up",
      below: [green("static")],
      server: { kind: "yours", answers: "up" },
      gate: { kind: "run" },
    },
    {
      what: "it has its own",
      below: [green("static")],
      server: { kind: "own" },
      gate: { kind: "run" },
    },
  ])("let e2e run or not when $what", ({ below, server, gate }) => {
    // Act
    const decided = e2eGate(below, server);
    // Assert
    expect(decided).toEqual(gate);
  });
});

describe("a run's verdict", () => {
  it.each<{
    what: string;
    run: VerifyRun;
    results: StageResult[];
    gate: E2EDecision;
    verdict: Verdict;
    passing: boolean;
  }>([
    {
      what: "red, naming each red stage",
      run: VERIFY,
      results: [red("static"), green("unit"), red("property")],
      gate: { kind: "skip", reason: "red-below" },
      verdict: { kind: "red", stages: ["static", "property"] },
      passing: false,
    },
    {
      what: "green, for the build",
      run: BUILD,
      results: [green("static")],
      gate: { kind: "not-asked" },
      verdict: { kind: "green" },
      passing: true,
    },
    {
      what: "not verified, without a dev server",
      run: VERIFY,
      results: [green("static")],
      gate: { kind: "skip", reason: "no-dev-server" },
      verdict: { kind: "not-verified", reason: "no-dev-server" },
      passing: false,
    },
    {
      what: "verified, e2e green",
      run: VERIFY,
      results: [green("static"), green("e2e")],
      gate: { kind: "run" },
      verdict: { kind: "verified" },
      passing: true,
    },
  ])("come to a verdict: $what", ({ run, results, gate, verdict, passing }) => {
    // Act
    const reached = verdictOf(run, results, gate);
    // Assert
    expect(reached).toEqual(verdict);
    expect(passes(reached)).toBe(passing);
  });
});
