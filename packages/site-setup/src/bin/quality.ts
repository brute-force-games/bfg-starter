import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  complexitySarif,
  SITE_COMPLEXITY,
  type Command,
  type ComplexityScope,
} from "../reports/complexityReport.ts";
import { deadCodeIn } from "./deadCode.ts";
import type { SitePorts } from "./ports.ts";
import {
  coverageSummarySchema,
  findingsInOxlint,
  findingsOf,
  historySchema,
  oxlintReportSchema,
  sarifLogSchema,
  withEntry,
  type HistoryEntry,
} from "./qualityHistory.ts";
import type { SiteConfig } from "./siteConfig.ts";
import { commitOf, jsonAt, writeJson, writeWhole } from "./siteFiles.ts";

/**
 * Records a quality run (`bfg-site quality`) from the tools' own outputs: Vitest's
 * coverage-summary.json; oxlint's SARIF of the complexity report; knip's JSON of dead code; oxlint's
 * count of unreachable code. The SARIF stays with the run, in its coverage folder, never committed;
 * only the run's totals go into <quality folder>/history.json. The logic is qualityHistory.ts.
 */
const HISTORY_FILE = "history.json";

/** The site's complexity scope: its complexity config, over its sources. */
export const complexityScopeOf = (config: SiteConfig): ComplexityScope => ({
  config: SITE_COMPLEXITY.config,
  sources: config.sources,
});

/** oxlint, asked only for unreachable code, as JSON, over the site's sources and tests. */
const unreachableCode = (config: SiteConfig): Command => ({
  program: "npx",
  args: [
    "oxlint",
    "-A",
    "all",
    "-D",
    "no-unreachable",
    "-D",
    "no-unreachable-loop",
    "--format",
    "json",
    ...config.sources,
    "tests",
  ],
});

/**
 * Records the run whose coverage summary is `summaryPath`, and says what it did. Without one (the
 * tests failed, so Vitest wrote none) it records nothing.
 */
export function recordQuality(site: SitePorts, config: SiteConfig, summaryPath: string): string {
  if (!existsSync(summaryPath)) {
    return "No coverage summary (did the tests fail?): nothing recorded.";
  }
  const summary = coverageSummarySchema.parse(JSON.parse(readFileSync(summaryPath, "utf8")));
  const sarif = site.processes.output(complexitySarif(complexityScopeOf(config)));
  const unreachable = site.processes.output(unreachableCode(config));
  const entry: HistoryEntry = {
    date: site.now().toISOString(),
    commit: commitOf(site.root),
    coverage: summary.total,
    complexityFindings: findingsOf(sarifLogSchema.parse(JSON.parse(sarif))),
    deadCode: deadCodeIn(site),
    unreachableFindings: findingsInOxlint(oxlintReportSchema.parse(JSON.parse(unreachable))),
  };
  const run = dirname(summaryPath);
  writeWhole(join(run, "complexity.sarif"), sarif);
  const history = join(site.root, config.qualityFolder, HISTORY_FILE);
  const saved = jsonAt(history);
  const before = saved === undefined ? [] : historySchema.parse(saved);
  writeJson(history, withEntry(before, entry));
  return `Quality recorded in ${history}; complexity.sarif in ${run}`;
}
