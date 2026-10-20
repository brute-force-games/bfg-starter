import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import {
  autoRebuildIn,
  createRebuilder,
  type Middleware,
  serveStorybookOn,
} from "../../src/integrations/storybookServing.ts";
import {
  keptLog,
  storybookSite,
  writingBuilder,
  type StorybookSite,
} from "./fixtures/storybookSite.ts";

/**
 * Storybook's route on a dev server (src/integrations/storybookServing.ts): a stale or missing
 * snapshot built at once, and rebuilt a little after its sources change, unless auto-rebuild is off.
 */

let site: StorybookSite;

beforeEach(() => {
  site = storybookSite();
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
});

afterEach(() => {
  vi.useRealTimers();
  rmSync(site.root, { recursive: true, force: true });
});

/** A dev server stand-in: the change listener it was given, and the middleware it serves. */
interface DevServer {
  readonly onChange: (changed: (path: string) => void) => void;
  readonly use: (middleware: Middleware) => void;
  readonly change: (path: string) => void;
  readonly served: () => number;
}

function devServer(): DevServer {
  const listeners: ((path: string) => void)[] = [];
  let served = 0;
  return {
    onChange: (changed) => {
      listeners.push(changed);
    },
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
  it("builds a stale snapshot at once, and serves it", async () => {
    // Arrange
    site.file("src/Button.tsx", 200);
    site.file("storybook-static/index.json", 100);
    const server = devServer();
    const builder = writingBuilder("built");
    const rebuilder = createRebuilder(site.folders, builder, keptLog());
    // Act
    serveStorybookOn(server, site.folders, rebuilder, true);
    await rebuilder.settled();
    // Assert
    expect(builder.builds()).toBe(1);
    expect(server.served()).toBe(1);
  });

  it("rebuilds once, a little after a burst of changes to what Storybook bundles", async () => {
    // Arrange
    site.file("src/Button.tsx", 100);
    site.file("storybook-static/index.json", 200);
    const server = devServer();
    const builder = writingBuilder("built");
    const rebuilder = createRebuilder(site.folders, builder, keptLog());
    serveStorybookOn(server, site.folders, rebuilder, true, 50);
    // Act
    server.change(join(site.root, "src", "Button.tsx"));
    server.change(join(site.root, ".storybook", "preview.ts"));
    server.change(join(site.root, "src", "pages", "index.astro"));
    server.change(join(site.root, "content", "about.ts"));
    vi.advanceTimersByTime(50);
    await rebuilder.settled();
    // Assert
    expect(builder.builds()).toBe(1);
  });
});

describe("the route on a dev server, auto-rebuild off", () => {
  it("builds only a missing snapshot, and never on a change", async () => {
    // Arrange
    site.file("src/Button.tsx", 200);
    site.file("storybook-static/index.html", 100);
    const server = devServer();
    const builder = writingBuilder("built");
    const rebuilder = createRebuilder(site.folders, builder, keptLog());
    // Act
    serveStorybookOn(server, site.folders, rebuilder, false);
    server.change(join(site.root, "src", "Button.tsx"));
    vi.runAllTimers();
    await rebuilder.settled();
    // Assert
    expect(builder.builds()).toBe(0);
    expect(server.served()).toBe(1);
  });

  it("still builds a snapshot that's missing", async () => {
    // Arrange
    const builder = writingBuilder("built");
    const rebuilder = createRebuilder(site.folders, builder, keptLog());
    // Act
    serveStorybookOn(devServer(), site.folders, rebuilder, false);
    await rebuilder.settled();
    // Assert
    expect(builder.builds()).toBe(1);
    expect(existsSync(join(site.folders.snapshot, "index.html"))).toBe(true);
  });
});

describe("auto-rebuild", () => {
  it.each([
    { given: "unset", env: {}, on: true },
    { given: "1", env: { BFG_STORYBOOK_AUTOBUILD: "1" }, on: true },
    { given: "0", env: { BFG_STORYBOOK_AUTOBUILD: "0" }, on: false },
  ])("is on: $on, when BFG_STORYBOOK_AUTOBUILD is $given", ({ env, on }) => {
    expect(autoRebuildIn(env)).toBe(on);
  });
});
