import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  SMOKE_TIMEOUT_MS,
  smokeLines,
  smokePages,
  smokePasses,
  smokeSite,
  visitProblem,
  type PageVisit,
  type SmokeOutcome,
} from "../../src/smoke/smokeCheck.ts";
import { NOT_FOUND_PATH } from "../../src/smoke/smokeRoutes.ts";
import { fakeSmoke, HEALTHY, pageAt } from "../fixtures/smokePages.ts";

/** The smoke check (src/smoke/smokeCheck.ts), its server and browser stood in for. */

const SERVER = "http://localhost:4330";
const CLEAN: PageVisit = HEALTHY.visit;

/** Visits, and the first thing wrong in each. */
const VISITS = [
  { what: "nothing", visit: CLEAN, problem: undefined },
  {
    what: "a server error first",
    visit: {
      pageErrors: ["boom"],
      serverErrors: [{ url: `${SERVER}/a.js`, status: 504 }],
      ready: false,
    },
    problem: { kind: "server-error", error: { url: `${SERVER}/a.js`, status: 504 } },
  },
  {
    what: "an uncaught error before no Ready",
    visit: { pageErrors: ["_jsxDEV is not a function", "later"], serverErrors: [], ready: false },
    problem: { kind: "page-error", message: "_jsxDEV is not a function" },
  },
  {
    what: "no Ready",
    visit: { ...CLEAN, ready: false },
    problem: { kind: "never-ready", seconds: SMOKE_TIMEOUT_MS / 1000 },
  },
];

describe("what's wrong in a visit", () => {
  it.each(VISITS)("finds $what", ({ visit, problem }) => {
    expect(visitProblem(visit, SMOKE_TIMEOUT_MS)).toEqual(problem);
  });
});

describe("opening the pages", () => {
  it("opens each page that answers 200, and finds each failure's first problem", async () => {
    // Arrange
    const { ports, seen } = fakeSmoke({
      [`${SERVER}/`]: HEALTHY,
      [`${SERVER}/broken`]: { ...HEALTHY, status: 500 },
      [`${SERVER}/stuck`]: { status: 200, visit: { ...CLEAN, ready: false } },
    });
    // Act
    const failures = await smokePages(
      SERVER,
      ["/", "/broken", "/stuck", "/gone"].map((path) => pageAt(path)),
      ports,
    );
    // Assert
    expect(failures).toEqual([
      { page: pageAt("/broken"), problem: { kind: "http-status", status: 500, expected: 200 } },
      { page: pageAt("/stuck"), problem: { kind: "never-ready", seconds: 15 } },
      {
        page: pageAt("/gone"),
        problem: { kind: "unreachable", message: "TypeError: fetch failed" },
      },
    ]);
    expect(seen.visited).toEqual([`${SERVER}/`, `${SERVER}/stuck`]);
    expect(seen.closed).toBe(1);
  });

  it("closes the browser even when a visit throws", async () => {
    // Arrange
    let closed = false;
    const ports = {
      fetchPage: () => Promise.resolve(new Response("")),
      openBrowser: () =>
        Promise.resolve({
          timeoutMs: 1000,
          visit: () => Promise.reject(new Error("browser crashed")),
          close: () => {
            closed = true;
            return Promise.resolve();
          },
        }),
    };
    // Act, Assert
    await expect(smokePages(SERVER, [pageAt("/")], ports)).rejects.toThrow("browser crashed");
    expect(closed).toBe(true);
  });
});

/** A smoke config naming no pages and skipping none. */
const NO_PAGES = { smokePages: [], smokeSkip: [] };

/** A site whose src/pages holds `files`. */
function siteWith(...files: string[]): string {
  const root = mkdtempSync(join(tmpdir(), "bfg-site-smoke-"));
  mkdirSync(join(root, "src", "pages", "rooms"), { recursive: true });
  for (const file of files) {
    writeFileSync(join(root, "src", "pages", file), "");
  }
  return root;
}

