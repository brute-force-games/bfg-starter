import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { reportPathsIn, TEST_REPORT_DIR_ENV } from "../reports/reportRuns.ts";
import {
  COVERAGE_MINIMUM_FILE,
  coverageMinimumsSchema,
  raisedLines,
  raisedMinimums,
  type CoverageMinimums,
} from "./coverageMinimum.ts";
import { exitCodeOf, npx, type SitePorts } from "./ports.ts";
import { recordQuality } from "./quality.ts";
import { coverageSummarySchema, percent } from "./qualityHistory.ts";
import type { SiteConfig } from "./siteConfig.ts";
import { jsonAt, writeJson } from "./siteFiles.ts";

/**
 * `bfg-site coverage [--record] [--reports=<run folder>] [vitest arguments]`: the site's unit tests
 * with coverage, in a folder of its own (a fresh one, or verify's run folder), so runs side by side
 * never read, clear or overwrite each other's output. It says where the HTML report is, records the
 * run into the quality history when asked (`bfg-site quality`), and exits as Vitest did. A green
 * run of the whole suite raises the site's coverage minimum to what it reached, if it keeps one.
 */

const RECORD_FLAG = "--record";
const REPORTS_FLAG = "--reports=";

/** What a coverage run is asked: to record it, verify's run folder, and Vitest's own arguments. */
export interface CoverageAsk {
  readonly record: boolean;
  readonly runReports: string | undefined;
  readonly vitestArgs: readonly string[];
}

export const readCoverageAsk = (args: readonly string[]): CoverageAsk => ({
  record: args.includes(RECORD_FLAG),
  runReports: args.find((arg) => arg.startsWith(REPORTS_FLAG))?.slice(REPORTS_FLAG.length),
  vitestArgs: args.filter((arg) => arg !== RECORD_FLAG && !arg.startsWith(REPORTS_FLAG)),
});

/** What a run's coverage summary reached, per metric, in percent. */
function reachedIn(summaryPath: string): CoverageMinimums {
  const { total } = coverageSummarySchema.parse(JSON.parse(readFileSync(summaryPath, "utf8")));
  return {
    statements: percent(total.statements),
    functions: percent(total.functions),
    branches: percent(total.branches),
    lines: percent(total.lines),
  };
}

/** Raises the minimums at `path` to what a green run reached, written whole; says what went up. */
function ratchet(path: string, summaryPath: string): string[] {
  const before = coverageMinimumsSchema.parse(jsonAt(path));
  const after = raisedMinimums(before, reachedIn(summaryPath));
  const lines = raisedLines(before, after);
  if (lines.length > 0) {
    writeJson(path, after);
  }
  return lines;
}

export function coverageRun(site: SitePorts, config: SiteConfig, ask: CoverageAsk): number {
  const reports =
    ask.runReports === undefined
      ? mkdtempSync(join(site.scratch, "bfg-site-coverage-"))
      : reportPathsIn(ask.runReports).coverage;
  const testReportEnv: Record<string, string> =
    ask.runReports === undefined
      ? {}
      : { [TEST_REPORT_DIR_ENV]: reportPathsIn(ask.runReports).tests("unit") };
  const vitest = site.processes.runHere({
    ...npx(
      "unit tests, with coverage",
      "vitest",
      "run",
      "--coverage",
      `--coverage.reportsDirectory=${reports}`,
      "--project",
      "unit",
      ...ask.vitestArgs,
    ),
    env: testReportEnv,
  });
  site.say(`Coverage report: ${join(reports, "index.html")}`);
  const summary = join(reports, "coverage-summary.json");
  const minimums = join(site.root, config.qualityFolder, COVERAGE_MINIMUM_FILE);
  // Only a green run of the whole suite moves the minimum: a run of some tests covers less.
  if (
    vitest.status === 0 &&
    ask.vitestArgs.length === 0 &&
    existsSync(summary) &&
    existsSync(minimums)
  ) {
    for (const line of ratchet(minimums, summary)) {
      site.say(line);
    }
  }
  if (ask.record) {
    site.say(recordQuality(site, config, summary));
  }
  return exitCodeOf(vitest.status);
}
