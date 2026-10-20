import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { openRunReports } from "../../src/reports/reportFolder.ts";

/**
 * A run's reports folder, made (src/reports/reportFolder.ts) in a real repo folder: new and its own,
 * the oldest pruned, named for the commit git's files say.
 */

const AT = new Date("2026-10-19T20:41:05Z");
const SHA = "33904a7c0ffee00000000000000000000000beef";

let root = "";

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "bfg-site-reports-"));
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});

/** The run folders under reports/. */
const runs = (): string[] => readdirSync(join(root, "reports")).toSorted();

describe("a run's reports folder", () => {
  it("is made new under reports/, named for the commit, and told to the checks", () => {
    // Arrange
    mkdirSync(join(root, ".git", "refs", "heads"), { recursive: true });
    writeFileSync(join(root, ".git", "HEAD"), "ref: refs/heads/main\n");
    writeFileSync(join(root, ".git", "refs", "heads", "main"), `${SHA}\n`);
    const dir = join(root, "reports", "2026-10-19T20-41-05-33904a7");
    // Act
    const reports = openRunReports(root, {}, AT);
    // Assert
    expect(reports).toEqual({ kind: "ready", dir, env: { BFG_REPORT_DIR: dir } });
    expect(existsSync(dir)).toBe(true);
  });

  it("says there's no commit outside a repository", () => {
    // Act
    openRunReports(root, {}, AT);
    // Assert
    expect(runs()).toEqual(["2026-10-19T20-41-05-no-commit"]);
  });

  it("keeps the newest runs, as many as REPORTS_KEEP says, and anything else there", () => {
    // Arrange
    for (const old of ["2026-10-17T12-00-00-aaaaaaa", "2026-10-18T12-00-00-bbbbbbb", "notes"]) {
      mkdirSync(join(root, "reports", old), { recursive: true });
    }
    // Act
    openRunReports(root, { REPORTS_KEEP: "2" }, AT);
    // Assert
    expect(runs()).toEqual([
      "2026-10-18T12-00-00-bbbbbbb",
      "2026-10-19T20-41-05-no-commit",
      "notes",
    ]);
  });

  it("never shares a folder: a run named the same as one there fails", () => {
    // Arrange
    openRunReports(root, {}, AT);
    // Act
    const again = () => openRunReports(root, {}, AT);
    // Assert
    expect(again).toThrow("EEXIST");
  });
});

describe("a run whose reports can't be kept", () => {
  it("is one whose REPORTS_KEEP can't be read: it says why", () => {
    expect(openRunReports(root, { REPORTS_KEEP: "lots" }, AT)).toEqual({
      kind: "unreadable",
      problem:
        'REPORTS_KEEP must be a whole number from 1 (how many runs\' reports to keep), not "lots"',
    });
  });
});
