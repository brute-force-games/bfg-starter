import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Command } from "../../../src/reports/complexityReport.ts";
import type {
  Answer,
  Check,
  Ended,
  ProcessPorts,
  ProcessState,
  SitePorts,
} from "../../../src/bin/ports.ts";
import { siteConfigSchema, type SiteConfig } from "../../../src/bin/siteConfig.ts";

/**
 * A site for bfg-site's commands to run in: a real, fresh folder for its files, and stand-ins for
 * its processes, which record what ran and end as each test scripts them.
 */

/** How the stand-in processes behave: each check's exit code by its name (0 unless named), and so on. */
export interface Script {
  /** Each check's exit code, by name; 0 for a check not named. */
  readonly statuses: Readonly<Record<string, number | null>>;
  /** What each command prints, by its arguments joined with spaces. */
  readonly outputs: Readonly<Record<string, string>>;
  /** Whether a dev server answers, by its address; "down" for one not named. */
  readonly answers: Readonly<Record<string, Answer>>;
  /** What a process left running does: answers its address (see `answers`), or ends. */
  readonly startedState: ProcessState;
  /** What runHere also does, by the check's name, given the check: writes files (Vitest's coverage summary). */
  readonly sideEffects: Readonly<Record<string, (check: Check) => void>>;
}

export const SCRIPT: Script = {
  statuses: {},
  outputs: {},
  answers: {},
  startedState: { kind: "running" },
  sideEffects: {},
};

/** What the stand-ins saw: the checks run, the lines said, the processes stopped. */
export interface Seen {
  readonly ran: Check[];
  readonly said: string[];
  readonly complained: string[];
  readonly started: Check[];
  readonly stopped: string[];
  readonly asked: string[];
}

export interface FakeSite {
  readonly site: SitePorts;
  readonly seen: Seen;
}

/** A check's scripted exit code (null for one a signal stopped), 0 for one not named. */
const statusOf = (script: Script, check: Check): number | null =>
  Object.hasOwn(script.statuses, check.name) ? (script.statuses[check.name] ?? null) : 0;

function fakeProcesses(script: Script, seen: Seen): ProcessPorts {
  return {
    run: (check, logFile): Promise<Ended> => {
      seen.ran.push(check);
      writeFileSync(logFile, `output of ${check.name}\n`);
      return Promise.resolve({ status: statusOf(script, check), seconds: 1 });
    },
    runHere: (check) => {
      seen.ran.push(check);
      script.sideEffects[check.name]?.(check);
      return { status: statusOf(script, check), seconds: 1 };
    },
    output: (command: Command) => script.outputs[command.args.join(" ")] ?? "",
    start: (check, logFile) => {
      seen.started.push(check);
      writeFileSync(logFile, `output of ${check.name}\n`);
      return {
        state: () => script.startedState,
        stop: () => {
          seen.stopped.push(check.name);
        },
      };
    },
    freePort: () => Promise.resolve(4999),
    answers: (url) => {
      seen.asked.push(url);
      return Promise.resolve(script.answers[url] ?? "down");
    },
    pause: () => Promise.resolve(),
  };
}

/** A site in a fresh folder, its processes as `script` says. */
export function fakeSite(script: Partial<Script> = {}, env: Record<string, string> = {}): FakeSite {
  const root = mkdtempSync(join(tmpdir(), "bfg-site-test-"));
  const seen: Seen = { ran: [], said: [], complained: [], started: [], stopped: [], asked: [] };
  return {
    site: {
      root,
      env,
      scratch: mkdtempSync(join(tmpdir(), "bfg-site-scratch-")),
      now: () => new Date("2026-10-20T08:00:00Z"),
      say: (line) => {
        seen.said.push(line);
      },
      complain: (line) => {
        seen.complained.push(line);
      },
      processes: fakeProcesses({ ...SCRIPT, ...script }, seen),
    },
    seen,
  };
}

/** A site's config, its defaults filled in: port 4330 unless given. */
export const configOf = (given: Record<string, unknown> = {}): SiteConfig =>
  siteConfigSchema.parse({ devServerPort: 4330, ...given });
