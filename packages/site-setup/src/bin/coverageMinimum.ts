import { z } from "zod";

/**
 * The least unit-test coverage a site accepts, in percent, per metric, kept in
 * <quality folder>/coverage-minimum.json, which the site's Vitest config reads. It ratchets: each
 * green coverage run raises it to what the run reached (coverage.ts), and nothing lowers it. A site
 * without the file has no ratchet. Pure.
 */
export const COVERAGE_MINIMUM_FILE = "coverage-minimum.json";

const percentage = z.number().min(0).max(100);

export const coverageMinimumsSchema = z.object({
  statements: percentage,
  functions: percentage,
  branches: percentage,
  lines: percentage,
});
export type CoverageMinimums = z.infer<typeof coverageMinimumsSchema>;
type CoverageMetric = keyof CoverageMinimums;
const COVERAGE_METRICS: readonly CoverageMetric[] = coverageMinimumsSchema.keyof().options;

/** A percentage rounded down to a tenth, so a run that matches it exactly still meets it. */
export const tenthBelow = (value: number): number => Math.floor(value * 10) / 10;

/** The minimums after a green run that reached `reached`: each raised to it, none lowered. */
export function raisedMinimums(
  minimums: CoverageMinimums,
  reached: CoverageMinimums,
): CoverageMinimums {
  const raise = (metric: CoverageMetric): number =>
    Math.max(minimums[metric], tenthBelow(reached[metric]));
  return {
    statements: raise("statements"),
    functions: raise("functions"),
    branches: raise("branches"),
    lines: raise("lines"),
  };
}

/** Each minimum that went up, in words; nothing when none did. */
export const raisedLines = (before: CoverageMinimums, after: CoverageMinimums): string[] =>
  COVERAGE_METRICS.filter((metric) => after[metric] > before[metric]).map(
    (metric) =>
      `Coverage minimum raised: ${metric} ${String(before[metric])}% → ${String(after[metric])}%.`,
  );
