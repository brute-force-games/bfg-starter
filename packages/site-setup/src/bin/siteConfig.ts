import { readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { onCase, type Cases } from "@brute-force-games/cases";

/**
 * What a site tells `bfg-site`, in bfg-site.json at its root: its dev server's port (where verify
 * looks for the maintainer's server before e2e), where its quality records are kept, which folders
 * its complexity and unreachable-code counts read, and any static checks of its own, run beside the
 * shared ones.
 */
export const SITE_CONFIG_FILE = "bfg-site.json";

const checkSchema = z.object({
  name: z.string().min(1),
  program: z.string().min(1),
  args: z.array(z.string()).default([]),
});

export const siteConfigSchema = z.object({
  devServerPort: z.number().int().min(1).max(65_535),
  qualityFolder: z.string().min(1).default("docs/quality"),
  sources: z.array(z.string().min(1)).min(1).default(["src", "scripts"]),
  staticChecks: z.array(checkSchema).default([]),
});
export type SiteConfig = z.infer<typeof siteConfigSchema>;

/** Why bfg-site.json can't be read. */
export type SiteConfigProblem =
  | { readonly kind: "missing"; readonly path: string }
  | { readonly kind: "not-json"; readonly path: string }
  | { readonly kind: "invalid"; readonly path: string; readonly issues: string };

export type SiteConfigReading =
  | { readonly kind: "read"; readonly config: SiteConfig }
  | { readonly kind: "unreadable"; readonly problem: SiteConfigProblem };

/** The JSON in `text`, or undefined if it isn't JSON. */
function jsonIn(text: string): { readonly value: unknown } | undefined {
  try {
    return { value: JSON.parse(text) };
  } catch {
    return undefined;
  }
}

/** Reads the site's config from its folder, `root`. */
export function readSiteConfig(root: string): SiteConfigReading {
  const path = join(root, SITE_CONFIG_FILE);
  let text: string;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    return { kind: "unreadable", problem: { kind: "missing", path } };
  }
  const json = jsonIn(text);
  if (json === undefined) {
    return { kind: "unreadable", problem: { kind: "not-json", path } };
  }
  const parsed = siteConfigSchema.safeParse(json.value);
  return parsed.success
    ? { kind: "read", config: parsed.data }
    : {
        kind: "unreadable",
        problem: { kind: "invalid", path, issues: z.prettifyError(parsed.error) },
      };
}

const NEEDS = `It needs at least {"devServerPort": <the port your dev server runs on>}.`;

const configWords: Cases<SiteConfigProblem, "kind", string> = {
  missing: ({ path }) => `No ${SITE_CONFIG_FILE} at ${path}. ${NEEDS}`,
  "not-json": ({ path }) => `${path} isn't JSON. ${NEEDS}`,
  invalid: ({ path, issues }) => `${path} isn't a site config:\n${issues}`,
};

/** Why the config can't be read, in words, with what it needs. */
export const describeSiteConfigProblem = (problem: SiteConfigProblem): string =>
  onCase(configWords, problem.kind, problem);
