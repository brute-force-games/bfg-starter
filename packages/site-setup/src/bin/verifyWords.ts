import { onCase, type Cases } from "@brute-force-games/cases";
import { OWN_DEV_SERVER_FLAG } from "./verifyArgs.ts";
import { OWN_DEV_SERVER_WAIT_SECONDS } from "./ownDevServer.ts";
import type { Check, ProcessState } from "./ports.ts";
import type { CheckOutcome, CheckResult, E2ESkip, Verdict } from "./verifyStages.ts";

/** What verify says of a run: a line per check, why smoke or e2e didn't run, and the verdict. */

/** What follows a check's name in its line. */
const outcomeWords: Cases<CheckOutcome, "kind", string> = {
  passed: () => "",
  failed: ({ status }) => `exit ${String(status)}, `,
  "not-ready": ({ waitedSeconds }) => `didn't answer within ${String(waitedSeconds)}s, `,
};

/** A check's line in the report. */
export function checkLine(result: CheckResult): string {
  const mark = result.outcome.kind === "passed" ? "✓" : "✗";
  return `  ${mark} ${result.check.name} (${onCase(outcomeWords, result.outcome.kind, result.outcome)}${result.seconds.toFixed(1)}s)`;
}

/** A dev server of verify's own that never answered, still starting or ended: its check's result. */
export const ownDevServerUnanswered = (
  check: Check,
  server: ProcessState,
  seconds: number,
): CheckResult => ({
  check,
  outcome:
    server.kind === "ended"
      ? { kind: "failed", status: server.status }
      : { kind: "not-ready", waitedSeconds: OWN_DEV_SERVER_WAIT_SECONDS },
  seconds,
});

/** Why the smoke check didn't run, in a `verify` run: no dev server answered at `url`. */
export const smokeSkippedLine = (url: string): string =>
  `smoke: skipped, no dev server at ${url} (start yours with \`npm run dev\`, or run with ${OWN_DEV_SERVER_FLAG})`;

/** Why e2e didn't run, in words. */
export const skippedLine = (reason: E2ESkip): string =>
  reason === "red-below"
    ? "e2e: skipped, a stage below it is red"
    : `e2e: skipped, no dev server is up (start yours with \`npm run dev\`, or run with ${OWN_DEV_SERVER_FLAG})`;

/** The run's last line. */
const verdictLines: Cases<Verdict, "kind", string> = {
  verified: () => "Verified: every stage green, e2e included.",
  green: () => "Green.",
  red: ({ stages }) => `Red: ${stages.join(", ")}.`,
  "not-verified": () =>
    "Not verified: every stage below e2e is green, but e2e didn't run (no dev server).",
};

export const verdictLine = (verdict: Verdict): string =>
  onCase(verdictLines, verdict.kind, verdict);
