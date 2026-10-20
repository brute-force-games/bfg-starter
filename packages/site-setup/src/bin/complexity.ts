import { writeComplexityReport } from "../reports/complexityReport.ts";
import { reportPathsIn } from "../reports/reportRuns.ts";
import { exitCodeOf, type SitePorts } from "./ports.ts";
import { complexityScopeOf } from "./quality.ts";
import type { SiteConfig } from "./siteConfig.ts";
import { writeWhole } from "./siteFiles.ts";

/** `bfg-site complexity <run folder>`: the complexity report (src/reports/), into verify's run folder. */
export function complexityInto(site: SitePorts, config: SiteConfig, runFolder: string): number {
  const paths = reportPathsIn(runFolder);
  return writeComplexityReport(
    complexityScopeOf(config),
    { sarif: paths.complexitySarif, html: paths.complexityHtml },
    {
      output: site.processes.output,
      run: (command) =>
        exitCodeOf(site.processes.runHere({ name: "complexity", ...command, env: {} }).status),
      write: writeWhole,
    },
  );
}
