import { DEV_SERVER_URL_ENV } from "./playwright.ts";

/**
 * The dev-server gate: Playwright's global setup (./playwright sets it), which aborts the whole
 * run before any test when the site's dev server doesn't answer, saying how to start it. End-to-end
 * tests never start a server of their own. Loaded in plain Node (review row 8).
 */

/** Whether the dev server at `baseUrl` answers, never throwing. */
export const devServerAnswersAt = (baseUrl: string, fetchPage: typeof fetch): Promise<"up" | "down"> =>
  fetchPage(baseUrl).then(
    (response) => (response.ok ? "up" : "down"),
    () => "down",
  );

/** The gate: the dev server the run's config chose (its address in `env`), answering. */
export async function devServerGate(env: NodeJS.ProcessEnv, fetchPage: typeof fetch): Promise<void> {
  const baseUrl = env[DEV_SERVER_URL_ENV];
  if (baseUrl === undefined) {
    throw new Error(`${DEV_SERVER_URL_ENV} isn't set: is this the site setup's Playwright config?`);
  }
  if ((await devServerAnswersAt(baseUrl, fetchPage)) === "down") {
    throw new Error(`No dev server at ${baseUrl}. Start it with \`npm run dev\`, then run this again.`);
  }
}

export default (): Promise<void> => devServerGate(process.env, fetch);
