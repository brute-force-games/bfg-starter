import type { ReportTarget } from "../../src/reports/reportRuns.ts";
import type { VerifyRun } from "../../src/bin/verifyArgs.ts";
import { verify } from "../../src/bin/verifyRun.ts";
import { configOf, fakeSite } from "./fixtures/fakeSite.ts";

/** Running the stages (src/bin/verifyRun.ts), its processes stood in for. */

const VERIFY: VerifyRun = { kind: "verify", devServer: { kind: "yours" } };
const VERIFY_OWN: VerifyRun = { kind: "verify", devServer: { kind: "own" } };
const BUILD: VerifyRun = { kind: "build" };
const NO_REPORTS: ReportTarget = { kind: "none" };
const CONFIG = configOf();
const YOURS = "http://localhost:4330";
const OWN = "http://localhost:4999";

const plan = (run: VerifyRun) => ({
  run,
  config: CONFIG,
  reports: NO_REPORTS,
  env: { BFG_REPORT_DIR: "/r" },
});

describe("a verify run", () => {
  it("runs every stage, e2e on your dev server, and is verified when all are green", async () => {
    // Arrange
    const { site, seen } = fakeSite({ answers: { [YOURS]: "up" } });
    // Act
    const passed = await verify(site, plan(VERIFY));
    // Assert
    expect(passed).toBe(true);
    expect(seen.ran.map((check) => check.name)).toEqual([
      "astro sync",
      "node version",
      "format",
      "lint",
      "dead code",
      "astro check",
      "types",
      "unit tests, with coverage",
      "integration tests",
      "property tests",
      "e2e",
    ]);
    expect(seen.ran.every((check) => check.env["BFG_REPORT_DIR"] === "/r")).toBe(true);
    expect(seen.said.at(-1)).toBe("\nVerified: every stage green, e2e included.");
  });

  it("says each red check's whole output, goes on, and skips e2e", async () => {
    // Arrange
    const { site, seen } = fakeSite({ statuses: { lint: 1 }, answers: { [YOURS]: "up" } });
    // Act
    const passed = await verify(site, plan(VERIFY));
    // Assert
    expect(passed).toBe(false);
    expect(seen.said).toContain("output of lint\n");
    expect(seen.said).toContain("\ne2e: skipped, a stage below it is red");
    expect(seen.ran.map((check) => check.name)).not.toContain("e2e");
    expect(seen.said.at(-1)).toBe("\nRed: static.");
  });
});

describe("a verify run without your dev server", () => {
  it("isn't verified without your dev server", async () => {
    // Arrange
    const { site, seen } = fakeSite();
    // Act
    const passed = await verify(site, plan(VERIFY));
    // Assert
    expect(passed).toBe(false);
    expect(seen.asked).toEqual([YOURS]);
    expect(seen.said.at(-1)).toBe(
      "\nNot verified: every stage below e2e is green, but e2e didn't run (no dev server).",
    );
  });
});

describe("a verify run that stops early", () => {
  it("runs no check of a stage whose preparation failed", async () => {
    // Arrange
    const { site, seen } = fakeSite({ statuses: { "astro sync": 1 } });
    // Act
    await verify(site, plan(BUILD));
    // Assert
    expect(seen.ran.map((check) => check.name)).toEqual(["astro sync"]);
  });

  it("stops the build at its first red stage", async () => {
    // Arrange
    const { site, seen } = fakeSite({ statuses: { "unit tests, with coverage": 1 } });
    // Act
    const passed = await verify(site, plan(BUILD));
    // Assert
    expect(passed).toBe(false);
    expect(seen.ran.map((check) => check.name).at(-1)).toBe("unit tests, with coverage");
  });

  it("says where its reports are", async () => {
    // Arrange
    const { site, seen } = fakeSite();
    // Act
    await verify(site, { ...plan(BUILD), reports: { kind: "folder", dir: "/r/run" } });
    // Assert
    expect(seen.said).toContain("Reports: /r/run");
  });
});

describe("a verify run on a dev server of its own", () => {
  it("starts it, runs e2e against it once it answers, and stops it", async () => {
    // Arrange
    const { site, seen } = fakeSite({ answers: { [OWN]: "up" } });
    // Act
    const passed = await verify(site, plan(VERIFY_OWN));
    // Assert
    expect(passed).toBe(true);
    expect(seen.started.map((check) => check.args)).toEqual([
      ["astro", "dev", "--ignore-lock", "--port", "4999"],
    ]);
    expect(seen.ran.at(-1)).toEqual(
      expect.objectContaining({ name: "e2e", env: { BFG_REPORT_DIR: "/r", E2E_BASE_URL: OWN } }),
    );
    expect(seen.stopped).toEqual(["own dev server"]);
  });

  it("calls e2e red when its server ends without answering", async () => {
    // Arrange
    const { site, seen } = fakeSite({ startedState: { kind: "ended", status: 1 } });
    // Act
    const passed = await verify(site, plan(VERIFY_OWN));
    // Assert
    expect(passed).toBe(false);
    expect(seen.said).toContain("output of own dev server\n");
    expect(seen.said.at(-1)).toBe("\nRed: e2e.");
    expect(seen.stopped).toEqual(["own dev server"]);
  });

  it("gives up on a server still starting after its wait", async () => {
    // Arrange
    const { site, seen } = fakeSite();
    // Act
    const passed = await verify(site, plan(VERIFY_OWN));
    // Assert
    expect(passed).toBe(false);
    expect(seen.asked).toHaveLength(180);
    expect(seen.said).toContain("  ✗ own dev server (didn't answer within 180s, 0.0s)");
  });
});
