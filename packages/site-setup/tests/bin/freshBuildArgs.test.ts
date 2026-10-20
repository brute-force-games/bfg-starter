import {
  argsFor,
  describeFreshBuildProblem,
  readFreshBuild,
  type FreshBuildProblem,
  type FreshBuildReading,
} from "../../src/bin/freshBuildArgs.ts";

/** What a fresh build is asked (src/bin/freshBuildArgs.ts). */

const USAGE = "Usage: bfg-site fresh-build <target> -- <command> <args, one with {out}>";

describe("a fresh build's command line", () => {
  it.each<{ argv: string[]; reading: FreshBuildReading }>([
    {
      argv: ["dist", "--", "npx", "astro", "build", "--outDir", "{out}"],
      reading: {
        kind: "read",
        build: { target: "dist", program: "npx", args: ["astro", "build", "--outDir", "{out}"] },
      },
    },
    { argv: [], reading: { kind: "unreadable", problem: { kind: "no-target" } } },
    { argv: [""], reading: { kind: "unreadable", problem: { kind: "no-target" } } },
    { argv: ["--", "npx"], reading: { kind: "unreadable", problem: { kind: "no-target" } } },
    { argv: ["dist", "npx"], reading: { kind: "unreadable", problem: { kind: "no-command" } } },
    { argv: ["dist", "--"], reading: { kind: "unreadable", problem: { kind: "no-command" } } },
    {
      argv: ["dist", "--", "npx", "astro", "build"],
      reading: { kind: "unreadable", problem: { kind: "no-out", program: "npx" } },
    },
  ])("reads $argv", ({ argv, reading }) => {
    // Act
    const read = readFreshBuild(argv);
    // Assert
    expect(read).toEqual(reading);
  });

  it("builds into the fresh folder wherever {out} is", () => {
    // Act
    const args = argsFor(
      { target: "dist", program: "npx", args: ["--outDir", "{out}", "--x={out}/a"] },
      "/b/dist-1",
    );
    // Assert
    expect(args).toEqual(["--outDir", "/b/dist-1", "--x=/b/dist-1/a"]);
  });

  it.each<{ problem: FreshBuildProblem; words: string }>([
    { problem: { kind: "no-target" }, words: `Which folder does the build replace? ${USAGE}` },
    { problem: { kind: "no-command" }, words: `What builds it? ${USAGE}` },
    {
      problem: { kind: "no-out", program: "npx" },
      words: `npx isn't told to build into {out}. ${USAGE}`,
    },
  ])("says what's wrong: $problem.kind", ({ problem, words }) => {
    // Act
    const said = describeFreshBuildProblem(problem);
    // Assert
    expect(said).toBe(words);
  });
});
