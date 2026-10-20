import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, utimesSync, writeFileSync } from "node:fs";
import { createServer, get as httpGet, type Server } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  autoRebuildIn,
  createRebuilder,
  type Middleware,
  type StorybookBuilder,
  type StorybookFolders,
  type StorybookLog,
  serveStorybook,
  serveStorybookOn,
  storybookCli,
  storybookFoldersOf,
} from "../../src/integrations/storybookServing.ts";

/**
 * Storybook as a route of the site (src/integrations/storybookServing.ts): its snapshot's builds,
 * one at a time, swapped in whole; served under /storybook/; rebuilt when its sources change.
 */

let site: string;
let folders: StorybookFolders;

beforeEach(() => {
  site = mkdtempSync(join(tmpdir(), "bfg-storybook-route-"));
  folders = storybookFoldersOf(site);
});

afterEach(() => {
  rmSync(site, { recursive: true, force: true });
});

/** A builder that writes a Storybook build's index, saying `which`, and counts its builds. */
function writingBuilder(which: string): StorybookBuilder & { readonly builds: () => number } {
  let builds = 0;
  return {
    build: (outputDir) => {
      builds += 1;
      writeFileSync(join(outputDir, "index.html"), which);
      return Promise.resolve();
    },
    builds: () => builds,
  };
}

const failingBuilder: StorybookBuilder = { build: () => Promise.reject(new Error("no stories")) };

/** A log that keeps what it's told. */
function keptLog(): StorybookLog & { readonly lines: string[] } {
  const lines: string[] = [];
  return { info: (line) => lines.push(line), error: (line) => lines.push(`error: ${line}`), lines };
}

/** Writes `path` under the site, last modified at `seconds`. */
function siteFile(path: string, seconds: number, text = ""): void {
  const full = join(site, path);
  mkdirSync(join(full, ".."), { recursive: true });
  writeFileSync(full, text);
  utimesSync(full, new Date(seconds * 1000), new Date(seconds * 1000));
}

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
    const rebuilder = createRebuilder(folders, writingBuilder("built"), log);
    // Act
    rebuilder.build();
    const building = rebuilder.isBuilding();
    await rebuilder.settled();
    // Assert
    expect(building).toBe(true);
    expect(rebuilder.isBuilding()).toBe(false);
    expect(readFileSync(join(folders.snapshot, "index.html"), "utf8")).toBe("built");
    expect(readdirSync(folders.builds)).toEqual([]);
    expect(log.lines).toEqual([
      "Building Storybook for /storybook/ in the background…",
      "Storybook is up to date at /storybook/",
    ]);
  });

  it("run one at a time: one asked for meanwhile runs once after it", async () => {
    // Arrange
    const builder = writingBuilder("built");
    const rebuilder = createRebuilder(folders, builder, keptLog());
    // Act
    rebuilder.build();
    rebuilder.build();
    rebuilder.build();
    await rebuilder.settled();
    // Assert
    expect(builder.builds()).toBe(2);
  });

  it("keep serving the last snapshot while the next builds", async () => {
    // Arrange
    siteFile("storybook-static/index.html", 100, "last");
    const rebuilder = createRebuilder(folders, writingBuilder("next"), keptLog());
    // Act
    rebuilder.build();
    // Assert
    expect(rebuilder.isBuilding()).toBe(false);
    await rebuilder.settled();
  });

  it("leave the last snapshot in place when a build fails, saying why", async () => {
    // Arrange
    siteFile("storybook-static/index.html", 100, "last");
    const log = keptLog();
    const rebuilder = createRebuilder(folders, failingBuilder, log);
    // Act
    rebuilder.build();
    await rebuilder.settled();
    // Assert
    expect(readFileSync(join(folders.snapshot, "index.html"), "utf8")).toBe("last");
    expect(readdirSync(folders.builds)).toEqual([]);
    expect(log.lines).toContain("error: Storybook build failed: Error: no stories");
  });
});

describe("the Storybook CLI", () => {
  it("resolves when the build succeeds", async () => {
    await expect(storybookCli("/usr/bin/true").build(site)).resolves.toBeUndefined();
  });

  it("fails when the build does", async () => {
    await expect(storybookCli("/usr/bin/false").build(site)).rejects.toThrow("Command failed");
  });
});

/** `middleware` behind a real HTTP server on a free port; every request it passes on is a 418. */
async function serving(middleware: Middleware): Promise<{ readonly url: string; readonly server: Server }> {
  const server = createServer((req, res) => {
    middleware(req, res, () => res.writeHead(418).end("passed on"));
  });
  await new Promise<void>((listening) => server.listen(0, "127.0.0.1", listening));
  const address = server.address();
  if (address === null || typeof address === "string") {
    throw new Error(`the test server isn't on a port: ${String(address)}`);
  }
  return { url: `http://127.0.0.1:${String(address.port)}`, server };
}

