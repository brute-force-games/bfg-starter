import { mkdirSync, mkdtempSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  storybookFoldersOf,
  type StorybookBuilder,
  type StorybookFolders,
  type StorybookLog,
} from "../../../src/integrations/storybookServing.ts";

/** A site for Storybook's route to serve (src/integrations/storybookServing.ts), and stand-ins. */

/** A site in a fresh folder: its Storybook folders, and a way to write its files. */
export interface StorybookSite {
  readonly root: string;
  readonly folders: StorybookFolders;
  /** Writes `path` under the site, last modified at `seconds`. */
  readonly file: (path: string, seconds: number, text?: string) => void;
}

export function storybookSite(): StorybookSite {
  const root = mkdtempSync(join(tmpdir(), "bfg-storybook-route-"));
  return {
    root,
    folders: storybookFoldersOf(root),
    file: (path, seconds, text = "") => {
      const full = join(root, path);
      mkdirSync(join(full, ".."), { recursive: true });
      writeFileSync(full, text);
      utimesSync(full, new Date(seconds * 1000), new Date(seconds * 1000));
    },
  };
}

/** A builder that writes a Storybook build's index, saying `which`, and counts its builds. */
export function writingBuilder(
  which: string,
): StorybookBuilder & { readonly builds: () => number } {
  let builds = 0;
  return {
    build: (outputDir) => {
      builds += 1;
      writeFileSync(join(outputDir, "index.html"), which);
      return Promise.resolve();
    },
    builds: () => builds,
  };
}

export const failingBuilder: StorybookBuilder = {
  build: () => Promise.reject(new Error("no stories")),
};

/** A log that keeps what it's told. */
export function keptLog(): StorybookLog & { readonly lines: string[] } {
  const lines: string[] = [];
  return {
    info: (line) => {
      lines.push(line);
    },
    error: (line) => {
      lines.push(`error: ${line}`);
    },
    lines,
  };
}
