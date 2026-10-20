import { contentFilesIn, markdownIn, yamlIn } from "../src/content.ts";

/** A site's content collections (src/content.ts): each a folder of content/, loaded by glob. */

describe("a site's content collections", () => {
  it.each([
    { kind: "pages", files: { pattern: "**/*.{md,mdx}", base: "./content/blog" } },
    { kind: "data", files: { pattern: "**/*.{yaml,yml}", base: "./content/blog" } },
  ] as const)("load a folder's $kind", ({ kind, files }) => {
    expect(contentFilesIn("blog", kind)).toEqual(files);
  });

  it.each([markdownIn("blog"), yamlIn("boards")])("are Astro's glob loader", (loader) => {
    expect(loader.name).toBe("glob-loader");
  });
});
