import {
  describeVerifyRunProblem,
  readVerifyRun,
  type VerifyRunProblem,
  type VerifyRunReading,
} from "../../src/bin/verifyArgs.ts";

/** Reading verify's command line (src/bin/verifyArgs.ts). */

const READINGS: { argv: string[]; reading: VerifyRunReading }[] = [
  { argv: [], reading: { kind: "read", run: { kind: "verify", devServer: { kind: "yours" } } } },
  {
    argv: ["--own-dev-server"],
    reading: { kind: "read", run: { kind: "verify", devServer: { kind: "own" } } },
  },
  { argv: ["--build"], reading: { kind: "read", run: { kind: "build" } } },
  {
    argv: ["--stage", "unit"],
    reading: {
      kind: "read",
      run: { kind: "stage", stage: "unit", devServer: { kind: "yours" } },
    },
  },
  {
    argv: ["--stage", "e2e", "--own-dev-server"],
    reading: { kind: "read", run: { kind: "stage", stage: "e2e", devServer: { kind: "own" } } },
  },
  {
    argv: ["--stage", "lint"],
    reading: { kind: "unreadable", problem: { kind: "unknown-stage", stage: "lint" } },
  },
  {
    argv: ["--stage", "unit", "extra"],
    reading: {
      kind: "unreadable",
      problem: { kind: "unknown-argument", argument: "--stage unit extra" },
    },
  },
  {
    argv: ["--build", "--own-dev-server"],
    reading: {
      kind: "unreadable",
      problem: { kind: "own-dev-server-without-e2e", run: { kind: "build" } },
    },
  },
  {
    argv: ["--stage", "unit", "--own-dev-server"],
    reading: {
      kind: "unreadable",
      problem: { kind: "own-dev-server-without-e2e", run: { kind: "stage", stage: "unit" } },
    },
  },
];

describe("reading verify's command line", () => {
  it.each<{ argv: string[]; reading: VerifyRunReading }>(READINGS)(
    "reads $argv",
    ({ argv, reading }) => {
      // Act
      const read = readVerifyRun(argv);
      // Assert
      expect(read).toEqual(reading);
    },
  );
});

describe("what verify says of a command line it can't run", () => {
  it.each<{ problem: VerifyRunProblem; words: string }>([
    {
      problem: { kind: "unknown-argument", argument: "--fast" },
      words: 'Not understood: "--fast".',
    },
    { problem: { kind: "unknown-stage", stage: "lint" }, words: 'No stage "lint".' },
    {
      problem: { kind: "own-dev-server-without-e2e", run: { kind: "build" } },
      words: '--own-dev-server is for a run with e2e in it, not "--build".',
    },
    {
      problem: { kind: "own-dev-server-without-e2e", run: { kind: "stage", stage: "unit" } },
      words: '--own-dev-server is for a run with e2e in it, not "unit".',
    },
  ])("says what's wrong, and how it's run: $problem.kind", ({ problem, words }) => {
    // Act
    const described = describeVerifyRunProblem(problem);
    // Assert
    expect(described).toBe(
      `${words}\nUsage: bfg-site verify [--build | --stage <static | unit | integration | property | e2e>] [--own-dev-server]`,
    );
  });
});
