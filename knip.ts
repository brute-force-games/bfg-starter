import type { KnipConfig } from "knip";

/**
 * bfg-starter's own dead-code check (`npm run lint`): the setup, its tests the entries that use
 * what it exports.
 *
 * - The example is left out here because it runs its own knip, from its own folder
 *   (`npm -w example run lint`). Loaded from the root, its Astro config looks for src/pages in
 *   the wrong place.
 * - Two optional peers are referenced on purpose: `pagefind` only by the page-search entry, which a
 *   site imports only when it uses page search (and then installs pagefind), and
 *   `@storybook/react-vite` for its types only.
 */
const config: KnipConfig = {
  ignoreWorkspaces: ["example"],
  workspaces: {
    "packages/site-setup": {
      // The record runner's tests load these games modules by path, as a site's bfg-site.json
      // names one (the alias site's through its own tsconfig), so nothing imports them.
      entry: [
        "tests/**/*.test.{ts,tsx}",
        "tests/bin/fixtures/*Games.ts",
        "tests/bin/fixtures/aliasSite/**/*.ts",
      ],
      project: ["src/**/*.{ts,tsx}", "tests/**/*.{ts,tsx}"],
      astro: false,
      ignoreDependencies: ["@storybook/react-vite", "pagefind"],
    },
  },
};

export default config;
