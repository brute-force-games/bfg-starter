import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import {
  keptRunsOf,
  keptRunsProblem,
  REPORT_DIR_ENV,
  REPORTS_FOLDER,
  REPORTS_KEEP_ENV,
  runNameOf,
  runsToPrune,
  shortCommitIn,
} from "./reportRuns.ts";

/**
 * A run's reports folder, made (reportRuns.ts names it and says what's pruned): a new folder of
 * its own under the site's reports/, the oldest runs past `REPORTS_KEEP` removed, and the
 * variable its checks find it in. Tested on a real folder.
 */

/** A run's reports, ready: their folder, and what its checks are told. */
export interface ReadyReports {
  readonly kind: "ready";
  readonly dir: string;
  readonly env: Readonly<Record<string, string>>;
}

/** A run's reports, ready, or why they can't be. */
export type RunReports = ReadyReports | { readonly kind: "unreadable"; readonly problem: string };

/** A file under `root`'s .git/, as git wrote it, or undefined: git itself is never run. */
const gitFileIn =
  (root: string) =>
  (path: string): string | undefined => {
    const file = join(root, ".git", path);
    return existsSync(file) ? readFileSync(file, "utf8") : undefined;
  };

/** Makes a run's reports folder in the site at `root` (its repo's root), at `now`, as `env` says to keep them. */
export function openRunReports(
  root: string,
  env: Readonly<Record<string, string | undefined>>,
  now: Date,
): RunReports {
  const kept = keptRunsOf(env[REPORTS_KEEP_ENV]);
  if (kept.kind === "unreadable") {
    return { kind: "unreadable", problem: keptRunsProblem(kept.given) };
  }
  const all = join(root, REPORTS_FOLDER);
  const dir = join(all, runNameOf(now, shortCommitIn(gitFileIn(root))));
  mkdirSync(all, { recursive: true });
  // Not recursive: the run's own folder is new, or this fails rather than share one.
  mkdirSync(dir);
  for (const old of runsToPrune(readdirSync(all), kept.runs)) {
    rmSync(join(all, old), { recursive: true, force: true });
  }
  return { kind: "ready", dir, env: { [REPORT_DIR_ENV]: dir } };
}
