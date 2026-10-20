import {
  checkDeadCode,
  describeDeadCodeProblem,
  loweredBaselines,
  type DeadCodeProblem,
} from "../../src/bin/deadCodeCheck.ts";
import type { DeadCode } from "../../src/bin/qualityHistory.ts";

/** The dead-code gate's rules (src/bin/deadCodeCheck.ts): zero, but exports and types, which ratchet. */

const NONE: DeadCode = {
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

describe("the dead-code gate", () => {
  it("passes within the baseline, and lowers it to what's left", () => {
    // Act
    const checked = checkDeadCode({ ...NONE, exports: 2, types: 1 }, { exports: 5, types: 1 });
    // Assert
    expect(checked).toEqual({ problems: [], baseline: { exports: 2, types: 1 } });
  });

  it("fails on any kind held at zero, and on exports or types above the baseline", () => {
    // Act
    const checked = checkDeadCode({ ...NONE, files: 1, types: 3 }, { exports: 0, types: 2 });
    // Assert
    expect(checked.problems).toEqual([
      { kind: "not-zero", deadKind: "files", count: 1 },
      { kind: "above-baseline", deadKind: "types", count: 3, baseline: 2 },
    ]);
  });

  it.each<{ problem: DeadCodeProblem; words: string }>([
    {
      problem: { kind: "not-zero", deadKind: "files", count: 1 },
      words: "knip: 1 files, held at zero: delete the dead code (npx knip --include files).",
    },
    {
      problem: { kind: "above-baseline", deadKind: "types", count: 3, baseline: 2 },
      words:
        "knip: 3 unused types, above the baseline of 2: delete what's unused, or use it (npx knip --include types).",
    },
  ])("says what to do: $problem.kind", ({ problem, words }) => {
    // Act
    const said = describeDeadCodeProblem(problem);
    // Assert
    expect(said).toBe(words);
  });

  it("says where the baseline went down", () => {
    // Act
    const lines = loweredBaselines({ exports: 5, types: 1 }, { exports: 2, types: 1 });
    // Assert
    expect(lines).toEqual(["knip: unused exports baseline lowered, 5 → 2."]);
  });
});
