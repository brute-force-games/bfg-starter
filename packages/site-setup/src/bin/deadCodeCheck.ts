import { z } from "zod";
import { onCase, type Cases } from "@brute-force-games/cases";
import { DEAD_CODE_KINDS, type DeadCode, type DeadCodeKind } from "./qualityHistory.ts";

/**
 * The dead-code gate (`bfg-site dead-code`, in verify's static stage): every kind of dead code knip
 * reports is held at zero, but unused exports and types, which ratchet: they may not rise above
 * their baseline (<quality folder>/dead-code-baseline.json; none means zero), and the baseline
 * follows them down, never up. Pure.
 */
export const DEAD_CODE_BASELINE_FILE = "dead-code-baseline.json";

/** The kinds that ratchet down from a baseline; every other kind is held at zero. */
export type RatchetedKind = "exports" | "types";
const RATCHETED_KINDS: readonly RatchetedKind[] = ["exports", "types"];

const count = z.number().int().nonnegative();
export const deadCodeBaselineSchema = z.object({ exports: count, types: count });
export type DeadCodeBaseline = z.infer<typeof deadCodeBaselineSchema>;

/** A site without a baseline holds every kind at zero. */
export const NO_BASELINE: DeadCodeBaseline = { exports: 0, types: 0 };

export type DeadCodeProblem =
  | { readonly kind: "not-zero"; readonly deadKind: DeadCodeKind; readonly count: number }
  | {
      readonly kind: "above-baseline";
      readonly deadKind: RatchetedKind;
      readonly count: number;
      readonly baseline: number;
    };

/** What the gate found: its problems (none means it passes), and the baseline to keep. */
export interface DeadCodeCheck {
  readonly problems: readonly DeadCodeProblem[];
  readonly baseline: DeadCodeBaseline;
}

const isRatcheted = (kind: DeadCodeKind): kind is RatchetedKind =>
  RATCHETED_KINDS.some((ratcheted) => ratcheted === kind);

/** Checks `dead` against the zero kinds and `baseline`, which comes back lowered where it can. */
export function checkDeadCode(dead: DeadCode, baseline: DeadCodeBaseline): DeadCodeCheck {
  const notZero = DEAD_CODE_KINDS.filter((kind) => !isRatcheted(kind) && dead[kind] > 0).map(
    (deadKind): DeadCodeProblem => ({ kind: "not-zero", deadKind, count: dead[deadKind] }),
  );
  const aboveBaseline = RATCHETED_KINDS.filter((kind) => dead[kind] > baseline[kind]).map(
    (deadKind): DeadCodeProblem => ({
      kind: "above-baseline",
      deadKind,
      count: dead[deadKind],
      baseline: baseline[deadKind],
    }),
  );
  return {
    problems: [...notZero, ...aboveBaseline],
    baseline: {
      exports: Math.min(baseline.exports, dead.exports),
      types: Math.min(baseline.types, dead.types),
    },
  };
}

const deadCodeWords: Cases<DeadCodeProblem, "kind", string> = {
  "not-zero": ({ count: found, deadKind }) =>
    `knip: ${String(found)} ${deadKind}, held at zero: delete the dead code (npx knip --include ${deadKind}).`,
  "above-baseline": ({ count: found, deadKind, baseline }) =>
    `knip: ${String(found)} unused ${deadKind}, above the baseline of ${String(baseline)}: delete what's unused, or use it (npx knip --include ${deadKind}).`,
};

/** A problem in words, with what to do. */
export const describeDeadCodeProblem = (problem: DeadCodeProblem): string =>
  onCase(deadCodeWords, problem.kind, problem);

/** Where the baseline went down, in words: one line per kind lowered. */
export const loweredBaselines = (before: DeadCodeBaseline, after: DeadCodeBaseline): string[] =>
  RATCHETED_KINDS.filter((kind) => after[kind] < before[kind]).map(
    (kind) =>
      `knip: unused ${kind} baseline lowered, ${String(before[kind])} → ${String(after[kind])}.`,
  );
