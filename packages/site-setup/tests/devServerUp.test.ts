import devServerUp, { devServerAnswersAt, devServerGate } from "../src/devServerUp.ts";

/** The dev-server gate (src/devServerUp.ts): no dev server, no run, and why. */

const SERVER = "http://localhost:4330";

/** A dev server that answers every page with `status`. */
const answering = (status: number): typeof fetch => () => Promise.resolve(new Response("", { status }));

/** No dev server: nothing listening. */
const nobody: typeof fetch = () => Promise.reject(new TypeError("fetch failed"));

describe("whether a dev server answers", () => {
  it.each([
    { what: "a page", fetchPage: answering(200), answer: "up" },
    { what: "an error", fetchPage: answering(500), answer: "down" },
    { what: "nothing", fetchPage: nobody, answer: "down" },
  ])("is $answer when it answers with $what", async ({ fetchPage, answer }) => {
    await expect(devServerAnswersAt(SERVER, fetchPage)).resolves.toBe(answer);
  });
});

describe("the dev-server gate", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("lets the run go on when the dev server answers", async () => {
    await expect(devServerGate({ E2E_BASE_URL: SERVER }, answering(200))).resolves.toBeUndefined();
  });

  it("stops the run, saying how to start the dev server, when it doesn't", async () => {
    await expect(devServerGate({ E2E_BASE_URL: SERVER }, nobody)).rejects.toThrow(
      "No dev server at http://localhost:4330. Start it with `npm run dev`, then run this again.",
    );
  });

  it("stops the run when no config said where the dev server is", async () => {
    await expect(devServerGate({}, answering(200))).rejects.toThrow("E2E_BASE_URL isn't set");
  });

  it("is Playwright's global setup, reading this process's environment", async () => {
    // Arrange
    vi.stubEnv("E2E_BASE_URL", undefined);
    // Act, Assert
    await expect(devServerUp()).rejects.toThrow("E2E_BASE_URL isn't set");
  });
});
