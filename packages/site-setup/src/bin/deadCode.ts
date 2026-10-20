import { join } from "node:path";
import type { Command } from "../reports/complexityReport.ts";
import {
  checkDeadCode,
  DEAD_CODE_BASELINE_FILE,
  deadCodeBaselineSchema,
  describeDeadCodeProblem,
  loweredBaselines,
  NO_BASELINE,
} from "./deadCodeCheck.ts";
import type { SitePorts } from "./ports.ts";
import { deadCodeOf, knipReportSchema, type DeadCode } from "./qualityHistory.ts";
import type { SiteConfig } from "./siteConfig.ts";
import { jsonAt, writeJson } from "./siteFiles.ts";

/**
 * `bfg-site dead-code`: runs knip once (its JSON reporter), fails on any dead code of a kind held at
 * zero, or on unused exports or types above their baseline, and lowers the baseline (written whole)
 * when they've gone down. The logic is deadCodeCheck.ts; this is knip and the file.
 */

/** knip, asked for its findings as JSON. */
const KNIP_JSON: Command = {
  program: "npx",
  args: ["knip", "--reporter", "json", "--no-progress"],
};

/** The dead code knip finds in the site. */
export const deadCodeIn = (site: SitePorts): DeadCode =>
  deadCodeOf(knipReportSchema.parse(JSON.parse(site.processes.output(KNIP_JSON))));

export function deadCodeGate(site: SitePorts, config: SiteConfig): number {
  const path = join(site.root, config.qualityFolder, DEAD_CODE_BASELINE_FILE);
  const saved = jsonAt(path);
  const before = saved === undefined ? NO_BASELINE : deadCodeBaselineSchema.parse(saved);
  const dead = deadCodeIn(site);
  const { problems, baseline } = checkDeadCode(dead, before);
  const lowered = loweredBaselines(before, baseline);
  for (const line of lowered) {
    site.say(line);
  }
  if (lowered.length > 0) {
    writeJson(path, baseline);
  }
  for (const problem of problems) {
    site.complain(describeDeadCodeProblem(problem));
  }
  if (problems.length === 0) {
    site.say(
      `knip: no dead code held at zero; ${String(dead.exports)} unused exports and ${String(dead.types)} unused types, within their baseline.`,
    );
  }
  return problems.length === 0 ? 0 : 1;
}
