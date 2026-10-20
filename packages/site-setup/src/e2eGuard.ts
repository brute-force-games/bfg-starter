import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Keeps a site's end-to-end tests opening pages through the setup's `open` (e2e.ts), which waits
 * for "Ready": every place under `dir` that calls `.goto(` itself, as `file:line`. A site's unit
 * test asserts there are none.
 */
export function directGotos(dir: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((path) => /\.tsx?$/u.test(path))
    .toSorted()
    .flatMap((path) =>
      readFileSync(join(dir, path), "utf8")
        .split("\n")
        .flatMap((line, index) => (/\.goto\(/u.test(line) ? [`${path}:${String(index + 1)}`] : [])),
    );
}
