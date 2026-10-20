import { reportPathsIn, TEST_REPORT_DIR_ENV, type ReportTarget } from "../reports/reportRuns.ts";
import {
  STAGE_NAMES,
  usesDevServer,
  type DevServerSource,
  type StageName,
  type VerifyRun,
} from "./verifyArgs.ts";
import { npx, type Check } from "./ports.ts";
import type { SiteConfig } from "./siteConfig.ts";

/**
 * The stages, the dev server's smoke check first and then the tests, cheapest first, and what a run
 * of them decides: which stages run, what each runs at once, whether the run stops early, whether
 * e2e runs, and the verdict. verifyRun.ts runs the processes; verifyArgs.ts reads
 * what was asked; this is the plan and the rules.
 */

/** The dev server a stage runs against: none (all but smoke and e2e), the maintainer's, or its own. */
export type StageDevServer = { readonly kind: "none" } | DevServerSource;

/** A stage: what it runs first, one after another, then its checks, all at once. */
export interface Stage {
  readonly name: StageName;
  readonly prepare: readonly Check[];
  readonly checks: readonly Check[];
  readonly devServer: StageDevServer;
}

const NO_SERVER: StageDevServer = { kind: "none" };

/** The complexity report, into the run's reports (none without them). */
const complexityChecks = (reports: ReportTarget): Check[] =>
  reports.kind === "none" ? [] : [npx("complexity report", "bfg-site", "complexity", reports.dir)];

const staticStage = (config: SiteConfig, reports: ReportTarget): Stage => ({
  name: "static",
  // Astro's generated types, which the type checks read: made once, before they all start. No
  // `--force`: the run's caches are its own and new (verifyRun.ts), so nothing stale is kept.
  prepare: [npx("astro sync", "astro", "sync")],
  checks: [
    npx("node version", "bfg-site", "check-node"),
    npx(
      "format",
      "oxfmt",
      "--check",
      ...config.formatIgnoreFiles.flatMap((file) => ["--ignore-path", file]),
    ),
    npx("lint", "oxlint", "--type-aware"),
    npx("dead code", "bfg-site", "dead-code"),
    npx("astro check", "astro", "check"),
    npx("types", "tsc", "--noEmit"),
    ...config.staticChecks.map((check): Check => ({ ...check, env: {} })),
    ...complexityChecks(reports),
  ],
  devServer: NO_SERVER,
});

/** The unit stage: with coverage, recorded for the build; its reports into the run's. */
const unitStage = (record: boolean, reports: ReportTarget): Stage => ({
  name: "unit",
  prepare: [],
  checks: [
    npx(
      "unit tests, with coverage",
      "bfg-site",
      "coverage",
      ...(record ? ["--record"] : []),
      ...(reports.kind === "none" ? [] : [`--reports=${reports.dir}`]),
    ),
  ],
  devServer: NO_SERVER,
});

/** A stage that's one Vitest project, its tests' report into the run's reports. */
const vitestStage = (name: "integration" | "property", reports: ReportTarget): Stage => ({
  name,
  prepare: [],
  checks: [
    {
      ...npx(`${name} tests`, "vitest", "run", "--project", name),
      env:
        reports.kind === "none"
          ? {}
          : { [TEST_REPORT_DIR_ENV]: reportPathsIn(reports.dir).tests(name) },
    },
  ],
  devServer: NO_SERVER,
});

/** The smoke check: every page of the dev server answering, opening cleanly and reading Ready. */
const smokeStage = (devServer: DevServerSource): Stage => ({
  name: "smoke",
  prepare: [],
  checks: [npx("smoke", "bfg-site", "smoke")],
  devServer,
});

const e2eStage = (devServer: DevServerSource): Stage => ({
  name: "e2e",
  prepare: [],
  checks: [npx("e2e", "playwright", "test")],
  devServer,
});

/** How each stage is made: the site's checks, coverage recorded or not, e2e on whose server, the reports. */
interface StageOptions {
  readonly config: SiteConfig;
  readonly record: boolean;
  readonly devServer: DevServerSource;
  readonly reports: ReportTarget;
}

