import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import devServerUp, { devServerAnswersAt, devServerGate } from "../src/devServerUp.ts";
import { fakeSmoke, HEALTHY } from "./fixtures/smokePages.ts";

/** The dev-server gate (src/devServerUp.ts): no healthy dev server, no run, and why. */

const SERVER = "http://localhost:4330";

/** A dev server that answers every page with `status`. */
const answering =
  (status: number): typeof fetch =>
  () =>
    Promise.resolve(new Response("", { status }));

/** No dev server: nothing listening. */
const nobody: typeof fetch = () => Promise.reject(new TypeError("fetch failed"));

/** A site with an index page and, unless `config` is null, a bfg-site.json. */
function siteWith(config: string | null = '{"devServerPort": 4330}'): string {
  const root = mkdtempSync(join(tmpdir(), "bfg-site-gate-"));
  mkdirSync(join(root, "src", "pages"), { recursive: true });
  writeFileSync(join(root, "src", "pages", "index.astro"), "");
  if (config !== null) {
    writeFileSync(join(root, "bfg-site.json"), config);
  }
  return root;
}

describe("whether a dev server answers", () => {
  it.each([
    { what: "a page", fetchPage: answering(200), answer: "up" },
    { what: "an error", fetchPage: answering(500), answer: "up" },
    { what: "nothing", fetchPage: nobody, answer: "down" },
  ])("is $answer when it answers with $what", async ({ fetchPage, answer }) => {
    await expect(devServerAnswersAt(SERVER, fetchPage)).resolves.toBe(answer);
  });
});

describe("the dev-server gate", () => {
  it("lets the run go on when every page is healthy", async () => {
    // Arrange
    const { ports, seen } = fakeSmoke({ [SERVER]: HEALTHY, [`${SERVER}/`]: HEALTHY });
    // Act, Assert
    await expect(
      devServerGate({ E2E_BASE_URL: SERVER }, siteWith(), ports),
    ).resolves.toBeUndefined();
    expect(seen.visited).toEqual([`${SERVER}/`]);
  });

  it("stops the run, saying each sick page, when one isn't", async () => {
    // Arrange
    const { ports } = fakeSmoke({
      [SERVER]: HEALTHY,
      [`${SERVER}/`]: {
        status: 200,
        visit: { pageErrors: ["_jsxDEV is not a function"], serverErrors: [], ready: false },
      },
    });
    // Act, Assert
    await expect(devServerGate({ E2E_BASE_URL: SERVER }, siteWith(), ports)).rejects.toThrow(
      "  ✗ /: uncaught error: _jsxDEV is not a function",
    );
  });
});

describe("the dev-server gate, before any page", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("stops the run, saying how to start the dev server, when there's none", async () => {
    await expect(
      devServerGate({ E2E_BASE_URL: SERVER }, siteWith(), fakeSmoke({}).ports),
    ).rejects.toThrow(
      "No dev server at http://localhost:4330. Start it with `npm run dev`, then run this again.",
    );
  });

  it("stops the run when the site has no bfg-site.json", async () => {
    await expect(
      devServerGate({ E2E_BASE_URL: SERVER }, siteWith(null), fakeSmoke({}).ports),
    ).rejects.toThrow("No bfg-site.json");
  });

  it("stops the run when no config said where the dev server is", async () => {
    await expect(devServerGate({}, siteWith(), fakeSmoke({}).ports)).rejects.toThrow(
      "E2E_BASE_URL isn't set",
    );
  });

  it("is Playwright's global setup, reading this process's environment and folder", async () => {
    // Arrange
    const root = siteWith(null);
    vi.stubEnv("E2E_BASE_URL", SERVER);
    vi.spyOn(process, "cwd").mockReturnValue(root);
    // Act, Assert
    await expect(devServerUp()).rejects.toThrow(
      `No bfg-site.json at ${join(root, "bfg-site.json")}`,
    );
  });
});
