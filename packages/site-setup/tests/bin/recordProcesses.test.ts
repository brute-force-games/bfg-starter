import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  honestRecordFile,
  rogueProofFile,
  rogueRecordFile,
} from "@brute-force-games/audit-cli/testing";
import { RECORD_RUNNER, tsxLoader, USAGE_EXIT } from "../../src/bin/recordCommands.ts";

/**
 * bfg-site and its record runner as they really run, in processes of their own: the bin in plain
 * Node (its module graph must load there, as a site starts it), and the runner under tsx over real
 * record and proof files, with a games module plain or through a path alias.
 */

/** This folder's fixture `name`, by its absolute path. */
const fixture = (name: string): string =>
  fileURLToPath(new URL(`fixtures/${name}`, import.meta.url));

const BIN = fileURLToPath(new URL("../../src/bin/bfg-site.ts", import.meta.url));

/** `bytes` as a file in a fresh folder: its path. */
function fileOf(name: string, bytes: Uint8Array): string {
  const path = join(mkdtempSync(join(tmpdir(), "bfg-site-records-")), name);
  writeFileSync(path, bytes);
  return path;
}

/** The runner run as `bfg-site audit` or `check-proof` starts it, in `cwd`: how it ended. */
const runner = (cwd: string, ...args: string[]) =>
  spawnSync(process.execPath, ["--import", tsxLoader(), RECORD_RUNNER, ...args], {
    cwd,
    encoding: "utf8",
  });

describe("bfg-site, started as a site starts it", () => {
  it("loads in plain Node: no arguments get its usage", () => {
    // Act
    const started = spawnSync(process.execPath, [BIN], {
      cwd: mkdtempSync(join(tmpdir(), "bfg-site-bare-")),
      encoding: "utf8",
    });
    // Assert
    expect(started.stderr).toContain("Usage: bfg-site <");
    expect(started.status).toBe(2);
  });
});

describe("the record runner, under tsx", () => {
  it.each([
    { what: "an honest record as clean", file: honestRecordFile, code: 0 },
    { what: "a rogue host's record as findings", file: rogueRecordFile, code: 1 },
  ])("audits $what", async ({ file, code }) => {
    // Arrange
    const path = fileOf("game.cbor", await file());
    // Act
    const ended = runner(tmpdir(), "audit", path);
    // Assert
    expect(ended.status).toBe(code);
  });

  it("checks a rogue host's proof as convicting", async () => {
    // Arrange
    const path = fileOf("proof.cbor", await rogueProofFile());
    // Act
    const ended = runner(tmpdir(), "check-proof", path);
    // Assert
    expect(ended.status).toBe(0);
  });
});

describe("the record runner, with a site's games module", () => {
  it("loads one that imports through the site's tsconfig path alias", async () => {
    // Arrange
    const path = fileOf("game.cbor", await honestRecordFile());
    const site = fixture("aliasSite");
    // Act
    const ended = runner(site, "audit", path, "--games", join(site, "aliasGames.ts"));
    // Assert
    expect(ended.stderr).toBe("");
    expect(ended.status).toBe(0);
  });

  it("refuses one that can't load, saying why", async () => {
    // Arrange
    const path = fileOf("game.cbor", await honestRecordFile());
    // Act
    const ended = runner(tmpdir(), "audit", path, "--games", fixture("unloadableGames.ts"));
    // Assert
    expect(ended.status).toBe(USAGE_EXIT);
    expect(ended.stdout).toContain("couldn't load the games module");
  });
});
