import { spawn, spawnSync, type ChildProcessWithoutNullStreams } from "node:child_process";
import { createWriteStream, type WriteStream } from "node:fs";
import { createServer, type AddressInfo } from "node:net";
import { devServerAnswersAt } from "../devServerUp.ts";
import type { Command } from "../reports/complexityReport.ts";
import type { Check, Ended, ProcessPorts, ProcessState, Running } from "./ports.ts";

/** The real processes, run in the site's folder, `root`, over the environment `env`. */

const secondsSince = (started: number): number => (performance.now() - started) / 1000;

/**
 * Sends a child's output and errors both to `output`, which closes once the child has: neither
 * stream closes it when it ends, so the other's last lines aren't lost.
 */
function logBoth(child: ChildProcessWithoutNullStreams, output: WriteStream): void {
  child.stdout.pipe(output, { end: false });
  child.stderr.pipe(output, { end: false });
}

/** Runs `check`, its output to `logFile`; resolves when it ends. */
const runToFile =
  (root: string, env: NodeJS.ProcessEnv) =>
  (check: Check, logFile: string): Promise<Ended> => {
    const started = performance.now();
    const output = createWriteStream(logFile);
    return new Promise((resolve) => {
      const child = spawn(check.program, [...check.args], {
        cwd: root,
        env: { ...env, ...check.env },
      });
      logBoth(child, output);
      child.on("close", (status) => {
        output.end(() => {
          resolve({ status, seconds: secondsSince(started) });
        });
      });
    });
  };

/**
 * Starts `check` in its own process group (so stopping it stops everything it started), stopped
 * too if this process ends first.
 */
const startDetached =
  (root: string, env: NodeJS.ProcessEnv) =>
  (check: Check, logFile: string): Running => {
    const output = createWriteStream(logFile);
    const child = spawn(check.program, [...check.args], {
      cwd: root,
      env: { ...env, ...check.env },
      detached: true,
    });
    logBoth(child, output);
    child.on("close", () => {
      output.end();
    });
    let state: ProcessState = { kind: "running" };
    const stop = (): void => {
      process.off("exit", stop);
      if (state.kind === "running" && child.pid !== undefined) {
        process.kill(-child.pid, "SIGTERM");
      }
    };
    child.on("exit", (status) => {
      state = { kind: "ended", status };
    });
    process.on("exit", stop);
    return { state: () => state, stop };
  };

/** The port in a listening TCP socket's address; a pipe's (a path) or a closed one's has none. */
export function portIn(address: AddressInfo | string | null): number {
  if (address === null || typeof address === "string") {
    throw new Error(`no TCP port in ${String(address)}`);
  }
  return address.port;
}

/** A port nothing is listening on now: one the system gives, and lets go of at once. */
function freePort(): Promise<number> {
  const probe = createServer();
  return new Promise<AddressInfo | string | null>((resolve, reject) => {
    probe.on("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      resolve(probe.address());
    });
  })
    .then(
      (address) =>
        new Promise<AddressInfo | string | null>((resolve) => {
          probe.close(() => {
            resolve(address);
          });
        }),
    )
    .then(portIn);
}

export function nodeProcesses(root: string, env: NodeJS.ProcessEnv): ProcessPorts {
  return {
    run: runToFile(root, env),
    runHere: (check) => {
      const started = performance.now();
      const ran = spawnSync(check.program, [...check.args], {
        cwd: root,
        env: { ...env, ...check.env },
        stdio: "inherit",
      });
      return { status: ran.status, seconds: secondsSince(started) };
    },
    output: (command: Command) => {
      const ran = spawnSync(command.program, [...command.args], {
        cwd: root,
        env,
        encoding: "utf8",
        maxBuffer: 64 * 1024 * 1024,
      });
      if (ran.error !== undefined) {
        throw ran.error;
      }
      return ran.stdout;
    },
    start: startDetached(root, env),
    freePort,
    answers: (url) => devServerAnswersAt(url, fetch),
    pause: (ms) =>
      new Promise((resolve) => {
        setTimeout(resolve, ms);
      }),
  };
}