const stageMakers: Readonly<Record<StageName, (options: StageOptions) => Stage>> = {
  smoke: ({ devServer }) => smokeStage(devServer),
  static: ({ config, reports }) => staticStage(config, reports),
  unit: ({ record, reports }) => unitStage(record, reports),
  integration: ({ reports }) => vitestStage("integration", reports),
  property: ({ reports }) => vitestStage("property", reports),
  e2e: ({ devServer }) => e2eStage(devServer),
};

/**
 * The stages `run` runs, in order (smoke first; e2e last, run only if `e2eGate` lets it), their
 * reports into `reports`: verify and the build keep a folder of them; a single stage, none. The
 * build runs neither smoke nor e2e: it has no dev server.
 */
export function stagesOf(run: VerifyRun, config: SiteConfig, reports: ReportTarget): Stage[] {
  if (run.kind === "stage") {
    return [stageMakers[run.stage]({ config, record: false, devServer: run.devServer, reports })];
  }
  const options: StageOptions =
    run.kind === "build"
      ? { config, record: true, devServer: { kind: "yours" }, reports }
      : { config, record: false, devServer: run.devServer, reports };
  return STAGE_NAMES.filter((name) => run.kind === "verify" || !usesDevServer(name)).map((name) =>
    stageMakers[name](options),
  );
}

/** How a check's process ended; a server, whether it came up. */
export type CheckOutcome =
  | { readonly kind: "passed" }
  | { readonly kind: "failed"; readonly status: number | null }
  | { readonly kind: "not-ready"; readonly waitedSeconds: number };

export interface CheckResult {
  readonly check: Check;
  readonly outcome: CheckOutcome;
  readonly seconds: number;
}

export interface StageResult {
  readonly stage: StageName;
  readonly checks: readonly CheckResult[];
}

export const stageGreen = (result: StageResult): boolean =>
  result.checks.every((each) => each.outcome.kind === "passed");

/**
 * Whether to go on after a stage: every run stops at a red smoke check (a sick dev server makes
 * the rest pointless), and the build at its first red; otherwise the rest report them all.
 */
export const goesOn = (run: VerifyRun, result: StageResult): boolean =>
  stageGreen(result) || (run.kind !== "build" && result.stage !== "smoke");

/** The dev server e2e would run against: verify's own (started once e2e may run), or the maintainer's. */
export type E2EServer =
  | { readonly kind: "own" }
  | { readonly kind: "yours"; readonly answers: "up" | "down" };

/** Why e2e didn't run. */
export type E2ESkip = "red-below" | "no-dev-server";

/** Whether e2e runs: only with every stage below it green, and the maintainer's dev server up. */
export type E2EGate =
  | { readonly kind: "run" }
  | { readonly kind: "skip"; readonly reason: E2ESkip };

export function e2eGate(below: readonly StageResult[], server: E2EServer): E2EGate {
  if (!below.every((result) => stageGreen(result))) {
    return { kind: "skip", reason: "red-below" };
  }
  return server.kind === "own" || server.answers === "up"
    ? { kind: "run" }
    : { kind: "skip", reason: "no-dev-server" };
}

/** What a run comes to. Only a `verify` run with e2e green is `verified`. */
export type Verdict =
  | { readonly kind: "verified" }
  | { readonly kind: "green" }
  | { readonly kind: "red"; readonly stages: readonly StageName[] }
  | { readonly kind: "not-verified"; readonly reason: "no-dev-server" };

/** Whether e2e's gate was asked (only a `verify` run asks it), and what it said. */
export type E2EDecision = E2EGate | { readonly kind: "not-asked" };

export function verdictOf(
  run: VerifyRun,
  results: readonly StageResult[],
  gate: E2EDecision,
): Verdict {
  const red = results.filter((result) => !stageGreen(result)).map((result) => result.stage);
  if (red.length > 0) {
    return { kind: "red", stages: red };
  }
  if (run.kind !== "verify") {
    return { kind: "green" };
  }
  return gate.kind === "skip" && gate.reason === "no-dev-server"
    ? { kind: "not-verified", reason: "no-dev-server" }
    : { kind: "verified" };
}

/** Whether a verdict passes: verified, or green for a run without e2e. */
export const passes = (verdict: Verdict): boolean =>
  verdict.kind === "verified" || verdict.kind === "green";
