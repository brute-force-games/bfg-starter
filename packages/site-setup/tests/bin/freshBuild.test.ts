import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { freshBuild } from "../../src/bin/freshBuild.ts";
import type { Check } from "../../src/bin/ports.ts";
import { fakeSite } from "./fixtures/fakeSite.ts";

/** `bfg-site fresh-build` (src/bin/freshBuild.ts): built in a fresh folder, swapped in on success. */

const BUILD = ["dist", "--", "npx", "astro", "build", "--outDir", "{out}"];

/** A build that writes its page into the folder it's told to. */
const builds = (check: Check): void => {
  writeFileSync(join(check.args.slice(-1).join(""), "index.html"), "new");
};

/** The site's last good build. */
function lastBuild(root: string): void {
  mkdirSync(join(root, "dist"));
  writeFileSync(join(root, "dist", "index.html"), "old");
}

describe("a fresh build", () => {
  it("swaps the new build in for the last", () => {
    // Arrange
    const { site, seen } = fakeSite({ sideEffects: { build: builds } });
    lastBuild(site.root);
    // Act
    const code = freshBuild(site, BUILD);
    // Assert
    expect(code).toBe(0);
    expect(readFileSync(join(site.root, "dist", "index.html"), "utf8")).toBe("new");
    expect(readdirSync(join(site.root, ".builds"))).toEqual([]);
    expect(seen.said).toEqual(["Built into dist."]);
  });

  it("leaves the last good build in place when it fails", () => {
    // Arrange
    const { site, seen } = fakeSite({ statuses: { build: 4 } });
    lastBuild(site.root);
    // Act
    const code = freshBuild(site, BUILD);
    // Assert
    expect(code).toBe(4);
    expect(readFileSync(join(site.root, "dist", "index.html"), "utf8")).toBe("old");
    expect(readdirSync(join(site.root, ".builds"))).toEqual([]);
    expect(seen.complained).toEqual(["The build failed; dist is as it was."]);
  });

  it("says how it's run when asked wrongly", () => {
    // Arrange
    const { site, seen } = fakeSite();
    // Act
    const code = freshBuild(site, ["dist"]);
    // Assert
    expect(code).toBe(2);
    expect(seen.complained).toHaveLength(1);
    expect(existsSync(join(site.root, ".builds"))).toBe(false);
  });
});
