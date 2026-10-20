import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  raisedLines,
  raisedMinimums,
  readCoverageMinimums,
  tenthBelow,
  type CoverageMinimums,
} from "../../src/bin/coverageMinimum.ts";

/** The coverage minimum's ratchet (src/bin/coverageMinimum.ts): up to what a run reached, never down. */

const BEFORE: CoverageMinimums = { statements: 80, functions: 80, branches: 70, lines: 80 };

describe("the coverage minimum", () => {
  it("rounds down to a tenth, so a run that matches it meets it", () => {
    // Act
    const rounded = tenthBelow(83.4567);
    // Assert
    expect(rounded).toBe(83.4);
  });

  it("rises to what a run reached, and never falls", () => {
    // Act
    const after = raisedMinimums(BEFORE, {
      statements: 85.55,
      functions: 70,
      branches: 70,
      lines: 80.01,
    });
    // Assert
    expect(after).toEqual({ statements: 85.5, functions: 80, branches: 70, lines: 80 });
  });

  it("says each minimum that went up", () => {
    // Act
    const lines = raisedLines(BEFORE, { ...BEFORE, statements: 85.5 });
    // Assert
    expect(lines).toEqual(["Coverage minimum raised: statements 80% → 85.5%."]);
  });

  it("is read from the site's file", () => {
    // Arrange
    const path = join(mkdtempSync(join(tmpdir(), "bfg-site-minimum-")), "coverage-minimum.json");
    writeFileSync(path, JSON.stringify(BEFORE));
    // Act
    const read = readCoverageMinimums(path);
    // Assert
    expect(read).toEqual(BEFORE);
  });
});
