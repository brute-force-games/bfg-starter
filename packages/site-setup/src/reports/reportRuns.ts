import { join } from "node:path";

/**
 * Each run's HTML reports (a site's verify, and its build): a folder of its own,
 * reports/<date-time>-<short commit>/, with every tool's own report in it (no custom reports):
 * the tests' (Vitest's html reporter), coverage's, complexity's (oxlint's SARIF, rendered by
 * sarif-explorer) and e2e's (Playwright's). The last few runs are kept (`REPORTS_KEEP`, 5 unless
 * it says), the oldest pruned; reports/ stays out of git. Pure; reportFolder.ts makes the folder
 * and prunes.
 */

/** Where every run's folder goes, at the repo's root. */
export const REPORTS_FOLDER = "reports";

/** The variable a run's checks find its folder in (the Playwright preset adds its report there). */
export const REPORT_DIR_ENV = "BFG_REPORT_DIR";

/**
 * The variable a test stage's run finds its report folder in: the Vitest preset adds the html
 * reporter only when it's set (only verify sets it), since Vitest 5 takes the reporter's folder
 * from its config (`outputDir`), not the command line. Plain `vitest`, an IDE's runs: no report.
 */
export const TEST_REPORT_DIR_ENV = "BFG_TEST_REPORT_DIR";

/** The variable that says how many runs' reports to keep. */
export const REPORTS_KEEP_ENV = "REPORTS_KEEP";

const KEPT_BY_DEFAULT = 5;

/** Where a run's reports go: its folder, or none (a single stage's run writes none). */
export type ReportTarget =
  | { readonly kind: "none" }
  | { readonly kind: "folder"; readonly dir: string };

/** The stages whose tests Vitest reports. */
export type TestReportStage = "unit" | "integration" | "property";

/** Each tool's report, inside a run's folder. */
export interface ReportPaths {
  /** Vitest's html report of a stage's tests: its folder. */
  readonly tests: (stage: TestReportStage) => string;
  /** Vitest's coverage report: its HTML, and the summary the ratchet reads. */
  readonly coverage: string;
  /** oxlint's complexity findings, as SARIF. */
  readonly complexitySarif: string;
  /** The same, rendered by sarif-explorer. */
  readonly complexityHtml: string;
  /** Playwright's html report. */
  readonly e2e: string;
}

export const reportPathsIn = (dir: string): ReportPaths => ({
  tests: (stage) => join(dir, "tests", stage),
  coverage: join(dir, "coverage"),
  complexitySarif: join(dir, "complexity", "complexity.sarif"),
  complexityHtml: join(dir, "complexity", "index.html"),
  e2e: join(dir, "e2e"),
});

/** A run's folder name, sortable by when it ran: `2026-10-19T20-41-05-33904a7` (UTC). */
export const runNameOf = (at: Date, commit?: string): string =>
  `${at.toISOString().slice(0, 19).replaceAll(":", "-")}-${commit ?? "no-commit"}`;

/** A folder `runNameOf` made: only these are ever pruned. */
const RUN_NAME = /^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-(?:[0-9a-f]{7}|no-commit)$/u;

/** The runs to remove so only the newest `keep` are left; folders it didn't make stay. */
export function runsToPrune(names: readonly string[], keep: number): string[] {
  const runs = names.filter((name) => RUN_NAME.test(name)).toSorted();
  return runs.slice(0, Math.max(0, runs.length - keep));
}

/** How many runs to keep, as `REPORTS_KEEP` says, or why it can't be read. */
export type KeptRuns =
  | { readonly kind: "keep"; readonly runs: number }
  | { readonly kind: "unreadable"; readonly given: string };

/** A whole number from 1, written plainly. */
const WHOLE_FROM_ONE = /^[1-9]\d*$/u;

export function keptRunsOf(given: string | undefined): KeptRuns {
  if (given === undefined) {
    return { kind: "keep", runs: KEPT_BY_DEFAULT };
  }
  return WHOLE_FROM_ONE.test(given) ? { kind: "keep", runs: Number(given) } : { kind: "unreadable", given };
}

/** Why `REPORTS_KEEP` can't be read, in words. */
export const keptRunsProblem = (given: string): string =>
  `${REPORTS_KEEP_ENV} must be a whole number from 1 (how many runs' reports to keep), not "${given}"`;

/**
 * The commit checked out, shortened, read from git's own files (`read` gives a file under .git/,
 * or undefined), never by running git: HEAD names a branch (its ref file, or packed-refs) or a
 * commit.
 */
export function shortCommitIn(read: (path: string) => string | undefined): string | undefined {
  const head = read("HEAD")?.trim();
  if (head === undefined) {
    return undefined;
  }
  const ref = /^ref: (\S+)$/u.exec(head)?.[1];
  const commit =
    ref === undefined ? head : (read(ref)?.trim() ?? packedRef(read("packed-refs") ?? "", ref));
  return commit === undefined || !/^[0-9a-f]{40}$/u.test(commit) ? undefined : commit.slice(0, 7);
}

/** `ref`'s commit in a packed-refs file's lines (`<sha> <ref>`). */
const packedRef = (packed: string, ref: string): string | undefined =>
  packed
    .split("\n")
    .map((line) => line.split(" "))
    .find(([, name]) => name === ref)?.[0];
