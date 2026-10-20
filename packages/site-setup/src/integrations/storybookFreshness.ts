import { existsSync, readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";

/**
 * Whether the Storybook snapshot `/storybook/` serves is older than what it's built from, so
 * the dev server can rebuild it rather than serve stale stories.
 */

/** Files Storybook bundles: components, their stories and styles, and what they import. */
const BUNDLED = new Set([".ts", ".tsx", ".css"]);
const SKIPPED_DIRS = new Set(["node_modules", ".git", "dist", "storybook-static", ".builds"]);

/** Whether a changed file can change the Storybook build. */
export const isBundledSource = (path: string): boolean => BUNDLED.has(extname(path));

/** The newest modification time (ms) of any bundled source under `dirs`; 0 if there are none. */
export function newestSourceTime(dirs: readonly string[]): number {
  let newest = 0;
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SKIPPED_DIRS.has(entry.name)) {
          walk(path);
        }
      } else if (entry.isFile() && isBundledSource(path)) {
        newest = Math.max(newest, statSync(path).mtimeMs);
      }
    }
  };
  for (const dir of dirs) {
    if (existsSync(dir)) {
      walk(dir);
    }
  }
  return newest;
}

/** When the snapshot in `root` was built (its index's time), or undefined if there isn't one. */
function snapshotTime(root: string): number | undefined {
  const index = join(root, "index.json");
  return existsSync(index) ? statSync(index).mtimeMs : undefined;
}

/** The snapshot is missing, or a bundled source changed after it was built. */
export function snapshotIsStale(root: string, sourceDirs: readonly string[]): boolean {
  const built = snapshotTime(root);
  return built === undefined || newestSourceTime(sourceDirs) > built;
}
