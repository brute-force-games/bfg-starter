import { existsSync } from "node:fs";
import { join } from "node:path";
import type { IssueType, KnipConfiguration } from "knip";

/**
 * A Brute Force Games site's dead-code check (knip): every kind of finding is an error, held at
 * zero. A site's knip.ts gives what knip can't follow by itself (entries it loads by glob or
 * injects, generated files, binaries run by name), each with why. Loaded in plain Node before any
 * bundler (review row 8): it imports only its peer tools and node:.
 */

export interface SiteKnipOptions {
  /** Files used in ways knip can't follow (globbed, injected as routes), beside the content's. */
  readonly entry?: readonly string[];
  /** Files that aren't the site's to delete: generated, or reference copies. */
  readonly ignore?: readonly string[];
  /** Packages run by name (a binary, a plugin) rather than imported. */
  readonly ignoreDependencies?: readonly string[];
  /** Programs the site's scripts run that no package provides (the system's `mktemp`, say). */
  readonly ignoreBinaries?: readonly string[];
  /** The site's folder: where knip runs, unless given. */
  readonly root?: string;
}

/**
 * Astro's content collections load these by glob (src/content.config.ts), never by import: an
 * entry only for a site that has a content/ folder (knip hints at an entry that matches nothing).
 */
export const CONTENT_ENTRIES: readonly string[] = ["content/**/*.{md,mdx}"];

/** The content entries, if the site at `root` has content. */
const contentEntriesIn = (root: string): readonly string[] =>
  existsSync(join(root, "content")) ? CONTENT_ENTRIES : [];

/**
 * Every kind of dead code knip reports, each held at zero: a bare `knip` exits non-zero on any.
 * Unused exports and types are errors here too; a site ratchets those two down through `bfg-site
 * dead-code`, whose baseline lets them stand but never rise (README, "The `bfg-site` command").
 */
export const DEAD_CODE_RULES: Readonly<Partial<Record<IssueType, "error">>> = {
  files: "error",
  dependencies: "error",
  devDependencies: "error",
  optionalPeerDependencies: "error",
  unlisted: "error",
  unresolved: "error",
  binaries: "error",
  exports: "error",
  types: "error",
  enumMembers: "error",
  nsExports: "error",
  nsTypes: "error",
  duplicates: "error",
};

export function siteKnipConfig({
  entry = [],
  ignore = [],
  ignoreDependencies = [],
  ignoreBinaries = [],
  root = process.cwd(),
}: SiteKnipOptions = {}): KnipConfiguration {
  return {
    entry: [...contentEntriesIn(root), ...entry],
    ignore: [...ignore],
    ignoreDependencies: [...ignoreDependencies],
    ignoreBinaries: [...ignoreBinaries],
    rules: { ...DEAD_CODE_RULES },
  };
}
