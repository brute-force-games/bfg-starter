import type { Command } from "../reports/complexityReport.ts";

/**
 * What `bfg-site` reaches outside itself, but for the site's files (read and written in place, so
 * its tests use a real folder): the processes it runs, the console, the clock and the environment.
 * Each command takes these, so it's tested with stand-ins; nodeProcesses.ts is the real thing,
 * tested on real processes.
 */

/** A process a stage runs: its name in the report, its command, and variables of its own. */
export interface Check extends Command {
  readonly name: string;
  readonly env: Readonly<Record<string, string>>;
}

/** How a process ended: its exit code (null when a signal stopped it), and how long it ran. */
export interface Ended {
  readonly status: number | null;
  readonly seconds: number;
}

/** Where a process left running is: still running, or ended. */
export type ProcessState =
  | { readonly kind: "running" }
  | { readonly kind: "ended"; readonly status: number | null };

/** A process left running (a dev server of verify's own): where it is, and how to stop it. */
export interface Running {
  readonly state: () => ProcessState;
  /** Stops it and everything it started; nothing once it's ended. */
  readonly stop: () => void;
}

/** Whether a dev server answers. */
export type Answer = "up" | "down";

/** The processes `bfg-site` runs, each in the site's folder. */
export interface ProcessPorts {
  /** Runs `check`, its output to `logFile`, its variables over the environment's. */
  readonly run: (check: Check, logFile: string) => Promise<Ended>;
  /** Runs `check` with its output to this console: how it ended. */
  readonly runHere: (check: Check) => Ended;
  /** What `command` prints on standard output, whatever its exit code (a finding isn't a failure). */
  readonly output: (command: Command) => string;
  /** Starts `check` in a process group of its own, its output to `logFile`. */
  readonly start: (check: Check, logFile: string) => Running;
  /** A port nothing is listening on now. */
  readonly freePort: () => Promise<number>;
  /** Whether a dev server answers at `url`. */
  readonly answers: (url: string) => Promise<Answer>;
  /** Waits `ms`. */
  readonly pause: (ms: number) => Promise<void>;
}

/** The site `bfg-site` runs in, and what it reaches through. */
export interface SitePorts {
  /** The site's folder: where its config, its quality records and its builds are. */
  readonly root: string;
  readonly env: Readonly<Record<string, string | undefined>>;
  /** Where fresh folders of a run's own go (the system's temporary folder). */
  readonly scratch: string;
  readonly now: () => Date;
  /** A line to standard output. */
  readonly say: (line: string) => void;
  /** A line to standard error. */
  readonly complain: (line: string) => void;
  readonly processes: ProcessPorts;
}

/** A check with no variables of its own, run through npx. */
export const npx = (name: string, ...args: string[]): Check => ({
  name,
  program: "npx",
  args,
  env: {},
});

/** How a process ended, as an exit code: a signal's stop is a failure. */
export const exitCodeOf = (status: number | null): number => status ?? 1;
