import {
  deadCodeOf,
  findingsInOxlint,
  findingsOf,
  percent,
  withEntry,
  type DeadCode,
  type HistoryEntry,
} from "../../src/bin/qualityHistory.ts";

/** The quality history's arithmetic (src/bin/qualityHistory.ts), over the tools' own outputs. */

const NO_DEAD_CODE: DeadCode = {
  files: 0,
  exports: 0,
  types: 0,
  enumMembers: 0,
  namespaceMembers: 0,
  duplicates: 0,
  dependencies: 0,
  devDependencies: 0,
  optionalPeerDependencies: 0,
  unlisted: 0,
  unresolved: 0,
  binaries: 0,
};
const COUNT = { total: 4, covered: 3 };
const entry = (commit: string, date: string): HistoryEntry => ({
  date,
  commit,
  coverage: { statements: COUNT, branches: COUNT, functions: COUNT, lines: COUNT },
  complexityFindings: 0,
  deadCode: NO_DEAD_CODE,
  unreachableFindings: 0,
});

describe("the quality history", () => {
  it.each([
    { count: { total: 4, covered: 3 }, percentage: 75 },
    { count: { total: 0, covered: 0 }, percentage: 100 },
  ])("counts $count as $percentage%", ({ count, percentage }) => {
    // Act
    const found = percent(count);
    // Assert
    expect(found).toBe(percentage);
  });

  it("counts a SARIF log's findings over its runs", () => {
    // Act
    const found = findingsOf({ runs: [{ results: [1, 2] }, { results: [3] }] });
    // Assert
    expect(found).toBe(3);
  });

  it("counts oxlint's findings", () => {
    // Act
    const found = findingsInOxlint({ diagnostics: [1, 2] });
    // Assert
    expect(found).toBe(2);
  });
});

describe("the quality history's dead code and entries", () => {
  it("counts knip's dead code by kind, over every file", () => {
    // Act
    const dead = deadCodeOf({
      issues: [
        { file: "a.ts", exports: [1, 2], types: [1] },
        { file: "b.ts", exports: [3], files: "not a list" },
      ],
    });
    // Assert
    expect(dead).toEqual({ ...NO_DEAD_CODE, exports: 3, types: 1 });
  });

  it.each([
    {
      what: "adds a new commit's run",
      history: [entry("aaaaaaa", "2026-10-19T00:00:00.000Z")],
      length: 2,
    },
    {
      what: "replaces the same commit's last run",
      history: [entry("bbbbbbb", "2026-10-19T00:00:00.000Z")],
      length: 1,
    },
  ])("$what", ({ history, length }) => {
    // Arrange
    const latest = entry("bbbbbbb", "2026-10-20T00:00:00.000Z");
    // Act
    const kept = withEntry(history, latest);
    // Assert
    expect(kept).toHaveLength(length);
    expect(kept.at(-1)).toEqual(latest);
  });
});
