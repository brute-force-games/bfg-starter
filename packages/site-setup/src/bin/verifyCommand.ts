import { openRunReports } from "../reports/reportFolder.ts";
import type { ReportTarget } from "../reports/reportRuns.ts";
import type { SitePorts } from "./ports.ts";
import type { SiteConfig } from "./siteConfig.ts";
import { describeVerifyRunProblem, readVerifyRun } from "./verifyArgs.ts";
import { verify } from "./verifyRun.ts";

/** verify, its reports in a run folder of their own (a single stage keeps none). */
export async function verifyCommand(
  args: readonly string[],
  site: SitePorts,
  config: SiteConfig,
): Promise<number> {
  const reading = readVerifyRun(args);
  if (reading.kind === "unreadable") {
    site.complain(describeVerifyRunProblem(reading.problem));
    return 2;
  }
  if (reading.run.kind === "stage") {
    const none: ReportTarget = { kind: "none" };
    return (await verify(site, { run: reading.run, config, reports: none, env: {} })) ? 0 : 1;
  }
  const opened = openRunReports(site.root, site.env, site.now());
  if (opened.kind === "unreadable") {
    site.complain(opened.problem);
    return 2;
  }
  const reports: ReportTarget = { kind: "folder", dir: opened.dir };
  return (await verify(site, { run: reading.run, config, reports, env: opened.env })) ? 0 : 1;
}
