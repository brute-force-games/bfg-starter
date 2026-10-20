import { join } from "node:path";
import { onCase, type Cases } from "@brute-force-games/cases";
import { pageRoutesIn, smokeTargetsOf, type SmokeConfig } from "./smokeRoutes.ts";

/**
 * The smoke check: is the dev server healthy, page by page, before any heavy run starts? For every
 * page, an HTTP 200, then a headless browser opening it with no uncaught error, no server error
 * while it loads (Vite answers 504 for a dependency it re-optimized under a running server), and
 * its "Page status" reading Ready in time. `bfg-site smoke` runs it, verify runs it first, and the
 * e2e gate (devServerUp.ts) runs it before any test. Never a server of its own: it checks the one
 * it's pointed at.
 */

/** How long a page has to answer, and then to read Ready. */
export const SMOKE_TIMEOUT_MS = 15_000;

/** A server error while a page loads: what was asked for, and the status. */
export interface ServerError {
  readonly url: string;
  readonly status: number;
}

/** What opening a page in the browser saw. */
export interface PageVisit {
  /** Uncaught errors in the page, in order. */
  readonly pageErrors: readonly string[];
  /** Responses of 500 or more while it loaded, in order. */
  readonly serverErrors: readonly ServerError[];
  /** Whether its status read Ready in time. */
  readonly ready: boolean;
}

/** What's wrong with a page: the first thing found. */
export type PageProblem =
  | { readonly kind: "unreachable"; readonly message: string }
  | { readonly kind: "http-status"; readonly status: number }
  | { readonly kind: "server-error"; readonly error: ServerError }
  | { readonly kind: "page-error"; readonly message: string }
  | { readonly kind: "never-ready"; readonly seconds: number };

export interface PageFailure {
  readonly path: string;
  readonly problem: PageProblem;
}

/** A browser that opens pages, one at a time, until it's closed. */
export interface SmokeBrowser {
  /** How long it waits for a page to read Ready. */
  readonly timeoutMs: number;
  readonly visit: (url: string) => Promise<PageVisit>;
  readonly close: () => Promise<void>;
}

/** What the smoke check reaches: the network, and a browser. */
export interface SmokePorts {
  readonly fetchPage: typeof fetch;
  readonly openBrowser: () => Promise<SmokeBrowser>;
}

/** The page's HTTP answer: its status, or why there was none. */
async function httpProblem(url: string, fetchPage: typeof fetch): Promise<PageProblem | undefined> {
  try {
    const response = await fetchPage(url, { signal: AbortSignal.timeout(SMOKE_TIMEOUT_MS) });
    return response.status === 200 ? undefined : { kind: "http-status", status: response.status };
  } catch (error) {
    return { kind: "unreachable", message: String(error) };
  }
}

/** The first thing wrong in a visit: a server error, then an uncaught error, then no Ready in `timeoutMs`. */
export function visitProblem(visit: PageVisit, timeoutMs: number): PageProblem | undefined {
  const [serverError] = visit.serverErrors;
  if (serverError !== undefined) {
    return { kind: "server-error", error: serverError };
  }
  const [pageError] = visit.pageErrors;
  if (pageError !== undefined) {
    return { kind: "page-error", message: pageError };
  }
  return visit.ready ? undefined : { kind: "never-ready", seconds: timeoutMs / 1000 };
}

/** Opens each of `paths` at `baseUrl`, one at a time: the pages that failed. */
export async function smokePages(
  baseUrl: string,
  paths: readonly string[],
  ports: SmokePorts,
): Promise<PageFailure[]> {
  const failures: PageFailure[] = [];
  const browser = await ports.openBrowser();
  try {
    for (const path of paths) {
      const url = new URL(path, baseUrl).href;
      const problem =
        (await httpProblem(url, ports.fetchPage)) ??
        visitProblem(await browser.visit(url), browser.timeoutMs);
      if (problem !== undefined) {
        failures.push({ path, problem });
      }
    }
  } finally {
    await browser.close();
  }
  return failures;
}

/** What a smoke check of a site came to. */
export type SmokeOutcome =
  | { readonly kind: "no-dev-server"; readonly baseUrl: string }
  | {
      readonly kind: "checked";
      readonly baseUrl: string;
      readonly paths: readonly string[];
      readonly failures: readonly PageFailure[];
      readonly unlisted: readonly string[];
    };

/** Smoke-checks the site at `root` on the dev server at `baseUrl`: its pages, as `config` says. */
export async function smokeSite(
  root: string,
  config: SmokeConfig,
  baseUrl: string,
  ports: SmokePorts,
): Promise<SmokeOutcome> {
  if ((await httpProblem(baseUrl, ports.fetchPage))?.kind === "unreachable") {
    return { kind: "no-dev-server", baseUrl };
  }
  const { paths, unlisted } = smokeTargetsOf(pageRoutesIn(join(root, "src", "pages")), config);
  return {
    kind: "checked",
    baseUrl,
    paths,
    failures: await smokePages(baseUrl, paths, ports),
    unlisted,
  };
}

/** Whether the site is healthy: a dev server, every page fine, no route left unchecked. */
export const smokePasses = (outcome: SmokeOutcome): boolean =>
  outcome.kind === "checked" && outcome.failures.length === 0 && outcome.unlisted.length === 0;

const problemWords: Cases<PageProblem, "kind", string> = {
  unreachable: ({ message }) => `no answer (${message})`,
  "http-status": ({ status }) => `HTTP ${String(status)}`,
  "server-error": ({ error }) => `HTTP ${String(error.status)} for ${error.url}`,
  "page-error": ({ message }) => `uncaught error: ${message}`,
  "never-ready": ({ seconds }) => `its status didn't read Ready within ${String(seconds)}s`,
};

/** A failed page's line: its path, and the first thing wrong. */
const failureLine = ({ path, problem }: PageFailure): string =>
  `  ✗ ${path}: ${onCase(problemWords, problem.kind, problem)}`;

/** What a smoke check says: a line per failed page or unchecked route, and a summary last. */
export function smokeLines(outcome: SmokeOutcome): string[] {
  if (outcome.kind === "no-dev-server") {
    return [
      `No dev server at ${outcome.baseUrl}. Start it with \`npm run dev\`, then run this again.`,
    ];
  }
  const { baseUrl, paths, failures, unlisted } = outcome;
  return [
    ...failures.map((failure) => failureLine(failure)),
    ...unlisted.map(
      (pattern) =>
        `  ✗ ${pattern}: has parameters; name a page for it in bfg-site.json's smokePages (or list it in smokeSkip)`,
    ),
    smokePasses(outcome)
      ? `Smoke: ${String(paths.length)} pages healthy at ${baseUrl}.`
      : `Smoke: red at ${baseUrl} (${String(failures.length)} of ${String(paths.length)} pages failed, ${String(unlisted.length)} routes unchecked). Restart the dev server if it's stale.`,
  ];
}
