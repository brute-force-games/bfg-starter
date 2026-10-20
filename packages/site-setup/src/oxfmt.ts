import type { OxfmtConfig } from "oxfmt";

/**
 * A Brute Force Games site's formatting (oxfmt, which has no `extends`): a site's oxfmt.config.ts
 * returns this, adding what's its own to leave alone. Loaded in plain Node before any bundler
 * (review row 8): it imports only its peer tools.
 */

/**
 * What the formatter never rewrites, in every site: prose someone authored (docs/; content/,
 * where oxfmt would also break MDX's JSX comments), lock files, and tool output and settings.
 */
export const UNFORMATTED: readonly string[] = [
  "docs/**",
  "content/**",
  "package-lock.json",
  "test-results/**",
  ".claude/**",
];

export interface SiteOxfmtOptions {
  /** The site's own files to leave alone: generated code, say. */
  readonly ignore?: readonly string[];
}

export const siteOxfmtConfig = ({ ignore = [] }: SiteOxfmtOptions = {}): OxfmtConfig => ({
  ignorePatterns: [...UNFORMATTED, ...ignore],
});
