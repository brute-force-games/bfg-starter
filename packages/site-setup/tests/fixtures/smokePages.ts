import type { PageVisit, SmokePorts } from "../../src/smoke/smokeCheck.ts";

/**
 * A dev server and browser for the smoke check, stood in for: each page's HTTP status and what the
 * browser sees there, by its address. An address not named has no server behind it.
 */

/** A page as the stand-ins serve it. */
export interface FakePage {
  readonly status: number;
  readonly visit: PageVisit;
}

/** A page that answers 200, opens cleanly and reads Ready. */
export const HEALTHY: FakePage = {
  status: 200,
  visit: { pageErrors: [], serverErrors: [], ready: true },
};

/** What the stand-ins saw: the pages visited, and how many browsers were closed. */
export interface SmokeSeen {
  readonly visited: string[];
  closed: number;
}

export interface FakeSmoke {
  readonly ports: SmokePorts;
  readonly seen: SmokeSeen;
}

/** The smoke check's ports over `pages`, by their full address. */
export function fakeSmoke(pages: Readonly<Record<string, FakePage>>): FakeSmoke {
  const seen: SmokeSeen = { visited: [], closed: 0 };
  const pageAt = (url: string): FakePage | undefined =>
    Object.hasOwn(pages, url) ? pages[url] : undefined;
  return {
    ports: {
      fetchPage: (input) => {
        const page = pageAt(input instanceof Request ? input.url : input.toString());
        return page === undefined
          ? Promise.reject(new TypeError("fetch failed"))
          : Promise.resolve(new Response("", { status: page.status }));
      },
      openBrowser: () =>
        Promise.resolve({
          timeoutMs: 15_000,
          visit: (url) => {
            seen.visited.push(url);
            return Promise.resolve(pageAt(url)?.visit ?? HEALTHY.visit);
          },
          close: () => {
            seen.closed += 1;
            return Promise.resolve();
          },
        }),
    },
    seen,
  };
}
