import { glob, type Loader } from "astro/loaders";

/**
 * A site's content collections (its src/content.config.ts): authored files under content/, one
 * folder per collection, each loaded by glob and checked against the site's own schema. Loaded in
 * plain Node before any bundler (review row 8): it imports only its peer tools.
 */

/** The folder every collection's files live in, at the site's root. */
export const CONTENT_FOLDER = "./content";

/** What a collection's files are: pages (Markdown, MDX) or data (YAML, one entry a file). */
export type ContentKind = "pages" | "data";

/** Which files a collection's glob loads: its pattern, under its folder. */
export interface ContentFiles {
  readonly pattern: string;
  readonly base: string;
}

const PATTERNS: Readonly<Record<ContentKind, string>> = {
  pages: "**/*.{md,mdx}",
  data: "**/*.{yaml,yml}",
};

export const contentFilesIn = (folder: string, kind: ContentKind): ContentFiles => ({
  pattern: PATTERNS[kind],
  base: `${CONTENT_FOLDER}/${folder}`,
});

/** The Markdown and MDX pages in content/`folder`. */
export const markdownIn = (folder: string): Loader => glob({ ...contentFilesIn(folder, "pages") });

/** The YAML data files in content/`folder`. */
export const yamlIn = (folder: string): Loader => glob({ ...contentFilesIn(folder, "data") });
