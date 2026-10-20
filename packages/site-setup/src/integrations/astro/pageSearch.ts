import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import { indexPages } from "../pageSearch.ts";

/** Search over the built site's pages (pageSearch.ts, where it's tested): Astro's hook only. */

export interface PageSearchOptions {
  /** The pages to index, in the built site: `rules/**\/*.html`, say. */
  readonly glob: string;
}

export const pageSearch = ({ glob }: PageSearchOptions): AstroIntegration => ({
  name: "bfg:page-search",
  hooks: {
    "astro:build:done": async ({ dir, logger }) => {
      const pages = await indexPages(fileURLToPath(dir), glob);
      logger.info(`Indexed ${String(pages)} pages for search.`);
    },
  },
});
