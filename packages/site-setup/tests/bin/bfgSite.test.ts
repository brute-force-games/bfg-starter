import { runBfgSite } from "../../src/bin/commands.ts";
import type { SitePorts } from "../../src/bin/ports.ts";
import { openSiteBrowser } from "../../src/smoke/siteBrowser.ts";

/** The `bfg-site` command's entry (src/bin/bfg-site.ts): its command line, in the folder it's run from. */

vi.mock("../../src/bin/commands.ts", () => ({
  runBfgSite: vi.fn<(argv: readonly string[], site: SitePorts) => Promise<number>>(
    async (_argv, site) => {
      site.say(`now ${site.now().toISOString().slice(0, 2)}`);
      site.complain("complained");
      await site.smoke.openBrowser();
      return 7;
    },
  ),
}));

vi.mock("../../src/smoke/siteBrowser.ts", () => ({
  openSiteBrowser: vi.fn(() =>
    Promise.resolve({ timeoutMs: 1000, visit: vi.fn(), close: vi.fn() }),
  ),
}));

afterEach(() => {
  process.exitCode = undefined;
  vi.restoreAllMocks();
});

describe("the bfg-site command", () => {
  it("runs its command line in the folder it's run from, and exits with the command's code", async () => {
    // Arrange
    const said = vi.spyOn(console, "log").mockReturnValue();
    const complained = vi.spyOn(console, "error").mockReturnValue();
    // Act
    await import("../../src/bin/bfg-site.ts");
    // Assert
    expect(process.exitCode).toBe(7);
    expect(runBfgSite).toHaveBeenCalledWith(
      process.argv.slice(2),
      expect.objectContaining({ root: process.cwd() }),
    );
    expect(said).toHaveBeenCalledWith("now 20");
    expect(complained).toHaveBeenCalledWith("complained");
    expect(openSiteBrowser).toHaveBeenCalledWith(process.cwd());
  });
});
