import {
  keptRunsOf,
  keptRunsProblem,
  reportPathsIn,
  runNameOf,
  runsToPrune,
  shortCommitIn,
} from "../../src/reports/reportRuns.ts";

/** Each run's HTML reports (src/reports/reportRuns.ts): its folder, what's kept, where each goes. */

const SHA = "33904a7c0ffee00000000000000000000000beef";

describe("a run's folder", () => {
  it("is named for when it ran (UTC, to the second) and the commit", () => {
    expect(runNameOf(new Date("2026-10-19T20:41:05.123Z"), "33904a7")).toBe(
      "2026-10-19T20-41-05-33904a7",
    );
  });

  it("says so when there's no commit to name", () => {
    expect(runNameOf(new Date("2026-10-19T20:41:05Z"))).toBe("2026-10-19T20-41-05-no-commit");
  });

  it("holds each tool's report in a place of its own", () => {
    const paths = reportPathsIn("/r/run");
    expect([
      paths.tests("unit"),
      paths.tests("property"),
      paths.coverage,
      paths.complexitySarif,
      paths.complexityHtml,
      paths.e2e,
    ]).toEqual([
      "/r/run/tests/unit",
      "/r/run/tests/property",
      "/r/run/coverage",
      "/r/run/complexity/complexity.sarif",
      "/r/run/complexity/index.html",
      "/r/run/e2e",
    ]);
  });
});

describe("the runs kept", () => {
  const runs = [
    "2026-10-19T20-41-05-33904a7",
    "2026-10-18T09-00-00-aaaaaaa",
    "2026-10-19T08-00-00-no-commit",
    "2026-10-17T12-00-00-bbbbbbb",
  ];

  it("prunes the oldest, leaving the newest `keep`", () => {
    expect(runsToPrune(runs, 2)).toEqual([
      "2026-10-17T12-00-00-bbbbbbb",
      "2026-10-18T09-00-00-aaaaaaa",
    ]);
  });

  it("prunes nothing while there are no more than `keep`", () => {
    expect(runsToPrune(runs, 5)).toEqual([]);
  });

  it("never prunes a folder it didn't make", () => {
    expect(runsToPrune(["notes", ".DS_Store", ...runs], 4)).toEqual([]);
  });

  it.each([
    { given: undefined, kept: { kind: "keep", runs: 5 } },
    { given: "3", kept: { kind: "keep", runs: 3 } },
    { given: "0", kept: { kind: "unreadable", given: "0" } },
    { given: "two", kept: { kind: "unreadable", given: "two" } },
    { given: "2.5", kept: { kind: "unreadable", given: "2.5" } },
    { given: " 3", kept: { kind: "unreadable", given: " 3" } },
  ])("reads REPORTS_KEEP=$given", ({ given, kept }) => {
    expect(keptRunsOf(given)).toEqual(kept);
  });

  it("says what REPORTS_KEEP must be", () => {
    expect(keptRunsProblem("two")).toBe(
      'REPORTS_KEEP must be a whole number from 1 (how many runs\' reports to keep), not "two"',
    );
  });
});

/** git's files, as `shortCommitIn` reads them. */
const gitFiles =
  (files: Readonly<Record<string, string>>) =>
  (path: string): string | undefined =>
    files[path];

describe("the commit checked out, from git's own files", () => {
  it("follows HEAD to its branch's ref file", () => {
    const read = gitFiles({ HEAD: "ref: refs/heads/main\n", "refs/heads/main": `${SHA}\n` });
    expect(shortCommitIn(read)).toBe("33904a7");
  });

  it("finds a packed branch in packed-refs", () => {
    const read = gitFiles({
      HEAD: "ref: refs/heads/main\n",
      "packed-refs": `# pack-refs with: peeled\n${SHA} refs/heads/main\n`,
    });
    expect(shortCommitIn(read)).toBe("33904a7");
  });

  it("reads a detached HEAD's commit", () => {
    expect(shortCommitIn(gitFiles({ HEAD: `${SHA}\n` }))).toBe("33904a7");
  });

  it.each([
    { what: "no repository", files: {} },
    { what: "a branch with no commit yet", files: { HEAD: "ref: refs/heads/new\n" } },
    { what: "something that isn't a commit", files: { HEAD: "garbage\n" } },
  ])("is none for $what", ({ files }) => {
    expect(shortCommitIn(gitFiles(files))).toBeUndefined();
  });
});
