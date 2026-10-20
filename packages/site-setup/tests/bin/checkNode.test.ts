import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { checkNode } from "../../src/bin/checkNode.ts";
import { fakeSite } from "./fixtures/fakeSite.ts";

/** `bfg-site check-node` (src/bin/checkNode.ts): the pin files the site has, read. */

describe("bfg-site check-node", () => {
  it("reads every pin file the site has, and passes when they agree", () => {
    // Arrange
    const { site, seen } = fakeSite();
    writeFileSync(join(site.root, ".nvmrc"), "24");
    writeFileSync(
      join(site.root, "package.json"),
      JSON.stringify({ engines: { node: ">=24 <25" } }),
    );
    // Act
    const code = checkNode(site, "v24.6.0");
    // Assert
    expect(code).toBe(0);
    expect(seen.said).toEqual(["Node 24: the site's pins and the running Node agree."]);
  });

  it("fails, saying why, when they don't", () => {
    // Arrange
    const { site, seen } = fakeSite();
    writeFileSync(join(site.root, ".nvmrc"), "22");
    // Act
    const code = checkNode(site, "v24.6.0");
    // Assert
    expect(code).toBe(1);
    expect(seen.complained).toEqual([
      "Node major mismatch: .nvmrc=22, running=24. Keep the pins on one major, and run under it.",
    ]);
  });
});
