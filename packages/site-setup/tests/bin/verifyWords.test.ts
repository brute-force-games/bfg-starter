import type { Check, ProcessState } from "../../src/bin/ports.ts";
import {
  checkLine,
  ownDevServerUnanswered,
  skippedLine,
  verdictLine,
} from "../../src/bin/verifyWords.ts";
import type { CheckOutcome, E2ESkip, Verdict } from "../../src/bin/verifyStages.ts";

/** What verify says of a run (src/bin/verifyWords.ts). */

const LINT: Check = { name: "lint", program: "npx", args: ["oxlint"], env: {} };

describe("what verify says", () => {
  it.each<{ outcome: CheckOutcome; line: string }>([
    { outcome: { kind: "passed" }, line: "  ✓ lint (1.3s)" },
    { outcome: { kind: "failed", status: 2 }, line: "  ✗ lint (exit 2, 1.3s)" },
    {
      outcome: { kind: "not-ready", waitedSeconds: 180 },
      line: "  ✗ lint (didn't answer within 180s, 1.3s)",
    },
  ])("says a check that $outcome.kind in a line", ({ outcome, line }) => {
    // Act
    const said = checkLine({ check: LINT, outcome, seconds: 1.25 });
    // Assert
    expect(said).toBe(line);
  });

  it.each<{ state: ProcessState; outcome: CheckOutcome }>([
    { state: { kind: "running" }, outcome: { kind: "not-ready", waitedSeconds: 180 } },
    { state: { kind: "ended", status: 1 }, outcome: { kind: "failed", status: 1 } },
  ])("calls an own dev server that never answered red: $state.kind", ({ state, outcome }) => {
    // Act
    const result = ownDevServerUnanswered(LINT, state, 3);
    // Assert
    expect(result).toEqual({ check: LINT, outcome, seconds: 3 });
  });
});

describe("what verify says at the end of a run", () => {
  it.each<{ reason: E2ESkip; line: string }>([
    { reason: "red-below", line: "e2e: skipped, a stage below it is red" },
    {
      reason: "no-dev-server",
      line: "e2e: skipped, no dev server is up (start yours with `npm run dev`, or run with --own-dev-server)",
    },
  ])("says why e2e was skipped: $reason", ({ reason, line }) => {
    // Act
    const said = skippedLine(reason);
    // Assert
    expect(said).toBe(line);
  });

  it.each<{ verdict: Verdict; line: string }>([
    { verdict: { kind: "verified" }, line: "Verified: every stage green, e2e included." },
    { verdict: { kind: "green" }, line: "Green." },
    { verdict: { kind: "red", stages: ["static", "e2e"] }, line: "Red: static, e2e." },
    {
      verdict: { kind: "not-verified", reason: "no-dev-server" },
      line: "Not verified: every stage below e2e is green, but e2e didn't run (no dev server).",
    },
  ])("ends with the verdict: $verdict.kind", ({ verdict, line }) => {
    // Act
    const said = verdictLine(verdict);
    // Assert
    expect(said).toBe(line);
  });
});
