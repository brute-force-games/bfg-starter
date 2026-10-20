import { UNFORMATTED, siteOxfmtConfig } from "../src/oxfmt.ts";

/** A site's formatting (src/oxfmt.ts): authored prose, lock files and tool output left alone. */

describe("a site's oxfmt config", () => {
  it("never rewrites authored prose, lock files or tool output", () => {
    expect(siteOxfmtConfig()).toEqual({ ignorePatterns: [...UNFORMATTED] });
    expect(UNFORMATTED).toEqual(
      expect.arrayContaining(["docs/**", "content/**", "package-lock.json"]),
    );
  });

  it("leaves the site's own files alone too", () => {
    expect(siteOxfmtConfig({ ignore: ["src/generated/**"] }).ignorePatterns).toEqual([
      ...UNFORMATTED,
      "src/generated/**",
    ]);
  });
});
