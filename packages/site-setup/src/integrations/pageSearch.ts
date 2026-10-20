import { join } from "node:path";
// Imported up front: by the time a build is done, Astro has closed the module loader a dynamic
// import() would go through.
import * as pagefind from "pagefind";

/**
 * Search over a built site's pages, with no server: Pagefind indexes the pages `glob` picks (only
 * what each marks `data-pagefind-body`), writing its index and search script to `pagefind/` in
 * the built site; the search runs in the browser. Indexing errors fail the build.
 */

/** Pages added to an index: how many, and what went wrong. */
interface PagesAdded {
  readonly errors: readonly string[];
  readonly page_count: number;
}

/** An index written out: what went wrong. */
interface IndexWritten {
  readonly errors: readonly string[];
}

/** A Pagefind index, as indexing uses it. */
export interface PageIndex {
  readonly addDirectory: (directory: {
    readonly path: string;
    readonly glob: string;
  }) => Promise<PagesAdded>;
  readonly writeFiles: (output: { readonly outputPath: string }) => Promise<IndexWritten>;
}

/** Pagefind started: its index, or what stopped it. */
export interface IndexStarted {
  readonly errors: readonly string[];
  readonly index?: PageIndex;
}

/** What indexing needs of Pagefind: the module itself, or a stand-in in tests. */
export interface PageIndexer {
  readonly createIndex: () => Promise<IndexStarted>;
  readonly close: () => Promise<unknown>;
}

/** Indexes the pages `glob` picks in the built site at `site`; how many it indexed. */
export async function indexPages(
  site: string,
  glob: string,
  indexer: PageIndexer = pagefind,
): Promise<number> {
  try {
    const { index, errors } = await indexer.createIndex();
    if (index === undefined) {
      throw new Error(`Pagefind couldn't start: ${errors.join("; ")}`);
    }
    const added = await index.addDirectory({ path: site, glob });
    const written = await index.writeFiles({ outputPath: join(site, "pagefind") });
    const problems = [...added.errors, ...written.errors];
    if (problems.length > 0) {
      throw new Error(`Pagefind couldn't index the pages: ${problems.join("; ")}`);
    }
    return added.page_count;
  } finally {
    await indexer.close();
  }
}
