import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import {
  pageRoutesIn,
  patternMatches,
  smokeTargetsOf,
  type PageRoute,
} from "../../src/smoke/smokeRoutes.ts";

/** Which pages the smoke check opens (src/smoke/smokeRoutes.ts): found in src/pages, and named. */

/** A fresh src/pages holding `files`. */
function pagesWith(...files: string[]): string {
  const pages = join(mkdtempSync(join(tmpdir(), "bfg-site-pages-")), "src", "pages");
  for (const file of files) {
    mkdirSync(dirname(join(pages, file)), { recursive: true });
    writeFileSync(join(pages, file), "");
  }
  return pages;
}

describe("the page routes in src/pages", () => {
  it("finds each page's path, an index its folder's", () => {
    // Arrange
    const pages = pagesWith(
      "index.astro",
      "about.astro",
      "docs/index.md",
      "docs/setup.mdx",
      "old.html",
    );
    // Act
    const routes = pageRoutesIn(pages);
    // Assert
    expect(routes).toEqual([
      { kind: "static", path: "/about" },
      { kind: "static", path: "/docs" },
      { kind: "static", path: "/docs/setup" },
      { kind: "static", path: "/" },
      { kind: "static", path: "/old" },
    ]);
  });

  it("leaves out endpoints and anything under an underscore", () => {
    const pages = pagesWith(
      "feed.xml.ts",
      "api/rooms.js",
      "_parts/Header.astro",
      "_draft.astro",
      "home.astro",
    );
    expect(pageRoutesIn(pages)).toEqual([{ kind: "static", path: "/home" }]);
  });

  it("finds routes with parameters as patterns", () => {
    const pages = pagesWith("rooms/[id].astro", "docs/[...slug].astro");
    expect(pageRoutesIn(pages)).toEqual([
      { kind: "dynamic", pattern: "/docs/[...slug]" },
      { kind: "dynamic", pattern: "/rooms/[id]" },
    ]);
  });

  it("finds none without a src/pages", () => {
    expect(pageRoutesIn(join(tmpdir(), "no-such-site", "src", "pages"))).toEqual([]);
  });
});

describe("a pattern's pages", () => {
  it.each([
    { pattern: "/rooms/[id]", path: "/rooms/abc", matches: true },
    { pattern: "/rooms/[id]", path: "/rooms/abc/", matches: true },
    { pattern: "/rooms/[id]", path: "/rooms/abc/def", matches: false },
    { pattern: "/rooms/[id]", path: "/rooms", matches: false },
    { pattern: "/docs/[...slug]", path: "/docs/a/b", matches: true },
    { pattern: "/v1.0/[id]", path: "/v1x0/a", matches: false },
  ])("$pattern matches $path: $matches", ({ pattern, path, matches }) => {
    expect(patternMatches(pattern, path)).toBe(matches);
  });
});

describe("what the smoke check opens", () => {
  const routes: PageRoute[] = [
    { kind: "static", path: "/" },
    { kind: "static", path: "/raw" },
    { kind: "dynamic", pattern: "/rooms/[id]" },
    { kind: "dynamic", pattern: "/feeds/[name]" },
  ];

  it("opens every route without parameters, and the pages named, once each", () => {
    // Act
    const targets = smokeTargetsOf(routes, {
      smokePages: ["/rooms/demo", "/"],
      smokeSkip: ["/raw", "/feeds/[name]"],
    });
    // Assert
    expect(targets).toEqual({ paths: ["/", "/rooms/demo"], unlisted: [] });
  });

  it("reports a route with parameters that no page was named for", () => {
    const targets = smokeTargetsOf(routes, { smokePages: [], smokeSkip: [] });
    expect(targets).toEqual({ paths: ["/", "/raw"], unlisted: ["/rooms/[id]", "/feeds/[name]"] });
  });
});
