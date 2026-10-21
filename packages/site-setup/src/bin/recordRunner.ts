#!/usr/bin/env node
import { nodeIoWith, runAudit, runVerify } from "@brute-force-games/audit-cli";

/**
 * audit-cli's commands, run in a process of their own: what `bfg-site audit` and `check-proof`
 * start under tsx, in the site's root, so audit-cli's sources and the site's games module (with
 * its tsconfig's path aliases) load (recordCommands.ts). `<audit | check-proof> <file> [--json]
 * [--games <module>]`.
 */
const [command, ...args] = process.argv.slice(2);
const io = nodeIoWith((text: string) => {
  process.stdout.write(`${text}\n`);
});
process.exitCode = command === "check-proof" ? await runVerify(args, io) : await runAudit(args, io);
