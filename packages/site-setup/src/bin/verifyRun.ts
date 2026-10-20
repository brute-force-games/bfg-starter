import { mkdtempSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { ReportTarget } from "../reports/reportRuns.ts";
import {
  OWN_DEV_SERVER_WAIT_SECONDS,
  ownDevServer,
  yourDevServerUrl,
  type OwnDevServer,
} from "./ownDevServer.ts";
import { DEV_SERVER_CACHE_ENV } from "./devServerCaches.ts";
import type { Check, Running, SitePorts } from "./ports.ts";
import type { SiteConfig } from "./siteConfig.ts";
import type { VerifyRun } from "./verifyArgs.ts";
import {
  e2eGate,
  goesOn,
  passes,
  stagesOf,
  verdictOf,
  type CheckResult,
  type E2EDecision,
  type Stage,
  type StageResult,
} from "./verifyStages.ts";
import { checkLine, ownDevServerUnanswered, skippedLine, verdictLine } from "./verifyWords.ts";

/**
 * Runs the test stages: each stage's checks at once, each writing its output to a file in this
 * run's own fresh folder, then a line per check and the whole output of any that failed. The plan
 * and its rules are verifyStages.ts; this is the processes, through the site's ports. e2e runs
 * against the maintainer's dev server, or with `--own-dev-server` one started here, on a free port,
 * its caches in this run's folder, and stopped once e2e ends.
 *
 * Every check runs with Astro's and Vite's caches in this run's folder too (BFG_DEV_SERVER_CACHE,
 * which the Astro preset reads): `astro sync`, `astro check` and Vitest all start Vite, and in the
 * site's own caches they'd re-optimize the dependencies of the maintainer's running dev server
 * under it ("_jsxDEV is not a function").
 */

/** A run in progress: the site, its log folder, and what every check is told. */
interface Run {
  readonly site: SitePorts;
  readonly folder: string;
  readonly env: Readonly<Record<string, string>>;
}

const logFileOf = (folder: string, stage: Stage, check: Check): string =>
  join(folder, `${stage.name}-${check.name}.log`.replaceAll(" ", "-"));

/** Runs `check` with the run's variables under its own. */
async function runCheck(
  { site, folder, env }: Run,
  stage: Stage,
  check: Check,
): Promise<CheckResult> {
  const ended = await site.processes.run(
    { ...check, env: { ...env, ...check.env } },
    logFileOf(folder, stage, check),
  );
  return {
    check,
    outcome: ended.status === 0 ? { kind: "passed" } : { kind: "failed", status: ended.status },
    seconds: ended.seconds,
  };
}

/** Says a stage's results: a line per check, and the whole output of any that failed. */
function report({ site, folder }: Run, stage: Stage, done: readonly CheckResult[]): StageResult {
  for (const result of done) {
    site.say(checkLine(result));
    if (result.outcome.kind !== "passed") {
      site.say(readFileSync(logFileOf(folder, stage, result.check), "utf8"));
    }
  }
  return { stage: stage.name, checks: done };
}

/** Runs a stage's checks: its preparation in turn, then, if that passed, the rest at once. */
async function runChecks(run: Run, stage: Stage): Promise<CheckResult[]> {
  const done: CheckResult[] = [];
  for (const check of stage.prepare) {
    done.push(await runCheck(run, stage, check));
  }
  if (done.every((each) => each.outcome.kind === "passed")) {
    done.push(...(await Promise.all(stage.checks.map((check) => runCheck(run, stage, check)))));
  }
  return done;
}

/** Waits until `server` answers, up to its limit or until it ends: whether it did. */
async function answered(site: SitePorts, server: OwnDevServer, running: Running): Promise<boolean> {
  for (
    let waited = 0;
    waited < OWN_DEV_SERVER_WAIT_SECONDS && running.state().kind === "running";
    waited += 1
  ) {
    if ((await site.processes.answers(server.baseUrl)) === "up") {
      return true;
    }
    await site.processes.pause(1000);
  }
  return false;
}

/** Runs `stage` against a dev server of verify's own, stopped when the stage ends. */
async function withOwnDevServer(run: Run, stage: Stage): Promise<StageResult> {
  const { site, folder } = run;
  const server = ownDevServer(await site.processes.freePort(), join(folder, "dev-server-cache"));
  const started = site.now().getTime();
  const running = site.processes.start(server.check, logFileOf(folder, stage, server.check));
  try {
    site.say(`  … ${server.check.name} at ${server.baseUrl}`);
    if (!(await answered(site, server, running))) {
      const seconds = (site.now().getTime() - started) / 1000;
      return report(run, stage, [ownDevServerUnanswered(server.check, running.state(), seconds)]);
    }
    return report(
      run,
      stage,
      await runChecks({ ...run, env: { ...run.env, ...server.e2eEnv } }, stage),
    );
  } finally {
    running.stop();
  }
}

/** Runs a stage, against its own dev server if it asks for one; reports each check. */
async function runStage(run: Run, stage: Stage): Promise<StageResult> {
  run.site.say(`\n${stage.name}`);
  return stage.devServer.kind === "own"
    ? withOwnDevServer(run, stage)
    : report(run, stage, await runChecks(run, stage));
}

/** e2e's gate, for a `verify` run: the stages below green, and a dev server to run against. */
async function gateFor(
  run: Run,
  stage: Stage,
  below: readonly StageResult[],
  port: number,
): Promise<E2EDecision> {
  return e2eGate(
    below,
    stage.devServer.kind === "own"
      ? { kind: "own" }
      : {
          kind: "yours",
          answers: await run.site.processes.answers(yourDevServerUrl(port, run.site.env)),
        },
  );
}

/** What verify is given: what's asked, the site's config, and where the run's reports go. */
export interface VerifyPlan {
  readonly run: VerifyRun;
  readonly config: SiteConfig;
  readonly reports: ReportTarget;
  /** What every check is told (where the run's reports are). */
  readonly env: Readonly<Record<string, string>>;
}

/** Runs `plan`'s stages; e2e (for `verify`) only if its gate lets it. Whether it passed. */
export async function verify(
  site: SitePorts,
  { run: asked, config, reports, env }: VerifyPlan,
): Promise<boolean> {
  const folder = mkdtempSync(join(site.scratch, "bfg-site-verify-"));
  const run: Run = {
    site,
    folder,
    env: { ...env, [DEV_SERVER_CACHE_ENV]: join(folder, "checks-cache") },
  };
  site.say(`Each check's output: ${run.folder}`);
  if (reports.kind === "folder") {
    site.say(`Reports: ${reports.dir}`);
  }
  const results: StageResult[] = [];
  let gate: E2EDecision = { kind: "not-asked" };
  for (const stage of stagesOf(asked, config, reports)) {
    if (stage.name === "e2e" && asked.kind === "verify") {
      gate = await gateFor(run, stage, results, config.devServerPort);
      if (gate.kind === "skip") {
        site.say(`\n${skippedLine(gate.reason)}`);
        break;
      }
    }
    const result = await runStage(run, stage);
    results.push(result);
    if (!goesOn(asked, result)) {
      break;
    }
  }
  const verdict = verdictOf(asked, results, gate);
  site.say(`\n${verdictLine(verdict)}`);
  return passes(verdict);
}
