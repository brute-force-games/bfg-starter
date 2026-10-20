import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import {
  autoRebuildIn,
  createRebuilder,
  serveStorybookOn,
  storybookCli,
  storybookFoldersOf,
} from "../storybookServing.ts";

/**
 * Storybook as a route of the site (/storybook/), in dev and, unless left out, in the built site:
 * Astro's hooks only, onto storybookServing.ts, where the route is (and its tests). In dev it's a
 * snapshot rebuilt in the background (BFG_STORYBOOK_AUTOBUILD=0: only when it's missing).
 */

export interface StorybookRouteOptions {
  /** The site's folder (its astro.config.ts's `import.meta.dirname`). */
  readonly root: string;
  /** Whether the built site includes Storybook (a production build may leave it out). */
  readonly includeInBuild: boolean;
}

export function storybookRoute({ root, includeInBuild }: StorybookRouteOptions): AstroIntegration {
  const bin = join(root, "node_modules", ".bin", "storybook");
  return {
    name: "bfg:storybook-route",
    hooks: {
      "astro:server:setup": ({ server, logger }) => {
        // Vitest runs these hooks too (getViteConfig); tests serve no Storybook.
        if (process.env["VITEST"] !== undefined) {
          return;
        }
        const folders = storybookFoldersOf(root);
        serveStorybookOn(
          {
            onChange: (changed) => {
              server.watcher.on("all", (_event, path) => {
                changed(path);
              });
            },
            use: (middleware) => {
              server.middlewares.use(middleware);
            },
          },
          folders,
          createRebuilder(folders, storybookCli(bin), logger),
          autoRebuildIn(process.env),
        );
      },
      "astro:build:done": ({ dir, logger }) => {
        if (!includeInBuild) {
          logger.info("Storybook left out of this build");
          return;
        }
        const outputDir = fileURLToPath(new URL("storybook/", dir));
        logger.info(`Building Storybook into ${outputDir}`);
        execFileSync(bin, ["build", "--quiet", "--output-dir", outputDir], { stdio: "inherit" });
      },
    },
  };
}
