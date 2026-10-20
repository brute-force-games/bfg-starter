import { z } from "zod";
import { onCase, type Cases } from "@brute-force-games/cases";

/**
 * Whether the Node versions a site pins agree with each other and with the Node running:
 * .nvmrc, devbox.json's `nodejs@<major>` package, and package.json's `engines.node` (its lowest
 * major), whichever the site has. A site that pins none is told to. Pure; checkNode.ts reads the
 * files.
 */

/** Where a site pins its Node version. */
export type NodePinSource = ".nvmrc" | "devbox.json" | "package.json";

/** A pin's text, as the site has it. */
export interface PinText {
  readonly source: NodePinSource;
  readonly text: string;
}

/** A pin, read: its major version. */
interface NodePin {
  readonly source: NodePinSource;
  readonly major: number;
}

export type NodeVersionCheck =
  | { readonly kind: "agree"; readonly major: number }
  | { readonly kind: "no-pins" }
  | { readonly kind: "unreadable"; readonly source: NodePinSource }
  | { readonly kind: "disagree"; readonly pins: readonly NodePin[]; readonly running: number };

const FIRST_MAJOR = /(\d+)/u;
const DEVBOX_NODE = /^nodejs@(\d+)(?:\.|$)/u;

const devboxSchema = z.object({ packages: z.array(z.string()) });
const packageSchema = z.object({ engines: z.object({ node: z.string().optional() }).optional() });

/** What a file says of Node: a major, no pin at all, or something the check can't read. */
type PinReading =
  | { readonly kind: "pin"; readonly major: number }
  | { readonly kind: "none" }
  | { readonly kind: "unreadable" };

const UNREADABLE: PinReading = { kind: "unreadable" };
const NONE: PinReading = { kind: "none" };

/** The first whole number in `text`: a version's major, or a range's lowest. */
function majorIn(text: string): PinReading {
  const found = FIRST_MAJOR.exec(text);
  return found === null ? UNREADABLE : { kind: "pin", major: Number(found[0]) };
}

/** The JSON in `text`, or undefined if it isn't JSON. */
function jsonIn(text: string): { readonly value: unknown } | undefined {
  try {
    return { value: JSON.parse(text) };
  } catch {
    return undefined;
  }
}

/** devbox.json's `nodejs@<major>` package: none, or exactly one. */
function devboxPin(text: string): PinReading {
  const parsed = devboxSchema.safeParse(jsonIn(text)?.value);
  if (!parsed.success) {
    return UNREADABLE;
  }
  const majors = parsed.data.packages.filter((pkg) => DEVBOX_NODE.test(pkg));
  const [only, ...more] = majors;
  if (only === undefined) {
    return NONE;
  }
  return more.length === 0 ? majorIn(only) : UNREADABLE;
}

/** package.json's `engines.node`, its lowest major; no pin without one. */
function enginesPin(text: string): PinReading {
  const parsed = packageSchema.safeParse(jsonIn(text)?.value);
  if (!parsed.success) {
    return UNREADABLE;
  }
  const range = parsed.data.engines?.node;
  return range === undefined ? NONE : majorIn(range);
}

const pinReaders: Readonly<Record<NodePinSource, (text: string) => PinReading>> = {
  ".nvmrc": majorIn,
  "devbox.json": devboxPin,
  "package.json": enginesPin,
};

/** Checks the site's pins (`texts`, the files it has) against each other and the running Node. */
export function checkNodeVersions(
  texts: readonly PinText[],
  runtimeVersion: string,
): NodeVersionCheck {
  const pins: NodePin[] = [];
  for (const { source, text } of texts) {
    const reading = pinReaders[source](text);
    if (reading.kind === "unreadable") {
      return { kind: "unreadable", source };
    }
    if (reading.kind === "pin") {
      pins.push({ source, major: reading.major });
    }
  }
  if (pins.length === 0) {
    return { kind: "no-pins" };
  }
  const running = Number(FIRST_MAJOR.exec(runtimeVersion)?.[0]);
  return pins.every((pin) => pin.major === running)
    ? { kind: "agree", major: running }
    : { kind: "disagree", pins, running };
}

const nodeWords: Cases<NodeVersionCheck, "kind", string> = {
  agree: ({ major }) => `Node ${String(major)}: the site's pins and the running Node agree.`,
  "no-pins": () => "The site pins no Node version: add .nvmrc, or engines.node in package.json.",
  unreadable: ({ source }) => `${source} has no Node major version the check can read.`,
  disagree: ({ pins, running }) =>
    `Node major mismatch: ${pins.map((pin) => `${pin.source}=${String(pin.major)}`).join(", ")}, running=${String(running)}. Keep the pins on one major, and run under it.`,
};

/** What the check found, in words. */
export const nodeVersionLine = (check: NodeVersionCheck): string =>
  onCase(nodeWords, check.kind, check);
