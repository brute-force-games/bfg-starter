import { readFileSync } from "node:fs";

/**
 * What a source file imports from `pkg` at run time: each import of it that isn't `import type`,
 * on one line or several. For the guards that keep a preset to Playwright's types (a site's runner
 * must load one copy of Playwright).
 */
export function runtimeImportsOf(file: URL, pkg: string): string[] {
  const escaped = pkg.replaceAll(/[/.]/gu, (char) => `\\${char}`);
  const imports = readFileSync(file, "utf8").matchAll(new RegExp(String.raw`\bimport\s+([^;]*?)\s+from\s+"${escaped}"`, "gu"));
  return [...imports].map(([, what]) => String(what)).filter((what) => !what.startsWith("type "));
}
