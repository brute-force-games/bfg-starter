import { checkNode } from "./checkNode.ts";
import { complexityInto } from "./complexity.ts";
import { coverageRun, readCoverageAsk } from "./coverage.ts";
import { deadCodeGate } from "./deadCode.ts";
import { freshBuild } from "./freshBuild.ts";
import type { SitePorts } from "./ports.ts";
import { verifyCommand } from "./verifyCommand.ts";
import { describeSiteConfigProblem, readSiteConfig, type SiteConfig } from "./siteConfig.ts";

/**
 * `bfg-site <command> [arguments]`: the scripts every site runs, by name. Each reads what it needs
 * (the site's bfg-site.json, its arguments) and says why when it can't: exit 2 for a run that was
 * asked wrongly, 1 for one that ran and failed.
 */

/** A command: its arguments and the site, to its exit code. */
type BinCommand = (args: readonly string[], site: SitePorts) => Promise<number>;

/** The command, given the site's config; or exit 2 when bfg-site.json can't be read. */
const withConfig =
  (
    command: (args: readonly string[], site: SitePorts, config: SiteConfig) => Promise<number>,
  ): BinCommand =>
  (args, site) => {
    const reading = readSiteConfig(site.root);
    if (reading.kind === "unreadable") {
      site.complain(describeSiteConfigProblem(reading.problem));
      return Promise.resolve(2);
    }
    return command(args, site, reading.config);
  };

/** complexity's one argument: verify's run folder. */
function complexityCommand(
  args: readonly string[],
  site: SitePorts,
  config: SiteConfig,
): Promise<number> {
  const [runFolder, ...rest] = args;
  if (runFolder === undefined || rest.length > 0) {
    site.complain("Usage: bfg-site complexity <run folder>");
    return Promise.resolve(2);
  }
  return Promise.resolve(complexityInto(site, config, runFolder));
}

const COMMANDS: Readonly<Record<string, BinCommand>> = {
  verify: withConfig(verifyCommand),
  coverage: withConfig((args, site, config) =>
    Promise.resolve(coverageRun(site, config, readCoverageAsk(args))),
  ),
  quality: withConfig((args, site, config) =>
    Promise.resolve(coverageRun(site, config, { ...readCoverageAsk(args), record: true })),
  ),
  "dead-code": withConfig((_args, site, config) => Promise.resolve(deadCodeGate(site, config))),
  complexity: withConfig(complexityCommand),
  "fresh-build": (args, site) => Promise.resolve(freshBuild(site, args)),
  "check-node": (_args, site) => Promise.resolve(checkNode(site, process.version)),
};

export const COMMAND_NAMES: readonly string[] = Object.keys(COMMANDS);

/** Runs `bfg-site`'s command line in `site`: its exit code. */
export function runBfgSite(argv: readonly string[], site: SitePorts): Promise<number> {
  const [name, ...args] = argv;
  const command = name === undefined ? undefined : COMMANDS[name];
  if (command === undefined) {
    site.complain(`Usage: bfg-site <${COMMAND_NAMES.join(" | ")}> [arguments]`);
    return Promise.resolve(2);
  }
  return command(args, site);
}
