import type { StorybookConfig } from "@storybook/react-vite";
import type { InlineConfig } from "vite";
import { LINKED_DEDUPE } from "./astro.ts";

/**
 * A Brute Force Games site's Storybook (its .storybook/main.ts): React on Vite, the site's own
 * stories (src/), no telemetry, and, when the site links bfg-core's packages by `file:`, the same
 * Vite settings its Astro config has (Storybook runs its own Vite, not Astro's). Loaded in plain
 * Node before any bundler (review row 8).
 */

export interface SiteStorybookOptions {
  /** The site's own folder. */
  readonly root: string;
  /** Where the `file:`-linked bfg-core (and bfg-games) checkouts are, if it links them. */
  readonly linked?: string;
}

/** The site's own stories, from .storybook/. */
export const SITE_STORIES: readonly string[] = ["../src/**/*.stories.@(ts|tsx)"];

/** Storybook's Vite, given what the site links: its checkouts served, one copy of each shared package. */
export function storybookVite(
  vite: InlineConfig,
  { root, linked }: SiteStorybookOptions,
): InlineConfig {
  if (linked === undefined) {
    return vite;
  }
  return {
    ...vite,
    resolve: { ...vite.resolve, dedupe: [...LINKED_DEDUPE] },
    server: { ...vite.server, fs: { ...vite.server?.fs, allow: [root, linked] } },
  };
}

/** Storybook's `viteFinal` for the site. */
export const viteFinalFor =
  (options: SiteStorybookOptions) =>
  (vite: InlineConfig): InlineConfig =>
    storybookVite(vite, options);

export const siteStorybookConfig = (options: SiteStorybookOptions): StorybookConfig => ({
  framework: "@storybook/react-vite",
  stories: [...SITE_STORIES],
  // No data leaves the machine without the maintainer's say-so.
  core: { disableTelemetry: true },
  viteFinal: viteFinalFor(options),
});
