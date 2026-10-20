import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { indexPages, type IndexStarted, type PageIndex, type PageIndexer } from "../../src/integrations/pageSearch.ts";

/** Search over a built site's pages (src/integrations/pageSearch.ts), with Pagefind itself. */

let site: string;

beforeEach(() => {
  site = mkdtempSync(join(tmpdir(), "bfg-page-search-"));
});

afterEach(() => {
  rmSync(site, { recursive: true, force: true });
});

/** A built page at `path`, its body marked for search. */
function page(path: string, text: string): void {
  const full = join(site, path);
  mkdirSync(join(full, ".."), { recursive: true });
  writeFileSync(full, `<!doctype html><html lang="en"><body><main data-pagefind-body><h1>${text}</h1><p>${text} words.</p></main></body></html>`);
}

describe("page search", () => {
  it("indexes the pages its glob picks, writing the index beside them", async () => {
    // Arrange
    page("guide/start/index.html", "Getting started");
    page("guide/play/index.html", "Playing");
    page("about/index.html", "About");
    // Act
    const indexed = await indexPages(site, "guide/**/*.html");
    // Assert
    expect(indexed).toBe(2);
    expect(existsSync(join(site, "pagefind", "pagefind.js"))).toBe(true);
  });

  it.each([
    {
      what: "start",
      indexer: standIn({ errors: ["no binary"] }),
      error: "Pagefind couldn't start: no binary",
    },
    {
      what: "index the pages",
      indexer: standIn({ errors: [], index: indexReporting(["bad page"], ["no room"]) }),
      error: "Pagefind couldn't index the pages: bad page; no room",
    },
  ])("fails the build when Pagefind can't $what, and closes it", async ({ indexer, error }) => {
    await expect(indexPages(site, "**/*.html", indexer)).rejects.toThrow(error);
    expect(indexer.closed()).toBe(true);
  });
});

/** A Pagefind stand-in whose index is `created`; it says whether it was closed. */
function standIn(created: IndexStarted): PageIndexer & { readonly closed: () => boolean } {
  let closed = false;
  return {
    createIndex: () => Promise.resolve(created),
    close: () => {
      closed = true;
      return Promise.resolve();
    },
    closed: () => closed,
  };
}

/** An index whose adding and writing report `addErrors` and `writeErrors`. */
const indexReporting = (addErrors: readonly string[], writeErrors: readonly string[]): PageIndex => ({
  addDirectory: () => Promise.resolve({ errors: addErrors, page_count: 1 }),
  writeFiles: () => Promise.resolve({ errors: writeErrors }),
});
