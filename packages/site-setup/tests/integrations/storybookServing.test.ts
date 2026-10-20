import { readdirSync, readFileSync, rmSync } from "node:fs";
import { createServer, get as httpGet, type Server } from "node:http";
import { join } from "node:path";
import { portIn } from "../../src/bin/nodeProcesses.ts";
import {
  createRebuilder,
  type Middleware,
  serveStorybook,
  storybookCli,
  storybookFoldersOf,
} from "../../src/integrations/storybookServing.ts";
import {
  failingBuilder,
  keptLog,
  storybookSite,
  writingBuilder,
  type StorybookSite,
} from "./fixtures/storybookSite.ts";

/**
 * Storybook as a route of the site (src/integrations/storybookServing.ts): its snapshot's builds,
 * one at a time, swapped in whole, and served under /storybook/. Rebuilding on a dev server is
 * storybookServingDev.test.ts.
 */

let site: StorybookSite;
let server: Server | undefined;

beforeEach(() => {
  site = storybookSite();
});

afterEach(() => {
  server?.close();
  server = undefined;
  rmSync(site.root, { recursive: true, force: true });
});

describe("the site's Storybook folders", () => {
  it("are its storybook-static/, built from src/ and .storybook/, staged in .builds/", () => {
    expect(storybookFoldersOf("/sites/one")).toEqual({
      snapshot: "/sites/one/storybook-static",
      sources: ["/sites/one/src", "/sites/one/.storybook"],
      builds: "/sites/one/.builds",
    });
  });
});

describe("the snapshot's builds", () => {
  it("swap a finished build in whole, leaving nothing staged", async () => {
    // Arrange
    const log = keptLog();
    const rebuilder = createRebuilder(site.folders, writingBuilder("built"), log);
    // Act
    rebuilder.build();
    const building = rebuilder.isBuilding();
    await rebuilder.settled();
    // Assert
    expect(building).toBe(true);
    expect(rebuilder.isBuilding()).toBe(false);
    expect(readFileSync(join(site.folders.snapshot, "index.html"), "utf8")).toBe("built");
    expect(readdirSync(site.folders.builds)).toEqual([]);
    expect(log.lines).toEqual([
      "Building Storybook for /storybook/ in the background…",
      "Storybook is up to date at /storybook/",
    ]);
  });

  it("run one at a time: one asked for meanwhile runs once after it", async () => {
    // Arrange
    const builder = writingBuilder("built");
    const rebuilder = createRebuilder(site.folders, builder, keptLog());
    // Act
    rebuilder.build();
    rebuilder.build();
    rebuilder.build();
    await rebuilder.settled();
    // Assert
    expect(builder.builds()).toBe(2);
  });
});

describe("the snapshot while the next builds, or fails to", () => {
  it("keeps serving the last snapshot while the next builds", async () => {
    // Arrange
    site.file("storybook-static/index.html", 100, "last");
    const rebuilder = createRebuilder(site.folders, writingBuilder("next"), keptLog());
    // Act
    rebuilder.build();
    // Assert
    expect(rebuilder.isBuilding()).toBe(false);
    await rebuilder.settled();
  });

  it("stays in place when a build fails, saying why", async () => {
    // Arrange
    site.file("storybook-static/index.html", 100, "last");
    const log = keptLog();
    const rebuilder = createRebuilder(site.folders, failingBuilder, log);
    // Act
    rebuilder.build();
    await rebuilder.settled();
    // Assert
    expect(readFileSync(join(site.folders.snapshot, "index.html"), "utf8")).toBe("last");
    expect(readdirSync(site.folders.builds)).toEqual([]);
    expect(log.lines).toContain("error: Storybook build failed: Error: no stories");
  });
});

describe("the Storybook CLI", () => {
  it("resolves when the build succeeds", async () => {
    await expect(storybookCli("/usr/bin/true").build(site.root)).resolves.toBeUndefined();
  });

  it("fails when the build does", async () => {
    await expect(storybookCli("/usr/bin/false").build(site.root)).rejects.toThrow("Command failed");
  });
});

/** `middleware` behind a real HTTP server on a free port; every request it passes on is a 418. */
async function serving(middleware: Middleware): Promise<string> {
  const started = createServer((req, res) => {
    middleware(req, res, () => {
      res.writeHead(418).end("passed on");
    });
  });
  server = started;
  await new Promise<void>((listening) => {
    started.listen(0, "127.0.0.1", listening);
  });
  return `http://127.0.0.1:${String(portIn(started.address()))}`;
}

/** What the route answered: its status, Content-Type and body. */
interface Answer {
  readonly status: number | undefined;
  readonly contentType: string | undefined;
  readonly body: string;
}

/** Asks the route for `path` as sent (Node's client, unlike fetch, never normalizes it). */
async function get(middleware: Middleware, path: string): Promise<Answer> {
  const { hostname, port } = new URL(await serving(middleware));
  return new Promise((answered, failed) => {
    httpGet({ hostname, port, path }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk: string) => {
        body += chunk;
      });
      res.on("end", () => {
        answered({ status: res.statusCode, contentType: res.headers["content-type"], body });
      });
    }).on("error", failed);
  });
}

describe("the route", () => {
  it("serves the snapshot's files under /storybook/, typed", async () => {
    // Arrange
    site.file("storybook-static/index.html", 100, "<p>stories</p>");
    // Act
    const response = await get(serveStorybook(site.folders.snapshot, () => false), "/storybook/");
    // Assert
    expect(response).toEqual({
      status: 200,
      contentType: "text/html; charset=utf-8",
      body: "<p>stories</p>",
    });
  });

  it.each([
    { what: "the bare mount, to its trailing slash", path: "/storybook", status: 302 },
    { what: "a file the build doesn't have", path: "/storybook/missing.js", status: 404 },
    { what: "a folder, not a file", path: "/storybook/assets", status: 404 },
    { what: "a path out of the build", path: "/storybook/%2e%2e/secrets.txt", status: 403 },
    { what: "any other page, passed on", path: "/about/", status: 418 },
  ])("answers $what", async ({ path, status }) => {
    // Arrange
    site.file("storybook-static/assets/index.html", 100);
    // Act
    const response = await get(serveStorybook(site.folders.snapshot, () => false), path);
    // Assert
    expect(response.status).toBe(status);
  });

  it("says it's building, and refreshes, until the first build is done", async () => {
    // Act
    const response = await get(serveStorybook(site.folders.snapshot, () => true), "/storybook/");
    // Assert
    expect(response.status).toBe(503);
    expect(response.body).toContain("Storybook is building");
  });
});
