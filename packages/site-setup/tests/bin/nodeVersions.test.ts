import {
  checkNodeVersions,
  nodeVersionLine,
  type NodeVersionCheck,
  type PinText,
} from "../../src/bin/nodeVersions.ts";

/** The site's Node pins against the running Node (src/bin/nodeVersions.ts). */

const DEVBOX = (...packages: string[]): string => JSON.stringify({ packages });
const ENGINES = (node: string): string => JSON.stringify({ engines: { node } });

const CHECKS: { what: string; texts: PinText[]; check: NodeVersionCheck }[] = [
  {
    what: "every pin and the running Node agree",
    texts: [
      { source: ".nvmrc", text: "24\n" },
      { source: "devbox.json", text: DEVBOX("nodejs@24.3", "git") },
      { source: "package.json", text: ENGINES(">=24 <25") },
    ],
    check: { kind: "agree", major: 24 },
  },
  {
    what: "a package.json and devbox.json that pin nothing",
    texts: [
      { source: "package.json", text: JSON.stringify({ name: "site" }) },
      { source: "devbox.json", text: DEVBOX("git") },
      { source: "package.json", text: JSON.stringify({ engines: {} }) },
    ],
    check: { kind: "no-pins" },
  },
  { what: "no pin files at all", texts: [], check: { kind: "no-pins" } },
  {
    what: "a pin that disagrees",
    texts: [{ source: ".nvmrc", text: "v22.1.0" }],
    check: { kind: "disagree", pins: [{ source: ".nvmrc", major: 22 }], running: 24 },
  },
  {
    what: "an .nvmrc without a version",
    texts: [{ source: ".nvmrc", text: "lts/*" }],
    check: { kind: "unreadable", source: ".nvmrc" },
  },
  {
    what: "a devbox.json that isn't JSON",
    texts: [{ source: "devbox.json", text: "{" }],
    check: { kind: "unreadable", source: "devbox.json" },
  },
  {
    what: "a devbox.json with two Nodes",
    texts: [{ source: "devbox.json", text: DEVBOX("nodejs@24", "nodejs@22") }],
    check: { kind: "unreadable", source: "devbox.json" },
  },
  {
    what: "a package.json whose engines aren't an object",
    texts: [{ source: "package.json", text: JSON.stringify({ engines: "24" }) }],
    check: { kind: "unreadable", source: "package.json" },
  },
  {
    what: "a package.json whose engines.node has no version",
    texts: [{ source: "package.json", text: ENGINES("lts") }],
    check: { kind: "unreadable", source: "package.json" },
  },
];

describe("the Node version check", () => {
  it.each<{ what: string; texts: PinText[]; check: NodeVersionCheck }>(CHECKS)(
    "finds $what",
    ({ texts, check }) => {
      // Act
      const found = checkNodeVersions(texts, "v24.6.0");
      // Assert
      expect(found).toEqual(check);
    },
  );
});

describe("what the Node version check says", () => {
  it.each<{ check: NodeVersionCheck; line: string }>([
    {
      check: { kind: "agree", major: 24 },
      line: "Node 24: the site's pins and the running Node agree.",
    },
    {
      check: { kind: "no-pins" },
      line: "The site pins no Node version: add .nvmrc, or engines.node in package.json.",
    },
    {
      check: { kind: "unreadable", source: ".nvmrc" },
      line: ".nvmrc has no Node major version the check can read.",
    },
    {
      check: {
        kind: "disagree",
        pins: [
          { source: ".nvmrc", major: 22 },
          { source: "package.json", major: 24 },
        ],
        running: 24,
      },
      line: "Node major mismatch: .nvmrc=22, package.json=24, running=24. Keep the pins on one major, and run under it.",
    },
  ])("says what it found: $check.kind", ({ check, line }) => {
    // Act
    const said = nodeVersionLine(check);
    // Assert
    expect(said).toBe(line);
  });
});
