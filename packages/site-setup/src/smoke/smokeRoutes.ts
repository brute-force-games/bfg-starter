import { existsSync, readdirSync } from "node:fs";
import { sep } from "node:path";

/**
 * Which pages the smoke check opens: every page route in the site's src/pages, and, for a route
 * with parameters, the pages bfg-site.json's `smokePages` names for it. A route in `smokeSkip` is
 * left out. A route with parameters and no page named for it is reported, never silently skipped.
 */

/** A page route in src/pages: a path, or a pattern with parameters (`/rooms/[id]`). */
export type PageRoute =
  | { readonly kind: "static"; readonly path: string }
  | { readonly kind: "dynamic"; readonly pattern: string };

/** The files Astro makes pages of; endpoints (.ts, .js) aren't pages. */
const PAGE_EXTENSIONS = [".astro", ".md", ".mdx", ".html"];

/** A file's route: its path in src/pages, its extension and any trailing `index` dropped. */
function routeOf(file: string): PageRoute | undefined {
  const extension = PAGE_EXTENSIONS.find((each) => file.endsWith(each));
  const segments = file.split(sep);
  if (extension === undefined || segments.some((segment) => segment.startsWith("_"))) {
    return undefined;
  }
  const named = [
    ...segments.slice(0, -1),
    file.slice(file.lastIndexOf(sep) + 1, -extension.length),
  ];
  const path = `/${named.filter((segment, at) => !(segment === "index" && at === named.length - 1)).join("/")}`;
  return path.includes("[") ? { kind: "dynamic", pattern: path } : { kind: "static", path };
}

/** The page routes in `pagesDir` (none if there's no such folder), in path order. */
export function pageRoutesIn(pagesDir: string): PageRoute[] {
  if (!existsSync(pagesDir)) {
    return [];
  }
  return readdirSync(pagesDir, { recursive: true, encoding: "utf8" })
    .toSorted()
    .flatMap((file) => routeOf(file) ?? []);
}

/** Whether `path` is one of `pattern`'s pages: `[name]` one segment, `[...name]` any. */
export function patternMatches(pattern: string, path: string): boolean {
  const source = pattern
    .split(/(\[\.\.\.[^\]]+\]|\[[^\]]+\])/u)
    .map((part) => {
      if (part.startsWith("[...")) {
        return ".+";
      }
      return part.startsWith("[") ? "[^/]+" : part.replaceAll(/[.*+?^${}()|\\]/gu, "\\$&");
    })
    .join("");
  return new RegExp(`^${source}/?$`, "u").test(path);
}

/** What bfg-site.json says of the smoke check. */
export interface SmokeConfig {
  /** Pages to open beside the routes found: one or more for each route with parameters. */
  readonly smokePages: readonly string[];
  /** Routes (paths or patterns) not to open. */
  readonly smokeSkip: readonly string[];
}

/**
 * A page to open: its route, the path asked for, and the status it must answer. A page answers
 * 200, but for Astro's own error pages at the root, which answer a fixed status: 404.astro for any
 * path the site doesn't have (asked for at NOT_FOUND_PATH), 500.astro at /500. They're checked
 * like any page, so a broken error page is still caught.
 */
export interface SmokePage {
  readonly route: string;
  readonly path: string;
  readonly status: number;
}

/** A path no site has, for its not-found page. */
export const NOT_FOUND_PATH = "/bfg-smoke-no-such-page";

/** The page `path` is checked as: an error page at its status, any other at 200. */
function smokePageOf(path: string): SmokePage {
  if (path === "/404") {
    return { route: path, path: NOT_FOUND_PATH, status: 404 };
  }
  return { route: path, path, status: path === "/500" ? 500 : 200 };
}

/** The pages to open, and the routes with parameters no page was named for. */
export interface SmokeTargets {
  readonly pages: readonly SmokePage[];
  readonly unlisted: readonly string[];
}

/** What to open of `routes`, as `config` says. */
export function smokeTargetsOf(routes: readonly PageRoute[], config: SmokeConfig): SmokeTargets {
  const skipped = new Set(config.smokeSkip);
  const statics = routes.flatMap((route) =>
    route.kind === "static" && !skipped.has(route.path) ? [route.path] : [],
  );
  const unlisted = routes.flatMap((route) =>
    route.kind === "dynamic" &&
    !skipped.has(route.pattern) &&
    !config.smokePages.some((path) => patternMatches(route.pattern, path))
      ? [route.pattern]
      : [],
  );
  return {
    pages: [...new Set([...statics, ...config.smokePages])].map((path) => smokePageOf(path)),
    unlisted,
  };
}
