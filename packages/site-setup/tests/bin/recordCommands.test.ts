import { join } from "node:path";
import { runBfgSite } from "../../src/bin/commands.ts";
import {
  AUDIT_USAGE,
  auditCommand,
  CHECK_PROOF_USAGE,
  checkProofCommand,
  GAMES_MODULE_RULE,
  RECORD_RUNNER,
  REFERENCE_GAMES_ONLY,
  tsxLoader,
  USAGE_EXIT,
} from "../../src/bin/recordCommands.ts";
import { configOf, fakeSite } from "./fixtures/fakeSite.ts";

/**
 * `bfg-site audit` and `bfg-site check-proof` (src/bin/recordCommands.ts): audit-cli's commands,
 * run over one file with the site's games from bfg-site.json, in a process of their own under
 * tsx, its exit code theirs.
 */

const WITH_GAMES = configOf({ games: "./src/games/registry.ts" });

describe("bfg-site audit", () => {
  it("runs audit-cli under tsx over the record, with the site's games from its root", async () => {
    // Arrange
    const { site, seen } = fakeSite();
    // Act
    const code = await auditCommand(["game.cbor", "--json"], site, WITH_GAMES);
    // Assert
    expect(code).toBe(0);
    expect(seen.ran).toEqual([
      {
        name: "audit",
        program: process.execPath,
        args: [
          "--import",
          tsxLoader(),
          RECORD_RUNNER,
          "audit",
          "game.cbor",
          "--json",
          "--games",
          join(site.root, "src/games/registry.ts"),
        ],
        env: {},
      },
    ]);
    expect(seen.complained).toEqual([]);
  });

  it.each([
    { what: "its exit code", status: 1, code: 1 },
    { what: "a stop by a signal as a failure", status: null, code: 1 },
  ])("passes back $what", async ({ status, code }) => {
    // Arrange
    const { site } = fakeSite({ statuses: { audit: status } });
    // Act, Assert
    await expect(auditCommand(["game.cbor"], site, WITH_GAMES)).resolves.toBe(code);
  });
});

describe("bfg-site audit, its games", () => {
  it("checks with the reference games, and says so, when bfg-site.json names none", async () => {
    // Arrange
    const { site, seen } = fakeSite();
    // Act
    await auditCommand(["game.cbor"], site, configOf());
    // Assert
    expect(seen.ran.at(0)?.args.slice(3)).toEqual(["audit", "game.cbor"]);
    expect(seen.complained).toEqual([REFERENCE_GAMES_ONLY]);
  });

  it("says what a games module must be when audit-cli can't use it", async () => {
    // Arrange
    const { site, seen } = fakeSite({ statuses: { audit: USAGE_EXIT } });
    // Act
    const code = await auditCommand(["game.cbor"], site, WITH_GAMES);
    // Assert
    expect(code).toBe(USAGE_EXIT);
    expect(seen.complained).toEqual([GAMES_MODULE_RULE]);
  });
});

describe("bfg-site audit, asked wrongly", () => {
  it.each([
    { what: "no file", args: [] },
    { what: "two files", args: ["a.cbor", "b.cbor"] },
    { what: "a games flag of its own", args: ["a.cbor", "--games", "x.ts"] },
    { what: "a flag it doesn't know", args: ["--strict"] },
  ])("refuses $what, running nothing", async ({ args }) => {
    // Arrange
    const { site, seen } = fakeSite();
    // Act
    const code = await auditCommand(args, site, WITH_GAMES);
    // Assert
    expect(code).toBe(USAGE_EXIT);
    expect(seen.complained).toEqual([AUDIT_USAGE]);
    expect(seen.ran).toEqual([]);
  });
});

describe("bfg-site check-proof", () => {
  it("checks the proof with the site's games", async () => {
    // Arrange
    const { site, seen } = fakeSite();
    // Act
    const code = await checkProofCommand(["proof.cbor"], site, WITH_GAMES);
    // Assert
    expect(code).toBe(0);
    expect(seen.ran.at(0)?.args.slice(3)).toEqual([
      "check-proof",
      "proof.cbor",
      "--games",
      join(site.root, "src/games/registry.ts"),
    ]);
  });

  it("says its own usage when asked wrongly", async () => {
    // Arrange
    const { site, seen } = fakeSite();
    // Act
    const code = await checkProofCommand([], site, WITH_GAMES);
    // Assert
    expect(code).toBe(USAGE_EXIT);
    expect(seen.complained).toEqual([CHECK_PROOF_USAGE]);
  });

  it("is one of bfg-site's commands, beside audit", async () => {
    // Arrange
    const { site } = fakeSite();
    // Act
    const code = await runBfgSite(["check-proof"], site);
    // Assert: no bfg-site.json, so it can't run, but it's a command (not usage).
    expect(code).toBe(2);
  });
});
