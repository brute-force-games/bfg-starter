import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  checkNodeVersions,
  nodeVersionLine,
  type NodePinSource,
  type PinText,
} from "./nodeVersions.ts";
import type { SitePorts } from "./ports.ts";

/** `bfg-site check-node`: the site's Node pins, read from its files, against the running Node. */

const PIN_FILES: readonly NodePinSource[] = [".nvmrc", "devbox.json", "package.json"];

/** The pins the site at `root` has, as its files say them. */
const pinTextsIn = (root: string): PinText[] =>
  PIN_FILES.filter((source) => existsSync(join(root, source))).map((source) => ({
    source,
    text: readFileSync(join(root, source), "utf8"),
  }));

export function checkNode(site: SitePorts, runtimeVersion: string): number {
  const check = checkNodeVersions(pinTextsIn(site.root), runtimeVersion);
  if (check.kind === "agree") {
    site.say(nodeVersionLine(check));
    return 0;
  }
  site.complain(nodeVersionLine(check));
  return 1;
}
