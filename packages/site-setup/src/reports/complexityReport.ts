import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

/**
 * The complexity report in a run's reports (reportRuns.ts): oxlint's complexity findings (the
 * site's complexity config, over the folders it names) as SARIF, kept as they are, and rendered to
 * HTML by sarif-explorer. Both are the tools' own output. What it runs and writes are ports, so
 * it's tested with stand-ins.
 */

/** A command: its program, and the arguments it's given. */
export interface Command {
  readonly program: string;
  readonly args: readonly string[];
}

/** What the site reports on: its complexity config, and the folders it reads. */
export interface ComplexityScope {
  readonly config: string;
  readonly sources: readonly string[];
}

/** A site's usual scope: its own config at its root, over src/ and scripts/. */
export const SITE_COMPLEXITY: ComplexityScope = {
  config: ".oxlintrc.complexity.json",
  sources: ["src", "scripts"],
};

/** oxlint, asked for `scope`'s complexity findings as SARIF on standard output. */
export const complexitySarif = ({ config, sources }: ComplexityScope): Command => ({
  program: "npx",
  args: ["oxlint", "-c", config, "--format", "sarif", ...sources],
});

/** sarif-explorer, rendering `sarif` to `html`. */
export const renderSarif = (sarif: string, html: string): Command => ({
  program: "npx",
  args: ["sarif-explorer", "--input", sarif, "--output", html],
});

/** What the report reads and writes. */
export interface ComplexityPorts {
  /** What `command` prints on standard output (a finding isn't a failure here). */
  readonly output: (command: Command) => string;
  /** Runs `command`: its exit code. */
  readonly run: (command: Command) => number;
  /** Writes `text` to `path`, its folder made if need be. */
  readonly write: (path: string, text: string) => void;
}

/** Where the report goes: the SARIF, and its HTML. */
export interface ComplexityPaths {
  readonly sarif: string;
  readonly html: string;
}

/** Writes the SARIF, then its HTML: the exit code of the rendering. */
export function writeComplexityReport(
  scope: ComplexityScope,
  paths: ComplexityPaths,
  ports: ComplexityPorts,
): number {
  ports.write(paths.sarif, ports.output(complexitySarif(scope)));
  return ports.run(renderSarif(paths.sarif, paths.html));
}

/** A command that ran: its exit code, or none when a signal stopped it. */
const exitCodeOf = (status: number | null): number => (status === null ? 1 : status);

/** The ports on the site at `root`: the commands run there, the files written there. */
export const nodeComplexityPorts = (root: string): ComplexityPorts => ({
  output: (command) =>
    spawnSync(command.program, command.args, { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })
      .stdout,
  run: (command) => exitCodeOf(spawnSync(command.program, command.args, { cwd: root, stdio: "inherit" }).status),
  write: (path, text) => {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text);
  },
});
