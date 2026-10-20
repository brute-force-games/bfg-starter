import { relative } from "node:path";

/**
 * In dev, every open tab hears which source file just changed (the custom HMR event
 * `bfg:code-changed`, its path from the site's root), so a page can tell when hot reload can't
 * bring all of it up to date: a Web Worker never hot-reloads, and a tab that lost its connection
 * to the dev server misses updates. The page decides; this only tells it.
 */

/** The HMR event a page listens for (`import.meta.hot.on`). */
export const CODE_CHANGED_EVENT = "bfg:code-changed";

/** The message the dev server sends every tab when `file` changes, in the site at `root`. */
export interface CodeChanged {
  readonly type: "custom";
  readonly event: typeof CODE_CHANGED_EVENT;
  readonly data: string;
}

export const codeChanged = (root: string, file: string): CodeChanged => ({
  type: "custom",
  event: CODE_CHANGED_EVENT,
  data: relative(root, file),
});

/** Whether a run wants the warning: the dev server only (not a build, not Vitest's hooks). */
export const warnsOfStaleCode = (command: string, env: NodeJS.ProcessEnv): boolean =>
  command === "dev" && env["VITEST"] === undefined;
