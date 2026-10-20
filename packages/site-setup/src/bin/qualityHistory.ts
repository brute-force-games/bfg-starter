import { z } from "zod";

/**
 * The history of quality runs (<quality folder>/history.json): each run's coverage totals, from
 * Vitest's `json-summary`; how many functions oxlint's complexity report lists, from its SARIF;
 * dead code by kind, from knip's JSON; and unreachable code found, from oxlint's JSON. One entry
 * per commit: a later run on the same commit replaces it. Pure; quality.ts reads and writes the files.
 */

const countSchema = z.object({ total: z.number().int(), covered: z.number().int() });

/** How much of one coverage metric is covered. */
export type Count = z.infer<typeof countSchema>;

const countsSchema = z.object({
  statements: countSchema,
  branches: countSchema,
  functions: countSchema,
  lines: countSchema,
});

/** Vitest's `coverage-summary.json`: `total`, and each file by its path. */
export const coverageSummarySchema = z.looseObject({ total: countsSchema });

/** As much of a SARIF log as the history reads: each run's results. */
export const sarifLogSchema = z.object({
  runs: z.array(z.object({ results: z.array(z.unknown()) })),
});
export type SarifLog = z.infer<typeof sarifLogSchema>;

const count = z.number().int().nonnegative();

/** Dead code knip found, by kind: each kind of finding it reports, counted. */
const deadCodeSchema = z.object({
  files: count,
  exports: count,
  types: count,
  enumMembers: count,
  namespaceMembers: count,
  duplicates: count,
  dependencies: count,
  devDependencies: count,
  optionalPeerDependencies: count,
  unlisted: count,
  unresolved: count,
  binaries: count,
});
export type DeadCode = z.infer<typeof deadCodeSchema>;
export type DeadCodeKind = keyof DeadCode;
export const DEAD_CODE_KINDS: readonly DeadCodeKind[] = deadCodeSchema.keyof().options;

/** As much of knip's JSON report as the history reads: each file's findings, by kind. */
export const knipReportSchema = z.object({
  issues: z.array(z.record(z.string(), z.unknown())),
});
export type KnipReport = z.infer<typeof knipReportSchema>;

/** As much of oxlint's JSON report as the history reads: its findings. */
export const oxlintReportSchema = z.object({ diagnostics: z.array(z.unknown()) });
export type OxlintReport = z.infer<typeof oxlintReportSchema>;

const historyEntrySchema = z.object({
  date: z.iso.datetime(),
  /** The commit checked out, read from git's own files; "no-commit" outside a repository. */
  commit: z.string().min(1),
  coverage: countsSchema,
  /** How many complexity findings the report lists (functions over its floor, per metric). */
  complexityFindings: count,
  /** Dead code knip found, by kind (unused files are held at zero; the rest trend down). */
  deadCode: deadCodeSchema,
  /** Unreachable code oxlint found (`no-unreachable`, `no-unreachable-loop`), held at zero. */
  unreachableFindings: count,
});
export type HistoryEntry = z.infer<typeof historyEntrySchema>;

export const historySchema = z.array(historyEntrySchema);
export type History = z.infer<typeof historySchema>;

/** A count's percentage; a metric with nothing to cover is wholly covered. */
export const percent = ({ total, covered }: Count): number =>
  total === 0 ? 100 : (covered / total) * 100;

/** How many findings a SARIF log has, over all its runs. */
export const findingsOf = (log: SarifLog): number =>
  log.runs.reduce((sum, run) => sum + run.results.length, 0);

/** How many of a finding's kind a knip issue lists. */
const countOf = (findings: unknown): number => (Array.isArray(findings) ? findings.length : 0);

/** Dead code by kind, over every file in knip's report. */
export function deadCodeOf(report: KnipReport): DeadCode {
  const total = (kind: DeadCodeKind): number =>
    report.issues.reduce((sum, issue) => sum + countOf(issue[kind]), 0);
  return {
    files: total("files"),
    exports: total("exports"),
    types: total("types"),
    enumMembers: total("enumMembers"),
    namespaceMembers: total("namespaceMembers"),
    duplicates: total("duplicates"),
    dependencies: total("dependencies"),
    devDependencies: total("devDependencies"),
    optionalPeerDependencies: total("optionalPeerDependencies"),
    unlisted: total("unlisted"),
    unresolved: total("unresolved"),
    binaries: total("binaries"),
  };
}

/** How many findings oxlint's JSON report has. */
export const findingsInOxlint = (report: OxlintReport): number => report.diagnostics.length;

/** `history` with `entry`: replacing the last entry if it's of the same commit, else added. */
export function withEntry(history: History, entry: HistoryEntry): History {
  const last = history.at(-1);
  return last?.commit === entry.commit ? [...history.slice(0, -1), entry] : [...history, entry];
}
