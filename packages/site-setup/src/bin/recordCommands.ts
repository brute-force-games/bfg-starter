import { createRequire } from "node:module";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { exitCodeOf, type Check, type SitePorts } from "./ports.ts";
import type { SiteConfig } from "./siteConfig.ts";

/**
 * `bfg-site audit <record.cbor> [--json]` and `bfg-site check-proof <proof.cbor> [--json]`
 * (decision 0033): a game record audited, or a cheat proof checked, with the site's own games,
 * which bfg-site.json's `games` names. audit-cli does the work, in a process of its own under
 * tsx (recordRunner.ts): like every bfg-core package, its sources import without extensions,
 * which plain Node (this command's own) can't load, and the site's games module may import through
 * its tsconfig's path aliases, which tsx reads from the site's root. Its exit codes are these
 * commands': 0 clean (or a proof that convicts), 1 findings (or a proof that doesn't), 2 a file
 * that can't be trusted, 64 asked wrongly or a games module it can't use.
 */

export const AUDIT_USAGE = "Usage: bfg-site audit <record.cbor> [--json]";
export const CHECK_PROOF_USAGE = "Usage: bfg-site check-proof <proof.cbor> [--json]";

/** How a command ends when it's asked wrongly, or its games module won't load: audit-cli's. */
export const USAGE_EXIT = 64;

/** What a games module must be, said after audit-cli says it won't load or names no games. */
export const GAMES_MODULE_RULE =
  "bfg-site.json's games must name a module, from the site's root, that exports `games`.";

/** Said when bfg-site.json names no games: only the reference games can replay the file. */
export const REFERENCE_GAMES_ONLY =
  "bfg-site.json names no games: checking with the reference games only.";

/** The runner: audit-cli's commands in a process of their own. */
export const RECORD_RUNNER = fileURLToPath(new URL("recordRunner.ts", import.meta.url));

/**
 * tsx's loader, site-setup's own: what the runner runs under, whether the site has tsx or not.
 * Found when a record command runs, never as bfg-site loads, so no other command depends on it.
 */
export const tsxLoader = (): string =>
  pathToFileURL(createRequire(import.meta.url).resolve("tsx")).href;

/** Which of audit-cli's commands: the record's audit, or the proof's check. */
type RecordCommand = "audit" | "check-proof";

/** `command` run over `args` by the runner, under tsx, in the site's root. */
const recordCheck = (command: RecordCommand, args: readonly string[]): Check => ({
  name: command,
  program: process.execPath,
  args: ["--import", tsxLoader(), RECORD_RUNNER, command, ...args],
  env: {},
});

/** `args` when they're one file and, at most, `--json`; undefined when they aren't. */
function fileAndFlags(args: readonly string[]): readonly string[] | undefined {
  const files = args.filter((arg) => arg !== "--json");
  const [file, ...extra] = files;
  return file === undefined || file.startsWith("-") || extra.length > 0 || args.length > 2
    ? undefined
    : args;
}

/** One of audit-cli's commands, run over the file `args` name with the site's games. */
function runWithGames(
  command: RecordCommand,
  usage: string,
  args: readonly string[],
  site: SitePorts,
  config: SiteConfig,
): Promise<number> {
  const asked = fileAndFlags(args);
  if (asked === undefined) {
    site.complain(usage);
    return Promise.resolve(USAGE_EXIT);
  }
  if (config.games === undefined) {
    site.complain(REFERENCE_GAMES_ONLY);
  }
  const games = config.games === undefined ? [] : ["--games", resolve(site.root, config.games)];
  const code = exitCodeOf(
    site.processes.runHere(recordCheck(command, [...asked, ...games])).status,
  );
  if (code === USAGE_EXIT && config.games !== undefined) {
    site.complain(GAMES_MODULE_RULE);
  }
  return Promise.resolve(code);
}

export const auditCommand = (
  args: readonly string[],
  site: SitePorts,
  config: SiteConfig,
): Promise<number> => runWithGames("audit", AUDIT_USAGE, args, site, config);

export const checkProofCommand = (
  args: readonly string[],
  site: SitePorts,
  config: SiteConfig,
): Promise<number> => runWithGames("check-proof", CHECK_PROOF_USAGE, args, site, config);