describe("the route", () => {
  let server: Server | undefined;

  afterEach(() => {
    server?.close();
    server = undefined;
  });

  /** What the route answered: its status, Content-Type and body. */
  interface Answer {
    readonly status: number | undefined;
    readonly contentType: string | undefined;
    readonly body: string;
  }

  /** Asks the route for `path` as sent (Node's client, unlike fetch, never normalizes it). */
  async function get(middleware: Middleware, path: string): Promise<Answer> {
    const served = await serving(middleware);
    server = served.server;
    return new Promise((answered, failed) => {
      const { hostname, port } = new URL(served.url);
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

  it("serves the snapshot's files under /storybook/, typed", async () => {
    // Arrange
    siteFile("storybook-static/index.html", 100, "<p>stories</p>");
    // Act
    const response = await get(serveStorybook(folders.snapshot, () => false), "/storybook/");
    // Assert
    expect(response).toEqual({ status: 200, contentType: "text/html; charset=utf-8", body: "<p>stories</p>" });
  });

  it.each([
    { what: "the bare mount, to its trailing slash", path: "/storybook", status: 302 },
    { what: "a file the build doesn't have", path: "/storybook/missing.js", status: 404 },
    { what: "a folder, not a file", path: "/storybook/assets", status: 404 },
    { what: "a path out of the build", path: "/storybook/%2e%2e/secrets.txt", status: 403 },
    { what: "any other page, passed on", path: "/about/", status: 418 },
  ])("answers $what", async ({ path, status }) => {
    // Arrange
    siteFile("storybook-static/assets/index.html", 100);
    // Act
    const response = await get(serveStorybook(folders.snapshot, () => false), path);
    // Assert
    expect(response.status).toBe(status);
  });

  it("says it's building, and refreshes, until the first build is done", async () => {
    // Act
    const response = await get(serveStorybook(folders.snapshot, () => true), "/storybook/");
    // Assert
    expect(response.status).toBe(503);
    expect(response.body).toContain("Storybook is building");
  });
});

/** A dev server stand-in: the change listener it was given, and the middleware it serves. */
function devServer(): {
  readonly onChange: (changed: (path: string) => void) => void;
  readonly use: (middleware: Middleware) => void;
  readonly change: (path: string) => void;
  readonly served: () => number;
} {
  const listeners: ((path: string) => void)[] = [];
  let served = 0;
  return {
    onChange: (changed) => listeners.push(changed),
    use: () => {
      served += 1;
    },
    change: (path) => {
      for (const listener of listeners) {
        listener(path);
      }
    },
    served: () => served,
  };
}

describe("the route on a dev server", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("builds a stale snapshot at once, and serves it", async () => {
    // Arrange
    siteFile("src/Button.tsx", 200);
    siteFile("storybook-static/index.json", 100);
    const server = devServer();
    const builder = writingBuilder("built");
    const rebuilder = createRebuilder(folders, builder, keptLog());
    // Act
    serveStorybookOn(server, folders, rebuilder, true);
    await rebuilder.settled();
    // Assert
    expect(builder.builds()).toBe(1);
    expect(server.served()).toBe(1);
  });

  it("rebuilds once, a little after a burst of changes to what Storybook bundles", async () => {
    // Arrange
    siteFile("src/Button.tsx", 100);
    siteFile("storybook-static/index.json", 200);
    const server = devServer();
    const builder = writingBuilder("built");
    const rebuilder = createRebuilder(folders, builder, keptLog());
    serveStorybookOn(server, folders, rebuilder, true, 50);
    // Act
    server.change(join(site, "src", "Button.tsx"));
    server.change(join(site, ".storybook", "preview.ts"));
    server.change(join(site, "src", "pages", "index.astro"));
    server.change(join(site, "content", "about.ts"));
    vi.advanceTimersByTime(50);
    await rebuilder.settled();
    // Assert
    expect(builder.builds()).toBe(1);
  });

  it("with auto-rebuild off, builds only a missing snapshot, and never on a change", async () => {
    // Arrange
    siteFile("src/Button.tsx", 200);
    siteFile("storybook-static/index.html", 100);
    const server = devServer();
    const builder = writingBuilder("built");
    const rebuilder = createRebuilder(folders, builder, keptLog());
    // Act
    serveStorybookOn(server, folders, rebuilder, false);
    server.change(join(site, "src", "Button.tsx"));
    vi.runAllTimers();
    await rebuilder.settled();
    // Assert
    expect(builder.builds()).toBe(0);
    expect(server.served()).toBe(1);
  });

  it("with auto-rebuild off, still builds a snapshot that's missing", async () => {
    // Arrange
    const builder = writingBuilder("built");
    const rebuilder = createRebuilder(folders, builder, keptLog());
    // Act
    serveStorybookOn(devServer(), folders, rebuilder, false);
    await rebuilder.settled();
    // Assert
    expect(builder.builds()).toBe(1);
    expect(existsSync(join(folders.snapshot, "index.html"))).toBe(true);
  });
});

describe("auto-rebuild", () => {
  it.each([
    { given: undefined, on: true },
    { given: "1", on: true },
    { given: "0", on: false },
  ])("is on: $on, when BFG_STORYBOOK_AUTOBUILD is $given", ({ given, on }) => {
    expect(autoRebuildIn(given === undefined ? {} : { BFG_STORYBOOK_AUTOBUILD: given })).toBe(on);
  });
});
