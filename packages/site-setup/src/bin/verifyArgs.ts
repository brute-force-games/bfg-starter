import { onCase, type Cases } from "@brute-force-games/cases";

/**
 * Reading verify's command line: which stages to run, and whose dev server e2e runs against.
 * verifyStages.ts plans the run read here.
 *
 *   bfg-site verify                     every stage, e2e on your dev server once the rest are green
 *   bfg-site verify --own-dev-server    the same, e2e on a dev server of its own
 *   bfg-site verify --build             every stage but e2e, for the build, stopping at the first red
 *   bfg-site verify --stage unit        one stage (e2e takes --own-dev-server too)
 */

/** The test stages, cheapest first. */
export type StageName = "static" | "unit" | "integration" | "property" | "e2e";
export const STAGE_NAMES: readonly StageName[] = [
  "static",
  "unit",
  "integration",
  "property",
  "e2e",
];

/** Whose dev server e2e runs against: the maintainer's, or one verify starts for the run. */
export type DevServerSource = { readonly kind: "yours" } | { readonly kind: "own" };

/** What's asked: everything (`verify`), the build's stages, or one stage. */
export type VerifyRun =
  | { readonly kind: "verify"; readonly devServer: DevServerSource }
  | { readonly kind: "build" }
  | { readonly kind: "stage"; readonly stage: StageName; readonly devServer: DevServerSource };

/** A run that can't take a dev server of its own: the build's, or one stage but e2e. */
export type RunWithoutE2E =
  | { readonly kind: "build" }
  | { readonly kind: "stage"; readonly stage: StageName };

export type VerifyRunProblem =
  | { readonly kind: "unknown-argument"; readonly argument: string }
  | { readonly kind: "unknown-stage"; readonly stage: string }
  | { readonly kind: "own-dev-server-without-e2e"; readonly run: RunWithoutE2E };

export type VerifyRunReading =
  | { readonly kind: "read"; readonly run: VerifyRun }
  | { readonly kind: "unreadable"; readonly problem: VerifyRunProblem };

export const OWN_DEV_SERVER_FLAG = "--own-dev-server";
const YOURS: DevServerSource = { kind: "yours" };
const OWN: DevServerSource = { kind: "own" };

const isStageName = (name: string): name is StageName =>
  STAGE_NAMES.some((stage) => stage === name);

const read = (run: VerifyRun): VerifyRunReading => ({ kind: "read", run });
const problem = (found: VerifyRunProblem): VerifyRunReading => ({
  kind: "unreadable",
  problem: found,
});

/** Reads `[--build | --stage <name>]`, every run on the maintainer's dev server. */
function readStages(argv: readonly string[]): VerifyRunReading {
  const [first, second, ...rest] = argv;
  if (first === undefined) {
    return read({ kind: "verify", devServer: YOURS });
  }
  if (first === "--build" && second === undefined) {
    return read({ kind: "build" });
  }
  if (first === "--stage" && second !== undefined && rest.length === 0) {
    return isStageName(second)
      ? read({ kind: "stage", stage: second, devServer: YOURS })
      : problem({ kind: "unknown-stage", stage: second });
  }
  return problem({ kind: "unknown-argument", argument: argv.join(" ") });
}

/** `run` on a dev server of its own: only a run with e2e in it takes one. */
function onOwnDevServer(run: VerifyRun): VerifyRunReading {
  if (run.kind === "verify" || (run.kind === "stage" && run.stage === "e2e")) {
    return read({ ...run, devServer: OWN });
  }
  return problem({
    kind: "own-dev-server-without-e2e",
    run: run.kind === "build" ? run : { kind: "stage", stage: run.stage },
  });
}

/** Reads `[--build | --stage <name>] [--own-dev-server]`. */
export function readVerifyRun(argv: readonly string[]): VerifyRunReading {
  const reading = readStages(argv.filter((argument) => argument !== OWN_DEV_SERVER_FLAG));
  return reading.kind === "read" && argv.includes(OWN_DEV_SERVER_FLAG)
    ? onOwnDevServer(reading.run)
    : reading;
}

const runName = (run: RunWithoutE2E): string => (run.kind === "build" ? "--build" : run.stage);

const problemWords: Cases<VerifyRunProblem, "kind", string> = {
  "unknown-argument": ({ argument }) => `Not understood: "${argument}".`,
  "unknown-stage": ({ stage }) => `No stage "${stage}".`,
  "own-dev-server-without-e2e": ({ run }) =>
    `${OWN_DEV_SERVER_FLAG} is for a run with e2e in it, not "${runName(run)}".`,
};

/** A problem in words, with how it's meant to be run. */
export function describeVerifyRunProblem(found: VerifyRunProblem): string {
  const usage = `Usage: bfg-site verify [--build | --stage <${STAGE_NAMES.join(" | ")}>] [${OWN_DEV_SERVER_FLAG}]`;
  return `${onCase(problemWords, found.kind, found)}\n${usage}`;
}