describe("smoke-checking a site", () => {
  it("opens its pages and passes when they're all healthy", async () => {
    // Arrange
    const root = siteWith("index.astro", "about.astro", "rooms/[id].astro");
    const { ports } = fakeSmoke({
      [SERVER]: HEALTHY,
      [`${SERVER}/`]: HEALTHY,
      [`${SERVER}/about`]: HEALTHY,
      [`${SERVER}/rooms/demo`]: HEALTHY,
    });
    // Act
    const outcome = await smokeSite(
      root,
      { smokePages: ["/rooms/demo"], smokeSkip: [] },
      SERVER,
      ports,
    );
    // Assert
    expect(outcome).toEqual({
      kind: "checked",
      baseUrl: SERVER,
      pages: ["/about", "/", "/rooms/demo"].map((path) => pageAt(path)),
      failures: [],
      unlisted: [],
    });
    expect(smokePasses(outcome)).toBe(true);
    expect(smokeLines(outcome)).toEqual(["Smoke: 3 pages healthy at http://localhost:4330."]);
  });
});

describe("smoke-checking a site whose server is sick or gone", () => {
  it("says there's no dev server when nothing answers", async () => {
    // Arrange
    const { ports, seen } = fakeSmoke({});
    // Act
    const outcome = await smokeSite(siteWith("index.astro"), NO_PAGES, SERVER, ports);
    // Assert
    expect(outcome).toEqual({ kind: "no-dev-server", baseUrl: SERVER });
    expect(smokePasses(outcome)).toBe(false);
    expect(smokeLines(outcome)).toEqual([
      "No dev server at http://localhost:4330. Start it with `npm run dev`, then run this again.",
    ]);
    expect(seen.visited).toEqual([]);
  });

  it("checks the pages of a server whose home page is an error", async () => {
    // Arrange
    const { ports } = fakeSmoke({
      [SERVER]: { ...HEALTHY, status: 500 },
      [`${SERVER}/`]: { ...HEALTHY, status: 500 },
    });
    // Act
    const outcome = await smokeSite(siteWith("index.astro"), NO_PAGES, SERVER, ports);
    // Assert
    expect(outcome).toMatchObject({
      failures: [
        { page: pageAt("/"), problem: { kind: "http-status", status: 500, expected: 200 } },
      ],
    });
  });
});

describe("what a smoke check says", () => {
  it("says each failed page's first problem, each unchecked route, and a red summary", () => {
    // Arrange
    const outcome: SmokeOutcome = {
      kind: "checked",
      baseUrl: SERVER,
      pages: ["/", "/a", "/b", "/c", "/d", "/e"].map((path) => pageAt(path)),
      failures: [
        { page: pageAt("/"), problem: { kind: "http-status", status: 500, expected: 200 } },
        { page: pageAt("/a"), problem: { kind: "unreachable", message: "timed out" } },
        {
          page: pageAt("/b"),
          problem: { kind: "server-error", error: { url: `${SERVER}/x.js`, status: 504 } },
        },
        {
          page: pageAt("/c"),
          problem: { kind: "page-error", message: "_jsxDEV is not a function" },
        },
        { page: pageAt("/d"), problem: { kind: "never-ready", seconds: 15 } },
      ],
      unlisted: ["/rooms/[id]"],
    };
    // Act
    const lines = smokeLines(outcome);
    // Assert
    expect(lines).toEqual([
      "  ✗ /: HTTP 500, not 200",
      "  ✗ /a: no answer (timed out)",
      "  ✗ /b: HTTP 504 for http://localhost:4330/x.js",
      "  ✗ /c: uncaught error: _jsxDEV is not a function",
      "  ✗ /d: its status didn't read Ready within 15s",
      "  ✗ /rooms/[id]: has parameters; name a page for it in bfg-site.json's smokePages (or list it in smokeSkip)",
      "Smoke: red at http://localhost:4330 (5 of 6 pages failed, 1 routes unchecked). Restart the dev server if it's stale.",
    ]);
    expect(smokePasses(outcome)).toBe(false);
  });

  it("is red with only an unchecked route", () => {
    const outcome: SmokeOutcome = {
      kind: "checked",
      baseUrl: SERVER,
      pages: [],
      failures: [],
      unlisted: ["/x/[y]"],
    };
    expect(smokePasses(outcome)).toBe(false);
  });
});

describe("what a smoke check says of an error page", () => {
  it("names the path an error page was asked for", () => {
    // Arrange
    const notFound = { route: "/404", path: NOT_FOUND_PATH, status: 404 };
    const outcome: SmokeOutcome = {
      kind: "checked",
      baseUrl: SERVER,
      pages: [notFound],
      failures: [{ page: notFound, problem: { kind: "http-status", status: 200, expected: 404 } }],
      unlisted: [],
    };
    // Act
    const [line] = smokeLines(outcome);
    // Assert
    expect(line).toBe("  ✗ /404 (asked for /bfg-smoke-no-such-page): HTTP 200, not 404");
  });
});
