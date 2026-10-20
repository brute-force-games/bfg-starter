import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { directGotos } from "../src/e2eGuard.ts";
import { runtimeImportsOf } from "./fixtures/imports.ts";

/** The guard on a site's e2e tests (src/e2eGuard.ts): pages opened through `open`, never `goto` itself. */

let dir = "";

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "bfg-site-e2e-guard-"));
  mkdirSync(join(dir, "rooms"));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("a site's e2e tests", () => {
  it("pass the guard when every page is opened through open()", () => {
    writeFileSync(join(dir, "home.spec.ts"), 'await open(page, "/");\n');
    expect(directGotos(dir)).toEqual([]);
  });

  it("are caught at each goto of their own, in any file under the folder, by file and line", () => {
    writeFileSync(join(dir, "home.spec.ts"), 'await open(page, "/");\nawait page.goto("/about/");\n');
    writeFileSync(join(dir, "rooms", "players.ts"), 'export const join = (page) => page.goto("/");\n');
    writeFileSync(join(dir, "notes.md"), 'page.goto("/") in prose\n');
    expect(directGotos(dir)).toEqual(["home.spec.ts:2", "rooms/players.ts:1"]);
  });
});

describe("the e2e helpers' imports", () => {
  it("take only Playwright's types, never its code", () => {
    expect(runtimeImportsOf(new URL("../src/e2e.ts", import.meta.url), "@playwright/test")).toEqual([]);
  });
});
