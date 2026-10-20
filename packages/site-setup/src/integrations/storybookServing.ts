import { execFile } from "node:child_process";
import {
  createReadStream,
  existsSync,
  mkdirSync,
  mkdtempSync,
  renameSync,
  rmSync,
  statSync,
} from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import { join } from "node:path";
import { contentTypeFor, resolveStaticTarget } from "./staticDir.ts";
import { isBundledSource, snapshotIsStale } from "./storybookFreshness.ts";

/**
 * Storybook as "just another route" of a site (./integrations' `storybookRoute`): /storybook/
 * serves a static Storybook build, a snapshot the dev server rebuilds in the background when it's
 * missing or older than its sources, and again a little after a bundled source changes; the last
 * snapshot keeps being served while the next one builds. Live editing is `npm run storybook`.
 */

/** Where the route is. */
const STORYBOOK_MOUNT = "/storybook";

/** Set to "0" to only build the snapshot when it's missing, never to refresh it. */
const AUTO_REBUILD_ENV = "BFG_STORYBOOK_AUTOBUILD";

/** Wait this long after the last change before rebuilding, so a burst of saves builds once. */
const REBUILD_DELAY_MS = 3000;

/** Builds the site's Storybook into a folder: the Storybook CLI, or a stand-in in tests. */
export interface StorybookBuilder {
  readonly build: (outputDir: string) => Promise<void>;
}

/** The Storybook CLI at `bin`, building quietly. */
export const storybookCli = (bin: string): StorybookBuilder => ({
  build: (outputDir) =>
    new Promise((built, failed) => {
      execFile(bin, ["build", "--quiet", "--output-dir", outputDir], (error) => {
        if (error === null) {
          built();
        } else {
          failed(new Error(error.message, { cause: error }));
        }
      });
    }),
});

/** Where the route reads and builds: the snapshot, its sources, and the folder builds stage in. */
export interface StorybookFolders {
  /** The snapshot served (the site's storybook-static/). */
  readonly snapshot: string;
  /** What it's built from (the site's src/ and .storybook/). */
  readonly sources: readonly string[];
  /** Where each build stages, in a fresh folder of its own, before it's swapped in. */
  readonly builds: string;
}

/** The folders of the site at `root`. */
export const storybookFoldersOf = (root: string): StorybookFolders => ({
  snapshot: join(root, "storybook-static"),
  sources: [join(root, "src"), join(root, ".storybook")],
  builds: join(root, ".builds"),
});

/** What the route says as it builds. */
export interface StorybookLog {
  readonly info: (line: string) => void;
  readonly error: (line: string) => void;
}

/** The snapshot's builds: one at a time, a build asked for meanwhile running once after it. */
export interface Rebuilder {
  /** Builds now, or once more after the build that's running. */
  readonly build: () => void;
  /** Whether there's nothing to serve yet: the first build hasn't finished. */
  readonly isBuilding: () => boolean;
  /** Resolves once no build is running or queued. */
  readonly settled: () => Promise<void>;
}

export function createRebuilder(
  folders: StorybookFolders,
  builder: StorybookBuilder,
  log: StorybookLog,
): Rebuilder {
  let running: Promise<void> | undefined;
  let queued = false;
  const buildOnce = async (): Promise<void> => {
    log.info("Building Storybook for /storybook/ in the background…");
    mkdirSync(folders.builds, { recursive: true });
    const staging = mkdtempSync(join(folders.builds, "storybook-static-"));
    try {
      await builder.build(staging);
      rmSync(folders.snapshot, { recursive: true, force: true });
      renameSync(staging, folders.snapshot);
      log.info("Storybook is up to date at /storybook/");
    } catch (error) {
      rmSync(staging, { recursive: true, force: true });
      log.error(`Storybook build failed: ${String(error)}`);
    }
  };
  const build = (): void => {
    if (running !== undefined) {
      queued = true;
      return;
    }
    running = buildOnce().then(() => {
      running = undefined;
      if (queued) {
        queued = false;
        build();
      }
    });
  };
  const settled = async (): Promise<void> => {
    for (let current = running; current !== undefined; current = running) {
      await current;
    }
  };
  return {
    build,
    isBuilding: () => running !== undefined && !existsSync(join(folders.snapshot, "index.html")),
    settled,
  };
}

/** Connect-style middleware, as Vite's dev server takes it. */
export type Middleware = (req: IncomingMessage, res: ServerResponse, next: () => void) => void;

const BUILDING_PAGE = `<!doctype html><meta charset="utf-8"><title>Storybook is building…</title>
<meta http-equiv="refresh" content="3"><body style="font-family:system-ui;padding:2rem">
<p>Storybook is building for <code>/storybook/</code>. This page refreshes on its own.</p>
<p>For live editing, run <code>npm run storybook</code>.</p>`;

/** Serves the snapshot in `snapshot` under /storybook/; every other request goes on. */
export function serveStorybook(snapshot: string, isBuilding: () => boolean): Middleware {
  return (req, res, next) => {
    // A server's request always has its URL (only a client's has none).
    const url = String(req.url);
    if (url !== STORYBOOK_MOUNT && !url.startsWith(`${STORYBOOK_MOUNT}/`)) {
      next();
      return;
    }
    // Storybook writes index.html before its assets, so serve nothing until the build finishes.
    if (isBuilding()) {
      res.writeHead(503, { "Content-Type": "text/html; charset=utf-8" }).end(BUILDING_PAGE);
      return;
    }
    const target = resolveStaticTarget(snapshot, STORYBOOK_MOUNT, url);
    if (target.kind === "redirect") {
      res.writeHead(302, { Location: target.location }).end();
    } else if (target.kind === "outside") {
      res.writeHead(403).end("Forbidden");
    } else if (existsSync(target.path) && statSync(target.path).isFile()) {
      res.writeHead(200, { "Content-Type": contentTypeFor(target.path) });
      createReadStream(target.path).pipe(res);
    } else {
      res.writeHead(404).end("Not found in the Storybook build");
    }
  };
}

/** What the route needs of the dev server: to watch its files, and to serve. */
export interface StorybookDevServer {
  readonly onChange: (changed: (path: string) => void) => void;
  readonly use: (middleware: Middleware) => void;
}

/**
 * The route on a dev server: the snapshot built if it's stale (or, with auto-rebuild off, only if
 * it's missing), rebuilt a little after each bundled source changes, and served.
 */
export function serveStorybookOn(
  server: StorybookDevServer,
  folders: StorybookFolders,
  rebuilder: Rebuilder,
  autoRebuild: boolean,
  delayMs: number = REBUILD_DELAY_MS,
): void {
  const missing = !existsSync(join(folders.snapshot, "index.html"));
  if (autoRebuild ? snapshotIsStale(folders.snapshot, folders.sources) : missing) {
    rebuilder.build();
  }
  if (autoRebuild) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    server.onChange((path) => {
      if (folders.sources.some((dir) => path.startsWith(dir)) && isBundledSource(path)) {
        clearTimeout(timer);
        timer = setTimeout(rebuilder.build, delayMs);
      }
    });
  }
  server.use(serveStorybook(folders.snapshot, rebuilder.isBuilding));
}

/** Whether `env` leaves auto-rebuild on (anything but "0"). */
export const autoRebuildIn = (env: NodeJS.ProcessEnv): boolean => env[AUTO_REBUILD_ENV] !== "0";
