import { createServer, type Server } from "node:http";
import { join } from "node:path";
import { chromium, type Browser } from "@playwright/test";
import devServerUp from "../../src/devServerUp.ts";
import { portIn } from "../../src/bin/nodeProcesses.ts";
import { openSiteBrowser, smokeBrowserOver } from "../../src/smoke/siteBrowser.ts";
import { smokePages, type SmokeBrowser } from "../../src/smoke/smokeCheck.ts";
import { NOT_FOUND_PATH } from "../../src/smoke/smokeRoutes.ts";
import { pageAt } from "../fixtures/smokePages.ts";

/**
 * The smoke check in a real headless Chromium (src/smoke/siteBrowser.ts), against a tiny server of
 * the test's own, on a free port, stopped after: a healthy page, a 500, an uncaught error, a 504
 * while loading (Vite's answer for a stale dependency), a page that never reads Ready, and error
 * pages (a not-found page for any path it doesn't have, a 500 page at /500), healthy or broken.
 */

/** A page whose status reads "Loading…", then "Ready", and anything else in `body`. */
const statusPage = (body = ""): string =>
  `<p role="status" aria-label="Page status">Loading…</p>${body}<script>setTimeout(() => { document.querySelector("p").textContent = "Ready"; }, 100);</script>`;

/** Each path the server answers: its status, and what it sends. */
const ROUTES: Readonly<Record<string, { readonly status: number; readonly body: string }>> = {
  "/": { status: 200, body: statusPage() },
  "/about": { status: 200, body: statusPage() },
  "/broken": { status: 500, body: "Internal Server Error" },
  "/throws": {
    status: 200,
    body: statusPage('<script>throw new Error("_jsxDEV is not a function");</script>'),
  },
  "/stale": { status: 200, body: statusPage('<script type="module" src="/stale.js"></script>') },
  "/stale.js": { status: 504, body: "Outdated Optimize Dep" },
  "/stuck": { status: 200, body: '<p role="status" aria-label="Page status">Loading…</p>' },
  "/500": { status: 500, body: statusPage() },
  "/missing-throws": {
    status: 404,
    body: statusPage('<script>throw new Error("the not-found page broke");</script>'),
  },
};

/** What the server answers for a path it doesn't have: a healthy not-found page. */
const NOT_FOUND = { status: 404, body: statusPage() };

let server: Server;
let baseUrl: string;
let browser: Browser;
let smokeBrowser: SmokeBrowser;

beforeAll(async () => {
  server = createServer((request, response) => {
    const route = ROUTES[request.url ?? ""] ?? NOT_FOUND;
    const type = request.url?.endsWith(".js") === true ? "text/javascript" : "text/html";
    response.writeHead(route.status, { "content-type": type }).end(route.body);
  });
  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });
  baseUrl = `http://127.0.0.1:${String(portIn(server.address()))}`;
  browser = await chromium.launch();
  smokeBrowser = smokeBrowserOver(browser, 1500);
});

afterAll(async () => {
  await browser.close();
  server.closeAllConnections();
  await new Promise((resolve) => {
    server.close(resolve);
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("opening a page in the browser", () => {
  it("sees a healthy page read Ready, with nothing wrong", async () => {
    await expect(smokeBrowser.visit(`${baseUrl}/`)).resolves.toEqual({
      pageErrors: [],
      serverErrors: [],
      ready: true,
    });
  });

  it("sees a page's uncaught error", async () => {
    const visit = await smokeBrowser.visit(`${baseUrl}/throws`);
    expect(visit.pageErrors).toEqual(["_jsxDEV is not a function"]);
  });

  it("sees a 504 while the page loads", async () => {
    const visit = await smokeBrowser.visit(`${baseUrl}/stale`);
    expect(visit.serverErrors).toEqual([{ url: `${baseUrl}/stale.js`, status: 504 }]);
  });

  it("doesn't count an error page's own status as a server error", async () => {
    const visit = await smokeBrowser.visit(`${baseUrl}/500`);
    expect(visit).toEqual({ pageErrors: [], serverErrors: [], ready: true });
  });

  it("sees a page that never reads Ready", async () => {
    const visit = await smokeBrowser.visit(`${baseUrl}/stuck`);
    expect(visit.ready).toBe(false);
  });

  it("sees a page that never answers as never Ready", async () => {
    // Arrange: a port nothing listens on.
    const nowhere = "http://127.0.0.1:9/";
    // Act
    const visit = await smokeBrowser.visit(nowhere);
    // Assert
    expect(visit.ready).toBe(false);
  });
});

describe("smoke-checking pages against a server", () => {
  it("finds each sick page's first problem", async () => {
    // Arrange
    const ports = { fetchPage: fetch, openBrowser: () => openSiteBrowser(process.cwd(), 1500) };
    // Act
    const failures = await smokePages(
      baseUrl,
      ["/", "/broken", "/throws", "/stale", "/stuck"].map((path) => pageAt(path)),
      ports,
    );
    // Assert
    expect(failures).toEqual([
      { page: pageAt("/broken"), problem: { kind: "http-status", status: 500, expected: 200 } },
      {
        page: pageAt("/throws"),
        problem: { kind: "page-error", message: "_jsxDEV is not a function" },
      },
      {
        page: pageAt("/stale"),
        problem: { kind: "server-error", error: { url: `${baseUrl}/stale.js`, status: 504 } },
      },
      { page: pageAt("/stuck"), problem: { kind: "never-ready", seconds: 1.5 } },
    ]);
  });
});

describe("smoke-checking error pages against a server", () => {
  const ports = { fetchPage: fetch, openBrowser: () => openSiteBrowser(process.cwd(), 1500) };
  const notFound = { route: "/404", path: NOT_FOUND_PATH, status: 404 };

  it("passes a healthy not-found page and 500 page, each at its own status", async () => {
    // Arrange
    const serverError = { route: "/500", path: "/500", status: 500 };
    // Act
    const failures = await smokePages(baseUrl, [notFound, serverError], ports);
    // Assert
    expect(failures).toEqual([]);
  });

  it("catches a not-found page that throws", async () => {
    // Arrange
    const broken = { ...notFound, path: "/missing-throws" };
    // Act
    const failures = await smokePages(baseUrl, [broken], ports);
    // Assert
    expect(failures).toEqual([
      { page: broken, problem: { kind: "page-error", message: "the not-found page broke" } },
    ]);
  });

  it("catches a not-found page that answers 200", async () => {
    // Arrange: a site whose unknown paths render a page, but with 200.
    const lying = { ...notFound, path: "/" };
    // Act
    const failures = await smokePages(baseUrl, [lying], ports);
    // Assert
    expect(failures).toEqual([
      { page: lying, problem: { kind: "http-status", status: 200, expected: 404 } },
    ]);
  });
});

describe("the e2e gate", () => {
  it("lets a run go on against a healthy server, from the site's folder", async () => {
    // Arrange: the example site (its index and about pages), on the test's server.
    vi.spyOn(process, "cwd").mockReturnValue(join(process.cwd(), "example"));
    vi.stubEnv("E2E_BASE_URL", baseUrl);
    // Act, Assert
    await expect(devServerUp()).resolves.toBeUndefined();
  });
});
