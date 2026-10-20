import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { shortCommitIn } from "../reports/reportRuns.ts";

/** The site's own files, as bfg-site reads and writes them: whole, and its commit from git's files. */

/** Writes `text` to `path` whole: to a file of this process's own, then renamed over it. */
export function writeWhole(path: string, text: string): void {
  mkdirSync(dirname(path), { recursive: true });
  const partial = `${path}.${String(process.pid)}.partial`;
  writeFileSync(partial, text);
  renameSync(partial, path);
}

/** Writes `value` to `path` whole, as JSON. */
export const writeJson = (path: string, value: unknown): void => {
  writeWhole(path, `${JSON.stringify(value, null, 2)}\n`);
};

/** The JSON in the file at `path`, or undefined when there's no file. */
export const jsonAt = (path: string): unknown =>
  existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : undefined;

/** The commit the site at `root` has checked out, from git's own files: never by running git. */
export const commitOf = (root: string): string =>
  shortCommitIn((path) => {
    const file = join(root, ".git", path);
    return existsSync(file) ? readFileSync(file, "utf8") : undefined;
  }) ?? "no-commit";
