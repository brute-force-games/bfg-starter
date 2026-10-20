import type { ReportTarget } from "../../src/reports/reportRuns.ts";
import type { Check } from "../../src/bin/ports.ts";
import type { StageName, VerifyRun } from "../../src/bin/verifyArgs.ts";
import { stagesOf, type Stage, type StageDevServer } from "../../src/bin/verifyStages.ts";
import { configOf } from "./fixtures/fakeSite.ts";

/** The stages each run runs (src/bin/verifyStages.ts); their rules are verifyRules.test.ts. */

const VERIFY: VerifyRun = { kind: "verify", devServer: { kind: "yours" } };
const VERIFY_OWN: VerifyRun = { kind: "verify", devServer: { kind: "own" } };
const BUILD: VerifyRun = { kind: "build" };
const UNIT: VerifyRun = { kind: "stage", stage: "unit", devServer: { kind: "yours" } };
const NO_REPORTS: ReportTarget = { kind: "none" };
const REPORTS: ReportTarget = { kind: "folder", dir: "/r/run" };
const CONFIG = configOf();

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
  it("are every stage for verify: smoke first, then cheapest first, e2e last, on your dev server", () => {
    // Act
    const stages = stagesOf(VERIFY, CONFIG, NO_REPORTS).map((stage) => planOf(stage));
    // Assert
    expect(stages).toEqual([
      {
        name: "smoke",
        prepare: [],
        checks: [plain("npx bfg-site smoke")],
        devServer: { kind: "yours" },
      },
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

  it("put smoke and e2e on a dev server of verify's own when asked", () => {
    // Act
    const stages = stagesOf(VERIFY_OWN, CONFIG, NO_REPORTS).map((stage) => planOf(stage));
    // Assert
    expect(stages.map((stage) => stage.devServer)).toEqual([
      { kind: "own" },
      NONE,
      NONE,
      NONE,
      NONE,
      { kind: "own" },
    ]);
  });
});

describe("the stages the build and one stage run", () => {
  it("are every stage but smoke and e2e for the build, its coverage recorded, its reports kept", () => {
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
