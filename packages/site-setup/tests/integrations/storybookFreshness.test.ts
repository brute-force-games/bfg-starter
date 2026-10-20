import { mkdirSync, mkdtempSync, rmSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  isBundledSource,
  newestSourceTime,
  snapshotIsStale,
} from "../../src/integrations/storybookFreshness.ts";

/** Whether Storybook's snapshot is older than its sources (src/integrations/storybookFreshness.ts). */

let base: string;
const at = (seconds: number): Date => new Date(seconds * 1000);

/** Writes `path` under the test folder, last modified at `seconds`. */
function file(path: string, seconds: number): void {
  const full = join(base, path);
  mkdirSync(join(full, ".."), { recursive: true });
  writeFileSync(full, "");
  utimesSync(full, at(seconds), at(seconds));
}

beforeEach(() => {
  base = mkdtempSync(join(tmpdir(), "storybook-freshness-"));
});

afterEach(() => {
  rmSync(base, { recursive: true, force: true });
});

describe("Storybook snapshot freshness", () => {
  it("counts only files Storybook bundles", () => {
    expect(isBundledSource("src/components/Button.tsx")).toBe(true);
    expect(isBundledSource("src/components/Button.module.css")).toBe(true);
    expect(isBundledSource("src/pages/index.astro")).toBe(false);
    expect(isBundledSource("content/pages/about.md")).toBe(false);
  });

  it("finds the newest bundled source, skipping node_modules and other files", () => {
    file("src/a.ts", 100);
    file("src/deep/b.tsx", 200);
    file("src/page.astro", 900);
    file("src/node_modules/c.ts", 800);
    expect(newestSourceTime([join(base, "src"), join(base, "missing")])).toBe(200_000);
  });

  it("is stale when there's no snapshot, or a source is newer than it", () => {
    const src = join(base, "src");
    const snapshot = join(base, "storybook-static");
    file("src/a.ts", 100);
    expect(snapshotIsStale(snapshot, [src])).toBe(true);
    file("storybook-static/index.json", 150);
    expect(snapshotIsStale(snapshot, [src])).toBe(false);
    file("src/a.ts", 200);
    expect(snapshotIsStale(snapshot, [src])).toBe(true);
  });
});
