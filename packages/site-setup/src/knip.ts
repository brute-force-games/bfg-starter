import type { IssueType, KnipConfiguration } from "knip";

/**
 * A Brute Force Games site's dead-code check (knip): every kind of finding is an error, held at
 * zero. A site's knip.ts gives what knip can't follow by itself (entries it loads by glob or
 * injects, generated files, binaries run by name), each with why. Loaded in plain Node before any
 * bundler (review row 8): it imports only its peer tools.
 */

export interface SiteKnipOptions {
  /** Files used in ways knip can't follow (globbed, injected as routes), beside the content's. */
  readonly entry?: readonly string[];
  /** Files that aren't the site's to delete: generated, or reference copies. */
  readonly ignore?: readonly string[];
  /** Packages run by name (a binary, a plugin) rather than imported. */
  readonly ignoreDependencies?: readonly string[];
}

/** Astro's content collections load these by glob (src/content.config.ts), never by import. */
export const CONTENT_ENTRIES: readonly string[] = ["content/**/*.{md,mdx}"];

/** Every kind of dead code knip reports, each held at zero. */
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
}: SiteKnipOptions = {}): KnipConfiguration {
  return {
    entry: [...CONTENT_ENTRIES, ...entry],
    ignore: [...ignore],
    ignoreDependencies: [...ignoreDependencies],
    rules: { ...DEAD_CODE_RULES },
  };
}
