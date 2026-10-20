import { readdirSync } from "node:fs";
import { join } from "node:path";
import { verifyCommand } from "../../src/bin/verifyCommand.ts";
import { configOf, fakeSite } from "./fixtures/fakeSite.ts";

/** `bfg-site verify` (src/bin/verifyCommand.ts): what's asked, and where its reports go. */

const CONFIG = configOf();

describe("bfg-site verify", () => {
  it("says what's wrong with what's asked", async () => {
    // Arrange
    const { site, seen } = fakeSite();
    // Act
    const code = await verifyCommand(["--stage", "lint"], site, CONFIG);
    // Assert
    expect(code).toBe(2);
    expect(seen.complained.join("\n")).toContain('No stage "lint".');
  });

  it("runs one stage with no reports folder", async () => {
    // Arrange
    const { site, seen } = fakeSite();
    // Act
    const code = await verifyCommand(["--stage", "property"], site, CONFIG);
    // Assert
    expect(code).toBe(0);
    expect(seen.ran.map((check) => Object.keys(check.env))).toEqual([["BFG_DEV_SERVER_CACHE"]]);
    expect(readdirSync(site.root)).toEqual([]);
  });

  it("keeps the build's reports in a run folder of their own, and tells its checks", async () => {
    // Arrange
    const { site, seen } = fakeSite();
    const dir = join(site.root, "reports", "2026-10-20T08-00-00-no-commit");
    // Act
    const code = await verifyCommand(["--build"], site, CONFIG);
    // Assert
    expect(code).toBe(0);
    expect(readdirSync(join(site.root, "reports"))).toEqual(["2026-10-20T08-00-00-no-commit"]);
    expect(seen.ran.every((check) => check.env["BFG_REPORT_DIR"] === dir)).toBe(true);
  });
});

describe("bfg-site verify, red or refused", () => {
  it("is red when a check fails", async () => {
    // Arrange
    const { site } = fakeSite({ statuses: { lint: 1 } });
    // Act
    const code = await verifyCommand(["--build"], site, CONFIG);
    // Assert
    expect(code).toBe(1);
  });

  it("won't run with REPORTS_KEEP unreadable", async () => {
    // Arrange
    const { site, seen } = fakeSite({}, { REPORTS_KEEP: "lots" });
    // Act
    const code = await verifyCommand([], site, CONFIG);
    // Assert
    expect(code).toBe(2);
    expect(seen.complained.join("\n")).toContain("REPORTS_KEEP");
  });

  it("is red for a single stage that fails", async () => {
    // Arrange
    const { site } = fakeSite({ statuses: { "property tests": 1 } });
    // Act
    const code = await verifyCommand(["--stage", "property"], site, CONFIG);
    // Assert
    expect(code).toBe(1);
  });
});
