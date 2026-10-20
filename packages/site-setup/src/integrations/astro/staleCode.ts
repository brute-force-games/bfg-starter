import type { AstroIntegration } from "astro";
import type { Plugin } from "vite";
import { codeChanged, warnsOfStaleCode } from "../staleCode.ts";

/** The stale-code warning (staleCode.ts, where it's tested): Astro's and Vite's hooks only. */

function staleCodePlugin(): Plugin {
  let root = process.cwd();
  return {
    name: "bfg:stale-code",
    apply: "serve",
    configResolved: (config) => {
      root = config.root;
    },
    handleHotUpdate: ({ file, server }) => {
      server.ws.send(codeChanged(root, file));
    },
  };
}

export const staleCodeWarning = (): AstroIntegration => ({
  name: "bfg:stale-code",
  hooks: {
    "astro:config:setup": ({ command, updateConfig }) => {
      if (warnsOfStaleCode(command, process.env)) {
        updateConfig({ vite: { plugins: [staleCodePlugin()] } });
      }
    },
  },
});
