import { mkdtempSync, readdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { commitOf, jsonAt, writeJson, writeWhole } from "../../src/bin/siteFiles.ts";

/** The site's files, as bfg-site reads and writes them (src/bin/siteFiles.ts). */

describe("the site's files", () => {
  it("are written whole, their folder made, nothing partial left", () => {
    // Arrange
    const root = mkdtempSync(join(tmpdir(), "bfg-site-files-"));
    const path = join(root, "docs", "quality", "a.json");
    // Act
    writeWhole(path, "text");
    // Assert
    expect(readFileSync(path, "utf8")).toBe("text");
    expect(readdirSync(join(root, "docs", "quality"))).toEqual(["a.json"]);
  });

  it("read back as the JSON they were written with, or nothing without a file", () => {
    // Arrange
    const root = mkdtempSync(join(tmpdir(), "bfg-site-files-"));
    writeJson(join(root, "a.json"), { a: 1 });
    // Act
    const found = [jsonAt(join(root, "a.json")), jsonAt(join(root, "b.json"))];
    // Assert
    expect(found).toEqual([{ a: 1 }, undefined]);
  });

  it("name no commit outside a repository", () => {
    // Act
    const commit = commitOf(mkdtempSync(join(tmpdir(), "bfg-site-files-")));
    // Assert
    expect(commit).toBe("no-commit");
  });
});
