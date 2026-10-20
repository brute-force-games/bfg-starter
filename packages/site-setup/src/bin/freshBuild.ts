import { existsSync, mkdirSync, mkdtempSync, renameSync, rmSync } from "node:fs";
import { basename, join } from "node:path";
import { argsFor, describeFreshBuildProblem, readFreshBuild } from "./freshBuildArgs.ts";
import { exitCodeOf, type SitePorts } from "./ports.ts";

/**
 * `bfg-site fresh-build`: runs a build in a fresh folder of its own, then swaps it in for its target
 * (`dist`, `storybook-static`) only once it succeeds: builds side by side never write into each
 * other's output, and a failed build leaves the last good one in place. The fresh folder is under
 * .builds/, beside the target, so the swap is a rename. The arguments are freshBuildArgs.ts's.
 */
const BUILDS_FOLDER = ".builds";

export function freshBuild(site: SitePorts, argv: readonly string[]): number {
  const reading = readFreshBuild(argv);
  if (reading.kind === "unreadable") {
    site.complain(describeFreshBuildProblem(reading.problem));
    return 2;
  }
  const { build } = reading;
  const builds = join(site.root, BUILDS_FOLDER);
  mkdirSync(builds, { recursive: true });
  const fresh = mkdtempSync(join(builds, `${basename(build.target)}-`));
  const ran = site.processes.runHere({
    name: "build",
    program: build.program,
    args: argsFor(build, fresh),
    env: {},
  });
  if (ran.status !== 0) {
    rmSync(fresh, { recursive: true, force: true });
    site.complain(`The build failed; ${build.target} is as it was.`);
    return exitCodeOf(ran.status);
  }
  const target = join(site.root, build.target);
  const old = `${fresh}.old`;
  if (existsSync(target)) {
    renameSync(target, old);
  }
  renameSync(fresh, target);
  rmSync(old, { recursive: true, force: true });
  site.say(`Built into ${build.target}.`);
  return 0;
}
