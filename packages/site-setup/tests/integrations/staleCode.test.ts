import { CODE_CHANGED_EVENT, codeChanged, warnsOfStaleCode } from "../../src/integrations/staleCode.ts";

/** The stale-code warning (src/integrations/staleCode.ts): every tab told what changed, in dev. */

describe("the stale-code warning", () => {
  it("tells every tab which file changed, from the site's root", () => {
    expect(codeChanged("/sites/one", "/sites/one/src/workers/host.ts")).toEqual({
      type: "custom",
      event: CODE_CHANGED_EVENT,
      data: "src/workers/host.ts",
    });
  });

  it.each([
    { command: "dev", env: {}, warns: true },
    { command: "build", env: {}, warns: false },
    { command: "dev", env: { VITEST: "true" }, warns: false },
  ])("warns: $warns, for `astro $command` with $env", ({ command, env, warns }) => {
    expect(warnsOfStaleCode(command, env)).toBe(warns);
  });
});
