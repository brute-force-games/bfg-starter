import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { runBfgSite } from "../../src/bin/commands.ts";
import { fakeSite, type FakeSite, type Script } from "./fixtures/fakeSite.ts";

/** `bfg-site <command>` (src/bin/commands.ts): each command by name, and why one can't run. */

const KNIP = "knip --reporter json --no-progress";
const NO_DEAD_CODE = JSON.stringify({ issues: [] });

/** A site with its bfg-site.json. */
function configured(script: Partial<Script> = {}, env: Record<string, string> = {}): FakeSite {
  const made = fakeSite(script, env);
  writeFileSync(join(made.site.root, "bfg-site.json"), JSON.stringify({ devServerPort: 4330 }));
  return made;
}

describe("bfg-site's command line", () => {
  it.each([{ argv: [] }, { argv: ["deploy"] }])(
    "says how it's used for $argv",
    async ({ argv }) => {
      // Arrange
      const { site, seen } = fakeSite();
      // Act
      const code = await runBfgSite(argv, site);
      // Assert
      expect(code).toBe(2);
      expect(seen.complained).toEqual([
        "Usage: bfg-site <smoke | verify | coverage | quality | dead-code | complexity | fresh-build | check-node> [arguments]",
      ]);
    },
  );

  it("won't run a command that needs the site's config without it", async () => {
    // Arrange
    const { site, seen } = fakeSite();
    // Act
    const code = await runBfgSite(["dead-code"], site);
    // Assert
    expect(code).toBe(2);
    expect(seen.complained.join("\n")).toContain("No bfg-site.json at");
  });
});

describe("bfg-site's quality commands", () => {
  it("runs the dead-code gate", async () => {
    // Arrange
    const { site } = configured({ outputs: { [KNIP]: NO_DEAD_CODE } });
    // Act
    const code = await runBfgSite(["dead-code"], site);
    // Assert
    expect(code).toBe(0);
  });

  it.each([
    { command: "coverage", ran: "vitest run --coverage" },
    { command: "quality", ran: "vitest run --coverage" },
  ])("runs $command: the unit tests with coverage", async ({ command, ran }) => {
    // Arrange
    const { site, seen } = configured();
    // Act
    const code = await runBfgSite([command], site);
    // Assert
    expect(code).toBe(0);
    expect(seen.ran.map((check) => check.args.join(" ")).join()).toContain(ran);
  });

  it("records the run for quality, and not for coverage", async () => {
    // Arrange
    const quality = configured();
    const coverage = configured();
    // Act
    await runBfgSite(["quality"], quality.site);
    await runBfgSite(["coverage"], coverage.site);
    // Assert
    expect(quality.seen.said.at(-1)).toBe(
      "No coverage summary (did the tests fail?): nothing recorded.",
    );
    expect(coverage.seen.said.at(-1)).not.toBe(
      "No coverage summary (did the tests fail?): nothing recorded.",
    );
  });
});

describe("bfg-site's report and build commands", () => {
  it.each([{ argv: ["complexity"] }, { argv: ["complexity", "/r/a", "/r/b"] }])(
    "says how complexity is run for $argv",
    async ({ argv }) => {
      // Arrange
      const { site, seen } = configured();
      // Act
      const code = await runBfgSite(argv, site);
      // Assert
      expect(code).toBe(2);
      expect(seen.complained).toEqual(["Usage: bfg-site complexity <run folder>"]);
    },
  );

  it("writes the complexity report into a run's folder", async () => {
    // Arrange
    const { site } = configured();
    const run = join(site.root, "reports", "run");
    // Act
    const code = await runBfgSite(["complexity", run], site);
    // Assert
    expect(code).toBe(0);
    expect(existsSync(join(run, "complexity", "complexity.sarif"))).toBe(true);
  });

  it("runs a fresh build", async () => {
    // Arrange
    const { site } = fakeSite();
    // Act
    const code = await runBfgSite(
      ["fresh-build", "dist", "--", "npx", "astro", "build", "--outDir", "{out}"],
      site,
    );
    // Assert
    expect(code).toBe(0);
    expect(readdirSync(site.root)).toContain("dist");
  });

  it("checks the site's Node pins against the running Node", async () => {
    // Arrange
    const { site, seen } = fakeSite();
    writeFileSync(join(site.root, ".nvmrc"), process.version);
    // Act
    const code = await runBfgSite(["check-node"], site);
    // Assert
    expect(code).toBe(0);
    expect(seen.said).toHaveLength(1);
  });
});
