#!/usr/bin/env node
import { tmpdir } from "node:os";
import { runBfgSite } from "./commands.ts";
import { openSiteBrowser } from "../smoke/siteBrowser.ts";
import { nodeProcesses } from "./nodeProcesses.ts";

/** The `bfg-site` command: its command line, run in the site it's run from (commands.ts). */
const root = process.cwd();
process.exitCode = await runBfgSite(process.argv.slice(2), {
  root,
  env: process.env,
  scratch: tmpdir(),
  now: () => new Date(),
  say: (line) => {
    console.log(line);
  },
  complain: (line) => {
    console.error(line);
  },
  processes: nodeProcesses(root, process.env),
  smoke: { fetchPage: fetch, openBrowser: () => openSiteBrowser(root) },
});
