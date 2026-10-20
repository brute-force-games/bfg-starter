import type { Check } from "../../src/bin/ports.ts";
import type { StageName, VerifyRun } from "../../src/bin/verifyArgs.ts";
import {
  e2eGate,
  goesOn,
  passes,
  verdictOf,
  type CheckResult,
  type E2EDecision,
  type E2EGate,
  type E2EServer,
  type StageResult,
  type Verdict,
} from "../../src/bin/verifyStages.ts";

/** A run's rules (src/bin/verifyStages.ts): when it stops, when e2e runs, and its verdict. */

const VERIFY: VerifyRun = { kind: "verify", devServer: { kind: "yours" } };
const BUILD: VerifyRun = { kind: "build" };

const LINT: Check = { name: "lint", program: "npx", args: ["oxlint"], env: {} };
const passed: CheckResult = { check: LINT, outcome: { kind: "passed" }, seconds: 1 };
const failed: CheckResult = { check: LINT, outcome: { kind: "failed", status: 1 }, seconds: 1 };
const green = (stage: StageName): StageResult => ({ stage, checks: [passed, passed] });
const red = (stage: StageName): StageResult => ({ stage, checks: [passed, failed] });

describe("a run's rules", () => {
  it.each<{ run: VerifyRun; result: StageResult; on: boolean }>([
    { run: BUILD, result: red("static"), on: false },
    { run: BUILD, result: green("static"), on: true },
    { run: VERIFY, result: red("static"), on: true },
    { run: VERIFY, result: red("smoke"), on: false },
    { run: VERIFY, result: green("smoke"), on: true },
  ])(
    "go on after a stage, for $run.kind, unless smoke or the build's is red",
    ({ run, result, on }) => {
      // Act
      const goes = goesOn(run, result);
      // Assert
      expect(goes).toBe(on);
    },
  );
});

describe("e2e's gate", () => {
  it.each<{ what: string; below: StageResult[]; server: E2EServer; gate: E2EGate }>([
    {
      what: "a stage below is red",
      below: [red("static")],
      server: { kind: "own" },
      gate: { kind: "skip", reason: "red-below" },
    },
    {
      what: "your dev server is down",
      below: [green("static")],
      server: { kind: "yours", answers: "down" },
      gate: { kind: "skip", reason: "no-dev-server" },
    },
    {
      what: "your dev server is up",
      below: [green("static")],
      server: { kind: "yours", answers: "up" },
      gate: { kind: "run" },
    },
    {
      what: "it has its own",
      below: [green("static")],
      server: { kind: "own" },
      gate: { kind: "run" },
    },
  ])("let e2e run or not when $what", ({ below, server, gate }) => {
    // Act
    const decided = e2eGate(below, server);
    // Assert
    expect(decided).toEqual(gate);
  });
});

describe("a run's verdict", () => {
  it.each<{
    what: string;
    run: VerifyRun;
    results: StageResult[];
    gate: E2EDecision;
    verdict: Verdict;
    passing: boolean;
  }>([
    {
      what: "red, naming each red stage",
      run: VERIFY,
      results: [red("static"), green("unit"), red("property")],
      gate: { kind: "skip", reason: "red-below" },
      verdict: { kind: "red", stages: ["static", "property"] },
      passing: false,
    },
    {
      what: "green, for the build",
      run: BUILD,
      results: [green("static")],
      gate: { kind: "not-asked" },
      verdict: { kind: "green" },
      passing: true,
    },
    {
      what: "not verified, without a dev server",
      run: VERIFY,
      results: [green("static")],
      gate: { kind: "skip", reason: "no-dev-server" },
      verdict: { kind: "not-verified", reason: "no-dev-server" },
      passing: false,
    },
    {
      what: "verified, e2e green",
      run: VERIFY,
      results: [green("static"), green("e2e")],
      gate: { kind: "run" },
      verdict: { kind: "verified" },
      passing: true,
    },
  ])("come to a verdict: $what", ({ run, results, gate, verdict, passing }) => {
    // Act
    const reached = verdictOf(run, results, gate);
    // Assert
    expect(reached).toEqual(verdict);
    expect(passes(reached)).toBe(passing);
  });
});
