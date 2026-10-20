import { onCase, type Cases } from "@brute-force-games/cases";

/**
 * What `bfg-site fresh-build` is asked: the folder a build replaces when it's done, and the command
 * that builds, its `{out}` standing for the build's own fresh folder:
 *
 *   bfg-site fresh-build dist -- npx astro build --outDir {out}
 */

const OUT = "{out}";

/** A build to run in a fresh folder, then swap in for `target`. */
export interface FreshBuild {
  readonly target: string;
  readonly program: string;
  /** The command's arguments, `{out}` still in them. */
  readonly args: readonly string[];
}

export type FreshBuildProblem =
  | { readonly kind: "no-target" }
  | { readonly kind: "no-command" }
  | { readonly kind: "no-out"; readonly program: string };

export type FreshBuildReading =
  | { readonly kind: "read"; readonly build: FreshBuild }
  | { readonly kind: "unreadable"; readonly problem: FreshBuildProblem };

/** Reads `<target> -- <command> <args…>`, which must name `{out}` somewhere in its arguments. */
export function readFreshBuild(argv: readonly string[]): FreshBuildReading {
  const [target, separator, program, ...args] = argv;
  if (target === undefined || target === "" || target.startsWith("-")) {
    return { kind: "unreadable", problem: { kind: "no-target" } };
  }
  if (separator !== "--" || program === undefined) {
    return { kind: "unreadable", problem: { kind: "no-command" } };
  }
  if (!args.some((arg) => arg.includes(OUT))) {
    return { kind: "unreadable", problem: { kind: "no-out", program } };
  }
  return { kind: "read", build: { target, program, args } };
}

/** The command's arguments, building into `out`. */
export const argsFor = (build: FreshBuild, out: string): string[] =>
  build.args.map((arg) => arg.replaceAll(OUT, out));

const USAGE = `Usage: bfg-site fresh-build <target> -- <command> <args, one with ${OUT}>`;

const freshBuildWords: Cases<FreshBuildProblem, "kind", string> = {
  "no-target": () => `Which folder does the build replace? ${USAGE}`,
  "no-command": () => `What builds it? ${USAGE}`,
  "no-out": ({ program }) => `${program} isn't told to build into ${OUT}. ${USAGE}`,
};

/** A problem in words, with how it's meant to be run. */
export const describeFreshBuildProblem = (problem: FreshBuildProblem): string =>
  onCase(freshBuildWords, problem.kind, problem);
