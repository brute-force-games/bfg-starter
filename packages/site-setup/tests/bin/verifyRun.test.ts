import { join } from "node:path";
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
      "smoke",
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

describe("a verify run with a sick dev server", () => {
  it("stops at a red smoke check, running nothing else", async () => {
    // Arrange
    const { site, seen } = fakeSite({ statuses: { smoke: 1 }, answers: { [YOURS]: "up" } });
    // Act
    const passed = await verify(site, plan(VERIFY));
    // Assert
    expect(passed).toBe(false);
    expect(seen.ran.map((check) => check.name)).toEqual(["smoke"]);
    expect(seen.said).toContain("output of smoke\n");
    expect(seen.said.at(-1)).toBe("\nRed: smoke.");
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
    expect(seen.asked).toEqual([YOURS, YOURS]);
    expect(seen.said).toContain(
      "\nsmoke: skipped, no dev server at http://localhost:4330 (start yours with `npm run dev`, or run with --own-dev-server)",
    );
    expect(seen.ran.map((check) => check.name)).not.toContain("smoke");
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

describe("a verify run's caches", () => {
  it("are its own for every check, never the site's, so your dev server's stay as they are", async () => {
    // Arrange
    const { site, seen } = fakeSite({ answers: { [YOURS]: "up" } });
    // Act
    await verify(site, plan(VERIFY));
    // Assert
    const folder = seen.said.slice(0, 1).join("").replace("Each check's output: ", "");
    expect(folder.startsWith(join(site.scratch, "bfg-site-verify-"))).toBe(true);
    expect(seen.ran.map((check) => check.env["BFG_DEV_SERVER_CACHE"])).toEqual(
      seen.ran.map(() => join(folder, "checks-cache")),
    );
    expect(seen.ran).toHaveLength(12);
  });

  it("keep an own dev server's apart from the checks'", async () => {
    // Arrange
    const { site, seen } = fakeSite({ answers: { [OWN]: "up" } });
    // Act
    await verify(site, plan(VERIFY_OWN));
    // Assert
    const server = seen.started.map((check) => check.env["BFG_DEV_SERVER_CACHE"]);
    const e2e = seen.ran
      .filter((check) => check.name === "e2e")
      .map((check) => check.env["BFG_DEV_SERVER_CACHE"]);
    expect(server).toHaveLength(2);
    expect(e2e).toHaveLength(1);
    expect(server).not.toEqual(e2e);
  });
});

describe("a verify run on a dev server of its own", () => {
  it("starts one for smoke and one for e2e, runs each against its own once it answers, and stops it", async () => {
    // Arrange
    const { site, seen } = fakeSite({ answers: { [OWN]: "up" } });
    // Act
    const passed = await verify(site, plan(VERIFY_OWN));
    // Assert
    expect(passed).toBe(true);
    expect(seen.started.map((check) => check.args)).toEqual([
      ["astro", "dev", "--ignore-lock", "--port", "4999"],
      ["astro", "dev", "--ignore-lock", "--port", "4999"],
    ]);
    const onServer = seen.ran.filter((check) => ["smoke", "e2e"].includes(check.name));
    expect(onServer.map((check) => check.env["E2E_BASE_URL"])).toEqual([OWN, OWN]);
    expect(onServer.map((check) => check.env["BFG_REPORT_DIR"])).toEqual(["/r", "/r"]);
    expect(seen.stopped).toEqual(["own dev server", "own dev server"]);
  });

  it("calls smoke red, and stops, when its server ends without answering", async () => {
    // Arrange
    const { site, seen } = fakeSite({ startedState: { kind: "ended", status: 1 } });
    // Act
    const passed = await verify(site, plan(VERIFY_OWN));
    // Assert
    expect(passed).toBe(false);
    expect(seen.said).toContain("output of own dev server\n");
    expect(seen.said.at(-1)).toBe("\nRed: smoke.");
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
